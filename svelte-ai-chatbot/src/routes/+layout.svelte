<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>AI Chatbot - n8n</title>
	<meta name="description" content="AI Chatbot with RAG, TTS, and STT powered by n8n" />
</svelte:head>

<div class="h-screen overflow-hidden">
	{@render children()}
</div>
