import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { GoogleGenerativeAI } from '@google/generative-ai';


export async function POST({ request }) {
	try {
		const { message, conversationHistory, systemPrompt } = await request.json();

		if (!message || typeof message !== 'string') {
			return json({ error: 'Message is required' }, { status: 400 });
		}

		const apiKey = env.GEMINI_API_KEY;
		if (!apiKey) {
			console.error('GEMINI_API_KEY is missing');
			return json({ error: 'Server configuration error: API key missing' }, { status: 500 });
		}

		const genAI = new GoogleGenerativeAI(apiKey);
		const defaultSystemInstruction = "You are a helpful, witty, and knowledgeable AI assistant. You provide concise and conversational responses. You are powered by Google Gemini.";

		const model = genAI.getGenerativeModel({
			model: 'gemini-2.0-flash',
			systemInstruction: systemPrompt || defaultSystemInstruction
		});


		let historyForGemini = [];

		if (conversationHistory && Array.isArray(conversationHistory)) {

			const historyToProcess = [...conversationHistory];
			const lastMsg = historyToProcess[historyToProcess.length - 1];

			if (lastMsg && lastMsg.role === 'user' && lastMsg.content === message) {
				historyToProcess.pop();
			}

			historyForGemini = historyToProcess.map(msg => ({
				role: msg.role === 'assistant' ? 'model' : 'user',
				parts: [{ text: msg.content }]
			}));
		}

		const chat = model.startChat({
			history: historyForGemini,
		});

		const result = await chat.sendMessage(message);
		const response = await result.response;
		const text = response.text();

		return json({
			response: text,
			sources: [],
			metadata: {}
		});

	} catch (error) {
		console.error('Error calling Gemini API:', error);
		return json(
			{
				error: 'Failed to get response from AI',
				message: error.message
			},
			{ status: 500 }
		);
	}
}

