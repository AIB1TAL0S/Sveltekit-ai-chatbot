<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>gemini-ai-chatbot</title>
	<meta name="description" content="AI Chatbot with TTS, and STT powered by gemini" />
</svelte:head>

<div class="h-screen overflow-hidden">
	{@render children()}
</div>
