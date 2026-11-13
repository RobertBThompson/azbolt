<script>
	/**
	 * Help · Throw a jot.
	 * Three steps because the jot has three stages, and the last two are
	 * optional. Help answers the intent and links to the real surface; it
	 * does not duplicate the feature.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Row, Btn } from '$lib/kit';
</script>

<svelte:head><title>Throw a jot · Chief</title></svelte:head>

<Screen back="/settings/help" nav={false}>
	<Banner
		title="Throw a jot"
		meta="Say the thing before you forget it. Where it belongs can wait."
	/>
	<Row
		title="1 · Throw it"
		meta="The thought is kept as it stands, in your own words"
		dot={false}
	/>
	<Row title="2 · Sphere it" meta="Put it in a sphere when you are ready" dot={false} />
	<Row title="3 · Task it" meta="Only if it is something to do. Most jots are not" dot={false} />
	<Btn t="ai" href="/" label="Throw one now" />
	<Btn primary={false} href="/settings/help/contact" label="Still need help?" />
</Screen>
