<script>
	/**
	 * B1 Onboarding — A2 Welcome.
	 * Privacy language sits above the buttons, before any permission is
	 * possible. One way in and nothing else on screen: signing in with Apple or
	 * Google was drawn here and is not offered.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Hero, Btn, Note } from '$lib/kit';
</script>

<svelte:head><title>Welcome · Chief</title></svelte:head>

<Screen back="/onboarding" nav={false}>
	<Hero title="Your life and your work, in one place" meta="Capture first. Organize with help." />
	<Btn href="/signin" label="Sign in or create an account" />
	<Note>
		Chief asks for contacts and calendar later, at the moment each one becomes useful — never here.
	</Note>
</Screen>
