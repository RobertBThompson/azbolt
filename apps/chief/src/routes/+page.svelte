<script>
	/**
	 * B2 Today — T1.
	 *
	 * Home has two states. Jot is the default and is the lifecycle a jot
	 * moves through: throw it, sphere it, task it. Dash is the read-only
	 * view of where everything stands. Jot leads because the cost of a
	 * thought being lost is higher than the cost of a number going unseen.
	 *
	 * Inside Jot, only Throw It is open. The other two are work that has
	 * already been captured and can wait; opening all three would put a
	 * queue in front of someone whose only intent was to get a sentence
	 * out of their head.
	 *
	 * Three sections, three tints, each the tone its work belongs to:
	 * capture is neutral, placing is arranging, tasking is committing.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Btn, Expander, Row, Seg, Stats } from '$lib/kit';
	import { UNSPHERED } from '$lib/data.js';

	/** 0 = Jot, 1 = Dash. */
	let view = $state(0);
	/** 0 = text, 1 = voice. Text is first because it needs no permission. */
	let input = $state(0);
	let draft = $state('');

	const queue = Object.entries(UNSPHERED);
	const canThrow = $derived(draft.trim().length > 0);

	const now = new Date();
	const weekday = now.toLocaleDateString(undefined, { weekday: 'long' });
	const date = now.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
</script>

<svelte:head><title>Today · Chief</title></svelte:head>

<Screen>
	<Seg a="Jot" b="Dash" t="cool" bind:active={view} />

	{#if view === 0}
		<Expander
			label="Throw it"
			open
			lede="Say it or type it. No title, nothing to choose — it lands in All life."
		>
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
		</Expander>

		<Expander
			label="Sphere it"
			t="cool"
			count={queue.length}
			lede="Thrown and kept. All life until you say otherwise."
		>
			{#each queue as [id, jot] (id)}
				<Row t="cool" href="/jot/{id}/sphere" title={jot.text} meta={jot.meta} trailing="›" />
			{/each}
		</Expander>

		<Expander
			label="Task it"
			t="warm"
			count={2}
			lede="An endeavor groups tasks when one helps. It is never required."
		>
			<Row
				t="warm"
				href="/work/tasks/carmen"
				title="Talk to Carmen"
				meta="Business · today 3:30 PM"
				trailing="›"
			/>
			<Row
				t="warm"
				href="/work"
				title="Call my daughter"
				meta="Children · tonight 7:00 PM"
				trailing="›"
			/>
		</Expander>
	{:else}
		<header class="day">
			<p class="eyebrow">{weekday}</p>
			<h1>{date}</h1>
		</header>

		<Banner
			t="ai"
			title="2 placements waiting"
			meta="From your 6:12 PM jot. Nothing created yet."
		/>

		<Stats
			items={[
				[String(queue.length), 'To sphere'],
				['5', 'On track'],
				['1', 'Overdue']
			]}
		/>

		<Row
			t="warm"
			href="/work/tasks/carmen"
			title="Talk to Carmen"
			meta="Business · today 3:30 PM"
			trailing="›"
		/>
		<Row
			t="warm"
			href="/work"
			title="Call my daughter"
			meta="Children · tonight 7:00 PM"
			trailing="›"
		/>

		<Row
			t="cool"
			href="/opportunities"
			title="3 things Chief noticed"
			meta="Patterns across records you already have"
			trailing="›"
		/>
	{/if}
</Screen>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 9px;
	}
	textarea {
		width: 100%;
		border: 1px solid var(--line-2);
		border-radius: 10px;
		background: var(--card);
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
	.day {
		padding: 2px 2px 0;
	}
	.day h1 {
		margin: 1px 0 0;
		font-family: var(--font-serif);
		font-weight: 500;
		font-size: 29px;
		line-height: 1.1;
		letter-spacing: -0.015em;
		color: var(--ink);
	}
</style>
