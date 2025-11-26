<script>
	let {
		inputMessage = $bindable(),
		isLoading,
		isRecording,
		recordingTime,
		isListening,
		isSpeaking,
		sendMessage,
		startRecording,
		stopRecording,
		startListening,
		stopListening,
		stopSpeaking
	} = $props();

	function handleWindowKeydown(event) {
		if (event.key === 'Enter' && !event.shiftKey) {
			if (isSpeaking) {
				event.preventDefault();
				stopSpeaking();
			} else if (isRecording) {
				event.preventDefault();
				stopRecording();
			} else if (isListening) {
				event.preventDefault();
				stopListening();
			}
		}
	}

	function handleKeyPress(event) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			if (isSpeaking) {
				stopSpeaking();
			} else if (!isRecording && !isListening) {
				sendMessage();
			}
		}
	}
</script>

<svelte:window onkeydown={handleWindowKeydown} />

<div class="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
	<div class="max-w-4xl mx-auto px-4 py-4">
		<div class="flex gap-2 items-end">
			<div class="flex-1 relative">
				<textarea
					bind:value={inputMessage}
					onkeydown={handleKeyPress}
					placeholder="message or voice"
					disabled={isLoading}
					rows="1"
					class="w-full px-4 py-3 pr-24 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
					oninput={(e) => {
						e.target.style.height = 'auto';
						e.target.style.height = e.target.scrollHeight + 'px';
					}}
				></textarea>

				<div class="absolute right-2 bottom-2 flex gap-2">
					{#if isSpeaking}
						<button
							onclick={stopSpeaking}
							class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
							title="Stop speaking"
						>
							<svg
								class="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
								/>
							</svg>
						</button>
					{/if}

					<!-- Microphone Button (Conversational STT) -->
					<button
						onclick={() => {
							if (isListening) {
								stopListening();
							} else if (isRecording) {
								stopRecording();
							} else {
								// Prefer Browser STT (Conversational)
								startListening();
								// Fallback to Audio Recording if STT not available is handled in startListening
							}
						}}
						disabled={isLoading}
						class="p-2 {isListening || isRecording
							? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 animate-pulse'
							: 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-600'} rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						title={isListening ? 'Stop listening' : isRecording ? 'Stop recording' : 'Voice Input'}
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							{#if isListening || isRecording}
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
								/>
							{:else}
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
								/>
							{/if}
						</svg>
					</button>

				</div>
			</div>

			<button
				onclick={sendMessage}
				disabled={!inputMessage.trim() || isLoading}
				class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
			>
				{#if isLoading}
					<svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
						<circle
							class="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
				{:else}
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
						/>
					</svg>
				{/if}
				Send
			</button>
		</div>

		{#if isRecording}
			<div class="mt-2 text-sm text-red-500 flex items-center gap-2">
				<div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
				Recording... {Math.floor(recordingTime / 60)}:{(recordingTime % 60)
					.toString()
					.padStart(2, '0')}
			</div>
		{:else if isListening}
			<div class="mt-2 text-sm text-blue-500 flex items-center gap-2">
				<div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
				Listening...
			</div>
		{/if}
	</div>
</div>
