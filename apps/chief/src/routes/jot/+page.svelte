<script>
	/**
	 * F2 Capture — Q1 Quick Jot.
	 * No category picker anywhere on this screen: classification is the
	 * machine's job, and the user's job is to say the thing before they
	 * forget it.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Hero, Banner, Field, Seg, Appr, Alert, Row, Btn, Note } from '$lib/kit';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let mode = $state(1);
	// QS1-QS3 are states of this screen, not separate destinations.
	const view = $derived($page.url.searchParams.get('state') ?? 'default');
</script>

<svelte:head><title>Quick Jot · Chief</title></svelte:head>

<Screen>
	{#if view === 'empty'}
		<!-- A teaching moment, not a blank screen. The example is deliberately
		     a compound sentence, because that is the whole trick. -->
		<Hero
			t="ai"
			title="Your first jot"
			meta="Say or type one sentence. A task, a name, a receipt, an idea — anything."
		/>
		<Banner
			t="ai"
			title="Try something like"
			meta="“Call Mum on Sunday and pay the Azbolt invoice”"
		/>
		<Btn t="ai" href="/jot/listening" label="Start with voice" />
		<Btn primary={false} href="/jot" label="Type instead" />
	{:else if view === 'populated'}
		<Banner t="ai" title="4 placements ready" meta="From one six-second jot." />
		<Appr
			title="Task · Call my daughter"
			meta="Personal · linked to Daughter"
			confidence="97%"
			index={1}
			total={3}
		/>
		<Appr
			title="Calendar · 7:00–7:20 PM"
			meta="Tonight · personal block"
			confidence="94%"
			index={2}
			total={3}
		/>
		<Appr
			title="Task · Talk to Carmen"
			meta="Azbolt · linked to Carmen"
			confidence="91%"
			index={3}
			total={3}
		/>
		<Btn t="ai" href="/jot/review" label="Approve 4 placements" />
	{:else if view === 'offline'}
		<!-- Capture and analysis are separated so the failure is partial. -->
		<Alert title="No connection" meta="Analysis needs the network. Your words are safe." />
		<Banner
			t="ai"
			title="Saved on this phone"
			meta="2 jots queued. They will be analysed when you reconnect."
		/>
		<Row t="ai" title="6:12 PM jot" meta="11 words · queued" trailing="Queued" />
		<Row t="ai" title="4:40 PM jot" meta="23 words · queued" trailing="Queued" />
		<Btn t="ai" label="Retry now" />
	{:else}
		<Banner
			t="ai"
			title="What is on your mind?"
			meta="Type it or say it. One jot can hold several things."
		/>
		<Field
			label="Jot"
			placeholder="I need to call my daughter. Oh and I need to talk to Carmen ASAP."
		/>
		<Seg
			t="ai"
			a="Voice"
			b="Text"
			bind:active={mode}
			onpick={(i) => i === 0 && goto('/jot/listening')}
		/>
		<Btn t="ai" href="/jot/split" label="Analyse this jot" />
		<Note>Capture never blocks on the network. Only analysis does.</Note>
	{/if}
</Screen>
