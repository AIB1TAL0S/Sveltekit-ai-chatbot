import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST({ request }) {
	try {
		const formData = await request.formData();
		const audioBlob = formData.get('audio');
		const message = formData.get('message') || '';

		if (!audioBlob || !(audioBlob instanceof Blob)) {
			return json({ error: 'Audio is required' }, { status: 400 });
		}

		const systemPrompt = formData.get('systemPrompt');

		const apiKey = env.GEMINI_API_KEY;
		if (!apiKey) {
			return json({ error: 'Server configuration error: API key missing' }, { status: 500 });
		}

		const maxSize = 10 * 1024 * 1024; // 10MB
		if (audioBlob.size > maxSize) {
			return json({ error: 'Audio size exceeds 10MB limit' }, { status: 400 });
		}

		const arrayBuffer = await audioBlob.arrayBuffer();
		const base64 = Buffer.from(arrayBuffer).toString('base64');

		const genAI = new GoogleGenerativeAI(apiKey);
		const defaultSystemInstruction = "You are a helpful, witty, and knowledgeable AI assistant. You provide concise and conversational responses. You are powered by Google Gemini.";

		const model = genAI.getGenerativeModel({
			model: 'gemini-2.0-flash',
			systemInstruction: systemPrompt || defaultSystemInstruction
		});

		const parts = [];
		// Prompt Gemini to transcribe and respond
		const prompt = message
			? `${message}\n\nPlease transcribe the audio and then respond to it. Return the response in JSON format with keys: "transcript" and "response".`
			: `Please transcribe the audio and then respond to it. Return the response in JSON format with keys: "transcript" and "response".`;

		parts.push({ text: prompt });

		parts.push({
			inlineData: {
				mimeType: audioBlob.type || 'audio/webm',
				data: base64
			}
		});

		const result = await model.generateContent({
			contents: [{ role: 'user', parts: parts }],
			generationConfig: { responseMimeType: "application/json" }
		});

		const response = await result.response;
		const text = response.text();
		let data = {};
		try {
			data = JSON.parse(text);
		} catch (e) {
			console.error("Failed to parse JSON response from Gemini", text);
			data = { response: text, transcript: "" };
		}

		return json({
			response: data.response || text,
			transcript: data.transcript || '',
			sources: [],
			metadata: {}
		});

	} catch (error) {
		console.error('Error processing audio with Gemini:', error);
		return json(
			{
				error: 'Failed to process audio',
				message: error.message
			},
			{ status: 500 }
		);
	}
}

