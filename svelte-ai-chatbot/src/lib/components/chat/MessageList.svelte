<script>
	import OrganicSphere from '../OrganicSphere.svelte';
	import { formatFileSize } from '$lib/utils/format';

	let { messages = [], isLoading = false, isSpeaking = false, speakText } = $props();

	let messagesEnd = $state(null);

	export function scrollToBottom() {
		if (messagesEnd) {
			messagesEnd.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<div class="flex-1 overflow-y-auto px-4 py-6 relative">
	<!-- Centered Large Vibrant Jarvis Sphere -->
	<div class="centered-jarvis-sphere">
		<OrganicSphere {isLoading} {isSpeaking} size={400} vibrant={true} />
	</div>

	<div class="max-w-4xl mx-auto space-y-4 relative z-10">
		{#each messages as message (message.id)}
			<div class="flex gap-3 {message.role === 'user' ? 'justify-end' : 'justify-start'}">
				{#if message.role === 'assistant'}
					<div class="ai-avatar-container flex-shrink-0">
						<OrganicSphere isLoading={false} {isSpeaking} size={48} vibrant={true} />
					</div>
				{/if}

				<div
					class="max-w-[80%] rounded-2xl px-4 py-3 {message.role === 'user'
						? 'bg-blue-500 text-white'
						: message.error
							? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
							: 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'}"
				>
					{#if message.file}
						<div
							class="flex items-center gap-2 mb-2 p-2 bg-white/10 dark:bg-slate-700/50 rounded-lg"
						>
							<svg
								class="w-5 h-5 flex-shrink-0"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
							<div class="flex-1 min-w-0">
								<p class="text-sm font-medium truncate">{message.file.name}</p>
								<p class="text-xs opacity-75">{formatFileSize(message.file.size)}</p>
							</div>
						</div>
					{/if}
					{#if message.audio}
						<div
							class="flex items-center gap-2 mb-2 p-2 bg-white/10 dark:bg-slate-700/50 rounded-lg"
						>
							<svg
								class="w-5 h-5 flex-shrink-0"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
								/>
							</svg>
							<div class="flex-1 min-w-0">
								<p class="text-sm font-medium">🎤 Audio message</p>
							</div>
						</div>
					{/if}
					<p class="whitespace-pre-wrap break-words">{message.content}</p>

					{#if message.sources && message.sources.length > 0}
						<div class="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
							<p class="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
								Sources:
							</p>
							<ul class="space-y-1">
								{#each message.sources as source}
									<li class="text-xs text-slate-500 dark:text-slate-500">
										• {source}
									</li>
								{/each}
							</ul>
						</div>
					{/if}

					{#if message.role === 'assistant' && !message.error}
						<button
							onclick={() => speakText(message.content)}
							class="mt-2 text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
						>
							<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
								/>
							</svg>
							Speak
						</button>
					{/if}
				</div>

				{#if message.role === 'user'}
					<div
						class="w-8 h-8 bg-slate-300 dark:bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0"
					>
						<svg
							class="w-5 h-5 text-slate-600 dark:text-slate-300"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
					</div>
				{/if}
			</div>
		{/each}

		{#if isLoading}
			<div class="flex gap-3 justify-start">
				<div class="ai-avatar-container flex-shrink-0">
					<OrganicSphere isLoading={true} isSpeaking={false} size={48} vibrant={true} />
				</div>
				<div
					class="bg-white dark:bg-slate-800 rounded-2xl px-4 py-3 shadow-sm border border-slate-200 dark:border-slate-700"
				>
					<div class="flex gap-1">
						<div
							class="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
							style="animation-delay: 0ms"
						></div>
						<div
							class="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
							style="animation-delay: 150ms"
						></div>
						<div
							class="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
							style="animation-delay: 300ms"
						></div>
					</div>
				</div>
			</div>
		{/if}

		<div bind:this={messagesEnd}></div>
	</div>
</div>

<style>
	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	/* AI Avatar Container */
	.ai-avatar-container {
		width: 48px;
		height: 48px;
		position: relative;
	}

	/* Centered Jarvis Sphere */
	.centered-jarvis-sphere {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 1;
		pointer-events: none;
		opacity: 0.15;
		transition: opacity 0.3s ease;
	}

	.centered-jarvis-sphere:hover {
		opacity: 0.25;
	}

	/* Make messages area have relative positioning for z-index */
	.flex-1.overflow-y-auto {
		position: relative;
	}
</style>
