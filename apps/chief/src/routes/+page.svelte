<script>
	/**
	 * B2 Today — T1.
	 *
	 * Today is the jot lifecycle, in the three stages a jot moves through:
	 * throw it, sphere it, task it. The page is the pipeline, not a
	 * dashboard about the pipeline, so each stage is somewhere work gets
	 * done rather than a count that links elsewhere.
	 *
	 * Throwing comes first and asks for nothing. A jot does not start in
	 * a sphere and is never blocked on choosing one — "not selected" is a
	 * real, valid state, and Sphere It is where it stops being one.
	 *
	 * Sphere It is the only stage with a queue, because it is the only
	 * stage that can fall behind.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Btn, Row, SectionHead, Seg } from '$lib/kit';
	import { UNSPHERED } from '$lib/data.js';

	/** 0 = text, 1 = voice. Text is first because it needs no permission. */
	let input = $state(0);
	let draft = $state('');

	const queue = Object.entries(UNSPHERED);
	const canThrow = $derived(draft.trim().length > 0);
</script>

<svelte:head><title>Today · Chief</title></svelte:head>

<Screen>
	<SectionHead label="Throw it" />
	<p class="lede">Say it or type it. No sphere, no title, nothing to choose.</p>

	<Seg a="Text" b="Voice" bind:active={input} />

	{#if input === 0}
		<form
			onsubmit={(e) => {
				e.preventDefault();
				draft = '';
			}}
		>
			<textarea
				rows="2"
				bind:value={draft}
				placeholder="I need to call my daughter. Oh and I need to talk to Carmen ASAP."
			></textarea>
			<Btn t="cool" type="submit" disabled={!canThrow} label="Throw it" />
		</form>
	{:else}
		<Btn t="cool" href="/jot/listening" label="Hold to speak" />
	{/if}

	<SectionHead label="Sphere it" t="clay" count={queue.length} />
	<p class="lede">Thrown, kept, and waiting for a sphere.</p>

	{#each queue as [id, jot] (id)}
		<Row t="clay" href="/jot/{id}/sphere" title={jot.text} meta={jot.meta} trailing="›" />
	{/each}

	<SectionHead label="Task it" t="cool" count={2} />
	<p class="lede">An endeavor groups tasks when one helps. It is never required.</p>

	<Row
		t="cool"
		href="/work/tasks/carmen"
		title="Talk to Carmen"
		meta="Azbolt · today 3:30 PM"
		trailing="›"
	/>
	<Row
		t="cool"
		href="/work"
		title="Call my daughter"
		meta="Personal · tonight 7:00 PM"
		trailing="›"
	/>
</Screen>

<style>
	.lede {
		margin: 0 2px 3px;
		font-size: 12px;
		line-height: 1.45;
		color: var(--ink-3);
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 9px;
	}
	textarea {
		width: 100%;
		border: 1px solid var(--line-2);
		border-radius: 10px;
		background: var(--sunk);
		padding: 10px 13px;
		font-family: inherit;
		font-size: 13.5px;
		line-height: 1.5;
		color: var(--ink);
		resize: vertical;
	}
	textarea::placeholder {
		color: var(--ink-4);
	}
</style>
