import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * POST handler for the chat API.
 * Receives a message and conversation history, interacts with the Google Gemini API,
 * and returns the AI's response.
 */
export async function POST({ request }) {
	try {
		const { message, conversationHistory, systemPrompt } = await request.json();

		// 1. Validate the input message
		if (!message || typeof message !== 'string') {
			return json({ error: 'Message is required' }, { status: 400 });
		}

		// 2. Retrieve and validate the API key
		const apiKey = env.GEMINI_API_KEY;
		if (!apiKey) {
			console.error('GEMINI_API_KEY is missing');
			return json({ error: 'Server configuration error: API key missing' }, { status: 500 });
		}

		// 3. Initialize the Google Generative AI client
		const genAI = new GoogleGenerativeAI(apiKey);
		const defaultSystemInstruction = "You are a helpful, witty, and knowledgeable AI assistant. You provide concise and conversational responses. You are powered by Google Gemini.";

		const model = genAI.getGenerativeModel({
			model: 'gemini-2.0-flash',
			systemInstruction: systemPrompt || defaultSystemInstruction
		});


		// 4. Prepare conversation history for Gemini
		// The API expects history in a specific format ({ role: 'user' | 'model', parts: [...] }).
		let historyForGemini = [];

		if (conversationHistory && Array.isArray(conversationHistory)) {

			// Create a copy to avoid mutating the original array
			const historyToProcess = [...conversationHistory];
			const lastMsg = historyToProcess[historyToProcess.length - 1];

			// Check if the last message in history is the same as the current new message.
			// If the client optimistically added the user message to history, we remove it here
			// to avoid sending it twice (once in history, once as the new message).
			if (lastMsg && lastMsg.role === 'user' && lastMsg.content === message) {
				historyToProcess.pop();
			}

			// Map the history to the format required by the Gemini SDK
			historyForGemini = historyToProcess.map(msg => ({
				role: msg.role === 'assistant' ? 'model' : 'user',
				parts: [{ text: msg.content }]
			}));
		}

		// 5. Start the chat session with the prepared history
		const chat = model.startChat({
			history: historyForGemini,
		});

		// 6. Send the new message and get the response
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

