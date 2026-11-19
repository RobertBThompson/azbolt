<script>
	/**
	 * A section that is designed and not built.
	 *
	 * Signed out, these sections show the design with sample records.
	 * Signed in, sample people and figures beside your own would read as
	 * yours, so the section says plainly that it is not built, what it
	 * will do, and what to use meanwhile.
	 */
	import Screen from './Screen.svelte';
	import { Banner, Row, Note } from '$lib/kit';

	/**
	 * @type {{
	 *   title: string, will: string, back?: string,
	 *   meanwhile?: { href: string, title: string, meta: string }[]
	 * }}
	 */
	let { title, will, back = '/', meanwhile = [] } = $props();
</script>

<svelte:head><title>{title} · Chief</title></svelte:head>

<Screen {back} nav={false}>
	<Banner {title} meta="Not built yet" />
	<Note>{will}</Note>
	{#each meanwhile as m (m.href)}
		<Row href={m.href} title={m.title} meta={m.meta} trailing="›" />
	{/each}
	<Note>Sign out to see the design for this section, with sample records.</Note>
</Screen>
