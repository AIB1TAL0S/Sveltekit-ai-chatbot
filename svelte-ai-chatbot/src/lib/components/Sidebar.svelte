<script>
	let {
		agents = $bindable(),
		selectedAgent = $bindable(),
		isOpen = $bindable(false),
		onSelectAgent,
		onAddAgent
	} = $props();

	let isCreating = $state(false);
	let newAgentName = $state('');
	let newAgentPrompt = $state('');

	function handleCreate() {
		if (!newAgentName.trim() || !newAgentPrompt.trim()) return;
		
		onAddAgent({
			name: newAgentName.trim(),
			systemPrompt: newAgentPrompt.trim()
		});

		newAgentName = '';
		newAgentPrompt = '';
		isCreating = false;
	}

	function handleCancel() {
		newAgentName = '';
		newAgentPrompt = '';
		isCreating = false;
	}
</script>

	<div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300 {isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}" onclick={() => isOpen = false} aria-hidden="true"></div>
	
	<div class="fixed md:relative inset-y-0 left-0 z-40 w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col h-full transition-transform duration-300 transform {isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} shadow-xl md:shadow-none">
	<div class="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
		<h2 class="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
			<svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
			</svg>
			AI persona
		</h2>
		<button onclick={() => isOpen = false} class="md:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
	</div>

	<div class="flex-1 overflow-y-auto p-2 space-y-2">
		{#each agents as agent (agent.id)}
			<button
				class="w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3 group
				{selectedAgent.id === agent.id 
					? 'bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800 shadow-sm' 
					: 'hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'}"
				onclick={() => onSelectAgent(agent)}
				aria-label="Select persona {agent.name}"
			>
				<div class="w-8 h-8 rounded-full bg-gradient-to-br {selectedAgent.id === agent.id ? 'from-blue-500 to-purple-600' : 'from-slate-400 to-slate-500'} flex items-center justify-center text-white font-bold text-xs shadow-sm">
					{agent.name.substring(0, 2).toUpperCase()}
				</div>
				<div class="flex-1 min-w-0">
					<div class="font-medium text-slate-900 dark:text-slate-100 truncate">{agent.name}</div>
					<div class="text-xs text-slate-500 dark:text-slate-400 truncate">{agent.systemPrompt.substring(0, 30)}...</div>
				</div>
			</button>
		{/each}
	</div>

	<div class="p-4 border-t border-slate-200 dark:border-slate-700">
		<button
			onclick={() => isCreating = true}
			class="w-full py-2.5 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 text-slate-700 dark:text-slate-200 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md group"
		>
			<svg class="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
			<span class="font-medium">Create New Persona</span>
		</button>
	</div>
</div>

{#if isCreating}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
		<div class="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200">
			<div class="p-6">
				<h3 class="text-xl font-bold text-slate-900 dark:text-white mb-4">Create New AI Agent</h3>
				
				<div class="space-y-4">
					<div>
						<label for="agent-name" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Persona Name</label>
						<input
							id="agent-name"
							type="text"
							bind:value={newAgentName}
							placeholder="e.g., Pirate Captain"
							class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
						/>
					</div>
					
					<div>
						<label for="agent-prompt" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">System Prompt</label>
						<textarea
							id="agent-prompt"
							bind:value={newAgentPrompt}
							placeholder="Describe how the ai persona should behave (e.g., You are a pirate captain who loves treasure...)"
							rows="4"
							class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
						></textarea>
					</div>
				</div>

				<div class="mt-6 flex gap-3 justify-end">
					<button
						onclick={handleCancel}
						class="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
					>
						Cancel
					</button>
					<button
						onclick={handleCreate}
						disabled={!newAgentName.trim() || !newAgentPrompt.trim()}
						class="px-6 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
					>
						Create Persona
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
