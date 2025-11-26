<script>
	import { onMount } from 'svelte';
	import ChatHeader from './chat/ChatHeader.svelte';
	import MessageList from './chat/MessageList.svelte';
	import ChatInput from './chat/ChatInput.svelte';
	import Sidebar from './Sidebar.svelte';

	let messages = $state([]);
	let inputMessage = $state('');
	let isLoading = $state(false);
	let isListening = $state(false);
	let isSpeaking = $state(false);
	let autoSpeak = $state(true); //  default true
	let conversationMode = $state(true); // default true 
	let conversationHistory = $state([]);

	let isRecording = $state(false);
	let recordingTime = $state(0);
	let isSidebarOpen = $state(false);

	// Agents persona

	let agents = $state([
		{
			id: 'default',
			name: 'General Assistant',
			systemPrompt: `Act as a highly reliable and helpful General Assistant.

	Your rules:
	1. Provide accurate, clear, and concise information.
	2. Adjust explanations to the user's skill level.
	3. Ask clarifying questions when needed instead of guessing.
	4. Avoid fabricating facts, numbers, or sources.
	5. Maintain a friendly, respectful, and professional tone.
	6. Give practical, actionable advice instead of long philosophical replies.
	7. Prioritize correctness, usefulness, and clarity.`
		},
		{
			id: 'coder',
			name: 'Coding Expert',
			systemPrompt: `Act as an expert Software Engineer and Coding Specialist.

	Your rules:
	1. Provide clean, optimized, and production-ready code.
	2. Use modern best practices and secure coding standards.
	3. When debugging, identify root causes and propose clear fixes.
	4. When explaining, break concepts down clearly and with examples.
	5. When user provides code, improve it and explain the changes.
	6. Avoid unnecessary complexity or over-engineering.
	7. Ensure code runs as-is unless the user specifies otherwise.`
		},
		{
			id: 'writer',
			name: 'Creative Writer',
			systemPrompt: `Act as a Creative Writer and Narrative Designer.

	Your rules:
	1. Write with vivid imagery, strong voice, and emotional depth.
	2. Match the style, tone, and genre requested by the user.
	3. Avoid clichés unless intentionally used for effect.
	4. Create consistent characters, setting, and narrative flow.
	5. Offer multiple versions (short, long, punchy, poetic) when appropriate.
	6. When editing, improve clarity and creativity while keeping the user’s intent.
	7. Produce compelling, polished writing that feels professional.`
		},
		{
			id: 'coach',
			name: 'Productivity Coach',
			systemPrompt: `Act as a Productivity Coach and Focus Mentor.

	Your rules:
	1. Provide practical, easy-to-apply productivity strategies.
	2. Adapt suggestions to the user’s lifestyle and goals.
	3. Break tasks into small, actionable steps.
	4. Offer routines, planning systems, and prioritization methods.
	5. Encourage without being overly motivational or preachy.
	6. Ask clarifying questions about goals and habits when appropriate.
	7. Keep solutions realistic, sustainable, and flexible.`
		},
		{
			id: 'tutor',
			name: 'Language Tutor',
			systemPrompt: `Act as a Language Tutor and Communication Coach.

	Your rules:
	1. Explain grammar, vocabulary, and expressions clearly.
	2. Adjust difficulty to the learner’s level.
	3. Provide examples, exercises, and corrections when needed.
	4. Teach step-by-step without overwhelming the learner.
	5. Encourage conversation practice with natural language usage.
	6. Maintain a supportive, non-judgmental tone.
	7. When giving corrections, show both the incorrect and corrected forms.`
		}
	]);
	let selectedAgent = $state(agents[0]);

	function handleAddAgent(newAgent) {
		const agent = {
			id: Date.now().toString(),
			...newAgent
		};
		agents = [...agents, agent];
		saveChatState();
		selectedAgent = agent;
		loadChatState(agent.id);
		sendHiddenMessage(`System Instruction: ${agent.systemPrompt}`);
	}

	function handleSelectAgent(agent) {
		if (selectedAgent.id !== agent.id) {
			saveChatState();
			selectedAgent = agent;
			loadChatState(agent.id);
			if (messages.length === 0) {
				sendHiddenMessage(`System Instruction: ${agent.systemPrompt}`);
			}
		}
	}

	let recognition = null;
	let synthesis = null;
	let messageList = null; // Reference to MessageList component
	let mediaRecorder = null;
	let audioChunks = [];
	let recordingInterval = null;
	let silenceTimer = null;
	let stream = null;

	let agentSessions = {};

	// Load state from memory
	function loadChatState(agentId) {
		const targetId = agentId || selectedAgent.id;
		const session = agentSessions[targetId];

		if (session) {
			messages = session.messages;
			conversationHistory = session.history;
		} else {
			messages = [];
			conversationHistory = [];
		}
	}

	// Save state to memory
	function saveChatState() {
		if (selectedAgent) {
			agentSessions[selectedAgent.id] = {
				messages: [...messages],
				history: [...conversationHistory]
			};
		}
	}

	// Save state whenever it changes
	$effect(() => {
		saveChatState();
	});

	onMount(() => {
		loadChatState(selectedAgent.id);

		// Initialize Web Speech API
		if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
			const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
			recognition = new SpeechRecognition();
			recognition.continuous = false;
			recognition.interimResults = true; // Enable interim results for better silence detection
			recognition.lang = 'en-US';

			recognition.onresult = (event) => {
				const transcript = Array.from(event.results)
					.map((result) => result[0].transcript)
					.join('');
				
				inputMessage = transcript;
				
			};

			recognition.onerror = (event) => {
				console.error('Speech recognition error:', event.error);
				isListening = false;
			};

			recognition.onend = () => {
				isListening = false;
			};
		}

		// Initialize Web Speech Synthesis API
		if ('speechSynthesis' in window) {
			synthesis = window.speechSynthesis;
		}

		// Add welcome message if chat is empty
		if (messages.length === 0) {
			const welcomeText = "Hello! I'm your AI assistant. How can I help you today?";
			messages = [
				{
					id: Date.now(),
					role: 'assistant',
					content: welcomeText,
					timestamp: new Date()
				}
			];
			
			// Initial hidden prompt (run in background)
			sendHiddenMessage("Initialize session. Be ready to assist.");

			// Speak welcome message for the ai to communicate first 
			setTimeout(() => {
				if (autoSpeak) {
					speakText(welcomeText);
				}
			}, 1000);
		}
	});

	async function sendHiddenMessage(content) {
		if (!content) return;

		// Add to history but NOT to messages (UI)
		conversationHistory = [...conversationHistory, { role: 'user', content: content }];

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					message: content,
					conversationHistory: conversationHistory.slice(-10), // Keep last 10 messages for context
					systemPrompt: selectedAgent.systemPrompt
				})
			});

			const data = await response.json();

			if (response.ok) {
				// Add response to history but NOT to messages (UI)
				conversationHistory = [...conversationHistory, { role: 'assistant', content: data.response }];
			} else {
				console.error('Failed to send hidden message:', data.error);
			}
		} catch (error) {
			console.error('Error sending hidden message:', error);
		}
	}

	async function sendMessage() {
		if (!inputMessage.trim() || isLoading) return;

		const userMessage = {
			id: Date.now(),
			role: 'user',
			content: inputMessage.trim(),
			timestamp: new Date()
		};

		messages = [...messages, userMessage];
		conversationHistory = [...conversationHistory, { role: 'user', content: inputMessage.trim() }];

		const messageToSend = inputMessage.trim();
		inputMessage = '';
		isLoading = true;

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					message: messageToSend,
					conversationHistory: conversationHistory.slice(-10), // Keep last 10 messages for context
					systemPrompt: selectedAgent.systemPrompt
				})
			});

			const data = await response.json();

			if (response.ok) {
				const assistantMessage = {
					id: Date.now() + 1,
					role: 'assistant',
					content: data.response,
					sources: data.sources || [],
					timestamp: new Date()
				};

				messages = [...messages, assistantMessage];
				conversationHistory = [...conversationHistory, { role: 'assistant', content: data.response }];

				// Auto-speak if enabled or in conversation mode
				if ((autoSpeak || conversationMode) && data.response) {
					setTimeout(() => {
						speakText(data.response);
					}, 300);
				}

				// Auto-scroll to bottom
				setTimeout(() => {
					if (messageList) {
						messageList.scrollToBottom();
					}
				}, 100);
			} else {
				throw new Error(data.error || 'Failed to get response');
			}
		} catch (error) {
			console.error('Error sending message:', error);
			const errorMessage = {
				id: Date.now() + 1,
				role: 'assistant',
				content: `Sorry, I encountered an error: ${error.message || 'Unknown error'}. Please try again.`,
				error: true,
				timestamp: new Date()
			};
			messages = [...messages, errorMessage];
		} finally {
			isLoading = false;
		}
	}

	async function startRecording() {
		try {
			// Request microphone access
			stream = await navigator.mediaDevices.getUserMedia({ audio: true });

			// Create MediaRecorder
			const options = {
				mimeType: 'audio/webm;codecs=opus'
			};

			// Try different audio formats for better browser compatibility
			if (MediaRecorder.isTypeSupported('audio/webm')) {
				options.mimeType = 'audio/webm';
			} else if (MediaRecorder.isTypeSupported('audio/mp4')) {
				options.mimeType = 'audio/mp4';
			} else if (MediaRecorder.isTypeSupported('audio/ogg')) {
				options.mimeType = 'audio/ogg';
			}

			mediaRecorder = new MediaRecorder(stream, options);
			audioChunks = [];

			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					audioChunks.push(event.data);
				}
			};

			mediaRecorder.onstop = async () => {
				const audioBlob = new Blob(audioChunks, { type: options.mimeType });
				await sendAudioToN8n(audioBlob);

				// Stop all tracks
				if (stream) {
					stream.getTracks().forEach((track) => track.stop());
					stream = null;
				}
			};

			mediaRecorder.onerror = (event) => {
				console.error('MediaRecorder error:', event);
				stopRecording();
			};

			mediaRecorder.start();
			isRecording = true;
			recordingTime = 0;

			// Start recording timer
			recordingInterval = setInterval(() => {
				recordingTime++;
			}, 1000);
		} catch (error) {
			console.error('Error starting recording:', error);
			alert('Failed to access microphone. Please check your permissions.');
			isRecording = false;
		}
	}

	function stopRecording() {
		if (!mediaRecorder || !isRecording) return;

		mediaRecorder.stop();
		isRecording = false;
		recordingTime = 0;

		if (recordingInterval) {
			clearInterval(recordingInterval);
			recordingInterval = null;
		}
	}

	async function sendAudioToN8n(audioBlob) {
		isLoading = true;

		try {
			const formData = new FormData();
			formData.append('audio', audioBlob);
			formData.append('message', inputMessage.trim() || '');
			formData.append('systemPrompt', selectedAgent.systemPrompt); // Send system prompt with audio

			const response = await fetch('/api/audio', {
				method: 'POST',
				body: formData
			});

			const data = await response.json();

			if (response.ok) {
				// Use transcript from n8n if available, otherwise use the response
				const transcript = data.transcript || '';
				// const userMessageContent = transcript || '🎤 Audio message';

				// Add user message with transcript
				if (transcript) {
					const userMessage = {
						id: Date.now(),
						role: 'user',
						content: transcript,
						audio: true,
						timestamp: new Date()
					};
					messages = [...messages, userMessage];
					conversationHistory = [...conversationHistory, { role: 'user', content: transcript }];
				} else {
					const userMessage = {
						id: Date.now(),
						role: 'user',
						content: '🎤 Audio message',
						audio: true,
						timestamp: new Date()
					};
					messages = [...messages, userMessage];
					conversationHistory = [
						...conversationHistory,
						{ role: 'user', content: 'Audio message' }
					];
				}

				// Add AI response
				const assistantMessage = {
					id: Date.now() + 1,
					role: 'assistant',
					content: data.response,
					sources: data.sources || [],
					timestamp: new Date()
				};

				messages = [...messages, assistantMessage];
				conversationHistory = [...conversationHistory, { role: 'assistant', content: data.response }];

				// Auto-speak if enabled or in conversation mode
				if ((autoSpeak || conversationMode) && data.response) {
					setTimeout(() => {
						speakText(data.response);
					}, 300);
				}

				// Clear input
				inputMessage = '';

				// Auto-scroll to bottom
				setTimeout(() => {
					if (messageList) {
						messageList.scrollToBottom();
					}
				}, 100);
			} else {
				throw new Error(data.error || 'Failed to process audio');
			}
		} catch (error) {
			console.error('Error sending audio to n8n:', error);
			const errorMessage = {
				id: Date.now() + 1,
				role: 'assistant',
				content: `Sorry, I encountered an error processing the audio: ${error.message}`,
				error: true,
				timestamp: new Date()
			};
			messages = [...messages, errorMessage];
		} finally {
			isLoading = false;
		}
	}

	// Browser STT as primary option, fallback to MediaRecorder
	function startListening() {
		if (isListening || isRecording) return;

		if (!recognition) {
			// Fallback to audio recording if Web Speech API is not available
			startRecording();
			return;
		}

		isListening = true;
		try {
			recognition.start();
		} catch (e) {
			console.error('Failed to start recognition:', e);
			isListening = false;
			// Fallback
			startRecording();
		}
	}

	function stopListening() {
		if (recognition && isListening) {
			recognition.stop();
			isListening = false;
		}
	}

	function speakText(text) {
		if (!synthesis || isSpeaking) return;

		// Stop any ongoing speech
		synthesis.cancel();

		const utterance = new SpeechSynthesisUtterance(text);
		utterance.lang = 'en-US';
		utterance.rate = 1.0;
		utterance.pitch = 1.0;
		utterance.volume = 1.0;

		utterance.onstart = () => {
			isSpeaking = true;
		};

		utterance.onend = () => {
			isSpeaking = false;
			if (conversationMode) {
				startListening();
			}
		};

		utterance.onerror = (event) => {
			console.error('Speech synthesis error:', event);
			isSpeaking = false;
		};

		synthesis.speak(utterance);
	}

	function stopSpeaking() {
		if (synthesis) {
			synthesis.cancel();
			isSpeaking = false;
		}
	}

	function clearChat() {
		messages = [
			{
				id: Date.now(),
				role: 'assistant',
				content: "Chat cleared. How can I help you?",
				timestamp: new Date()
			}
		];
		conversationHistory = [];
	}


</script>

<div class="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
	<!-- Sidebar -->
	<Sidebar 
		bind:agents 
		bind:selectedAgent 
		bind:isOpen={isSidebarOpen}
		onAddAgent={handleAddAgent}
		onSelectAgent={(agent) => {
			handleSelectAgent(agent);
			isSidebarOpen = false; // Close sidebar on mobile when agent selected
		}}
	/>

	<!-- Main Chat Area -->
	<div class="flex-1 flex flex-col h-full min-w-0 relative">
		<ChatHeader bind:autoSpeak bind:conversationMode {clearChat} {selectedAgent} onToggleSidebar={() => isSidebarOpen = !isSidebarOpen} />

		<MessageList bind:this={messageList} {messages} {isLoading} {isSpeaking} {speakText} />

		<ChatInput
			bind:inputMessage
			{isLoading}
			{isRecording}
			{recordingTime}
			{isListening}
			{isSpeaking}
			{sendMessage}
			{startRecording}
			{stopRecording}
			{startListening}
			{stopListening}
			{stopSpeaking}
		/>
	</div>
</div>
