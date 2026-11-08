<script>
	/**
	 * F2 Capture — Q8 Nothing understood.
	 * Zero confidence produces a note, never an invented record. Your words
	 * are kept exactly as spoken — the failure mode Chief must never have is
	 * a confidently wrong entry you find three weeks later.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, Banner, Field, Btn } from '$lib/kit';
</script>

<svelte:head><title>Unplaced · Chief</title></svelte:head>

<Screen back="/jot" nav={false}>
	<Alert
		title="I could not place this"
		meta="“Ask about the thing before it closes” — no person, subject or date found."
	/>
	<Banner
		t="ai"
		title="Kept exactly as you said it"
		meta="Saved as an unfiled note. Nothing was rewritten."
	/>
	<Field label="One question" placeholder="Who is this about?" />
	<Btn t="ai" href="/jot/split" label="Answer and try again" />
	<Btn primary={false} href="/" label="Leave it unfiled" />
</Screen>
