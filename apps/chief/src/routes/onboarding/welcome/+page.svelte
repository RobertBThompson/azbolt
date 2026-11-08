<script>
	/**
	 * B1 Onboarding — A2 Welcome.
	 * Privacy language sits above the buttons, before any permission is
	 * possible. Two ways in and nothing else on screen.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Hero, Btn, Note } from '$lib/kit';
</script>

<svelte:head><title>Welcome · Chief</title></svelte:head>

<Screen back="/onboarding" nav={false}>
	<Hero title="Your life and your work, in one place" meta="Capture first. Organise with help." />
	<Btn href="/onboarding/focus" label="Continue with Apple" />
	<Btn primary={false} href="/onboarding/focus" label="Continue with Google" />
	<Note>
		Chief asks for contacts and calendar later, at the moment each one becomes useful — never here.
	</Note>
</Screen>
