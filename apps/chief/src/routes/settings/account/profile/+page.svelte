<script>
	/**
	 * B8 — G8 Profile & sign-in.
	 * Identity and access live together because a name change is routine
	 * while a sign-in change affects recovery. Active sessions stay visible
	 * rather than hidden behind a security label.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Field, Row, Btn } from '$lib/kit';
</script>

<svelte:head><title>Profile & sign-in · Chief</title></svelte:head>

<Screen back="/settings/account" nav={false}>
	<Banner title="Pamela Anderson" meta="Personal account · signed in" />
	<Field label="Display name" value="Pamela Anderson" />
	<Row title="Photo" meta="Change or remove" trailing="›" />
	<Row title="Sign-in methods" meta="Apple · Google" trailing="›" />
	<Row title="Active sessions" meta="2 devices" trailing="›" />
	<Btn label="Save profile" />
</Screen>
