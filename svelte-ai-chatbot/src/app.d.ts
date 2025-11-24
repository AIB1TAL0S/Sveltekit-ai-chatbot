// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface Window {
		SpeechRecognition: typeof SpeechRecognition;
		webkitSpeechRecognition: typeof SpeechRecognition;
	}

	interface SpeechRecognition extends EventTarget {
		continuous: boolean;
		interimResults: boolean;
		lang: string;
		start(): void;
		stop(): void;
		abort(): void;
		onresult: ((event: SpeechRecognitionEvent) => void) | null;
		onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
		onend: (() => void) | null;
	}

	interface SpeechRecognitionEvent {
		results: SpeechRecognitionResultList;
		resultIndex: number;
	}

	interface SpeechRecognitionErrorEvent {
		error: string;
		message: string;
	}

	interface SpeechRecognitionResultList {
		length: number;
		item(index: number): SpeechRecognitionResult;
		[index: number]: SpeechRecognitionResult;
	}

	interface SpeechRecognitionResult {
		length: number;
		item(index: number): SpeechRecognitionAlternative;
		[index: number]: SpeechRecognitionAlternative;
		isFinal: boolean;
	}

	interface SpeechRecognitionAlternative {
		transcript: string;
		confidence: number;
	}

	var SpeechRecognition: {
		prototype: SpeechRecognition;
		new (): SpeechRecognition;
	};

	var webkitSpeechRecognition: {
		prototype: SpeechRecognition;
		new (): SpeechRecognition;
	};
}

export {};

