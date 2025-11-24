<script>
	let { autoSpeak = $bindable(), conversationMode = $bindable(), clearChat, selectedAgent, onToggleSidebar } = $props();
</script>

<header class="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
    <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
            <button 
                onclick={onToggleSidebar}
                class="md:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="Toggle Sidebar"
            >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg
                    class="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                </svg>
            </div>
            <div>
                <h1 class="text-xl font-bold text-slate-900 dark:text-white">{selectedAgent?.name || 'AI Chatbot'}</h1>
                <p class="text-sm text-slate-500 dark:text-slate-400">Powered by Google Gemini</p>
            </div>
        </div>
        <div class="flex items-center gap-2">
            <button
                onclick={() => {
                    conversationMode = !conversationMode;
                    if (conversationMode) autoSpeak = true;
                }}
                class="px-3 py-2 text-sm flex items-center gap-2 {conversationMode
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'} rounded-lg transition-colors"
                title={conversationMode ? 'Conversation Mode ON' : 'Conversation Mode OFF'}
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                </svg>
                <span class="hidden sm:inline">{conversationMode ? 'Conv. Mode ON' : 'Conv. Mode OFF'}</span>
            </button>
            <button
                onclick={() => (autoSpeak = !autoSpeak)}
                class="px-3 py-2 text-sm flex items-center gap-2 {autoSpeak
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'} rounded-lg transition-colors"
                title={autoSpeak ? 'Auto-speak enabled' : 'Auto-speak disabled'}
            >
                <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                </svg>
                <span class="hidden sm:inline">{autoSpeak ? 'Auto-speak ON' : 'Auto-speak OFF'}</span>
            </button>
            <button
                onclick={clearChat}
                class="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
                Clear Chat
            </button>
        </div>
    </div>
</header>
