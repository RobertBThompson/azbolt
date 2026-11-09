<script>
	/**
	 * B2 Today — T1.
	 *
	 * Home has two states. Jot is the default and is the lifecycle a jot
	 * moves through: throw it, sphere it, task it. Dash is the read-only
	 * view of where everything stands. Jot leads because the cost of a
	 * thought being lost is higher than the cost of a number going unseen.
	 *
	 * The greeting is not decoration and is not static. The second line
	 * is always the most pressing real thing — overdue first, then what
	 * is due today, then a standing reminder — so the space pays for
	 * itself instead of saying hello twice a day. It falls back to the
	 * tagline only when there is genuinely nothing waiting.
	 *
	 * Inside Jot, only Throw It is open. The other two are work already
	 * captured and can wait; opening all three would put a queue in front
	 * of someone whose only intent was to get a sentence out of their head.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Expander, Icon, Row, StateSwitch, Stats } from '$lib/kit';
	import { UNSPHERED } from '$lib/data.js';
	import { page } from '$app/stores';
	import { replaceState } from '$app/navigation';
	import { tick } from 'svelte';

	/** 0 = Jot, 1 = Dash. */
	let view = $state(0);
	/** 0 = text, 1 = voice. Text is first because it needs no permission. */
	let input = $state(0);
	let draft = $state('');

	const queue = Object.entries(UNSPHERED);
	const canThrow = $derived(draft.trim().length > 0);

	/** @type {HTMLTextAreaElement|null} */
	let box = $state(null);
	/** Lifts the composer's border while typing, since it is now one field. */
	let focused = $state(false);

	/**
	 * The mark in the nav arrives here as /?throw. Honour it by showing
	 * Jot and putting the cursor in the box, then drop the parameter so
	 * a back press does not re-fire it and a reload is just Today.
	 */
	$effect(() => {
		if (!$page.url.searchParams.has('throw')) return;
		view = 0;
		input = 0;
		tick().then(() => box?.focus());
		replaceState('/', {});
	});

	const now = new Date();
	const hour = now.getHours();
	const greeting = hour < 12 ? 'Good morning,' : hour < 17 ? 'Good afternoon,' : 'Good evening,';
	const weekday = now.toLocaleDateString(undefined, { weekday: 'long' });
	const date = now.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });

	/**
	 * What the second line says. Ordered by what would hurt most to miss.
	 * @type {{ text: string, tone: string }[]}
	 */
	const PRESSING = [
		{ text: '1 overdue since Friday — storage walkthrough', tone: 'alert' },
		{ text: 'Carmen at 3:30 PM, then your daughter at 7:00', tone: 'warm' }
	];
	const lead = PRESSING[0] ?? {
		text: 'Capture thoughts. Organize life. Live fully.',
		tone: 'neutral'
	};
</script>

<svelte:head><title>Today · Chief</title></svelte:head>

<Screen>
	<div class="switch">
		<StateSwitch
			a="Jot"
			b="Dash"
			aIcon="spark"
			bIcon="dash"
			labelledby="Home view"
			bind:active={view}
		/>
	</div>

	<header class="hello">
		<h1>{greeting}</h1>
		<p class="lead" class:urgent={lead.tone === 'alert'}>{lead.text}</p>
	</header>

	{#if view === 0}
		<div class="stages">
			<Expander
				label="Throw it"
				icon="throw"
				t="brand"
				lead
				open
				lede="No title, nothing to choose — it lands in All life."
			>
				<!--
				One composer rather than three stacked controls. The mode
				chips and the action live inside the same bordered field as
				the text, because they all act on the same thing — splitting
				them into separate blocks made choosing how to type look like
				a step before typing, which it is not.
			-->
				<div class="composer" class:focused>
					{#if input === 0}
						<textarea
							rows="2"
							bind:this={box}
							bind:value={draft}
							onfocus={() => (focused = true)}
							onblur={() => (focused = false)}
							placeholder="I need to call my daughter. Oh and I need to talk to Carmen ASAP."
						></textarea>
					{:else}
						<p class="listening">Hold the button to speak. Release and it is thrown.</p>
					{/if}

					<div class="tools">
						<div class="modes" role="group" aria-label="How to capture">
							<button
								type="button"
								class="mode"
								class:on={input === 0}
								aria-pressed={input === 0}
								onclick={() => (input = 0)}
							>
								<Icon name="keyboard" size={15} />
								<span>Text</span>
							</button>
							<button
								type="button"
								class="mode"
								class:on={input === 1}
								aria-pressed={input === 1}
								onclick={() => (input = 1)}
							>
								<Icon name="mic" size={15} />
								<span>Voice</span>
							</button>
						</div>

						{#if input === 0}
							<button class="go" type="button" disabled={!canThrow} onclick={() => (draft = '')}>
								<Icon name="throw" size={16} />
								Throw it
							</button>
						{:else}
							<a class="go" href="/jot/listening">
								<Icon name="mic" size={16} />
								Speak
							</a>
						{/if}
					</div>
				</div>
			</Expander>

			<div class="rest">
				<Expander
					label="Sphere it"
					icon="sphere"
					t="cool"
					count={queue.length}
					lede="Organize your spheres"
				>
					{#each queue as [id, jot] (id)}
						<Row t="cool" href="/jot/{id}/sphere" title={jot.text} meta={jot.meta} trailing="›" />
					{/each}
				</Expander>

				<Expander label="Task it" icon="task" t="warm" count={2} lede="Turn into action">
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
			</div>
		</div>
	{:else}
		<p class="eyebrow date">{weekday} · {date}</p>

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
	/* Narrower than the content it governs: it is a control over the page,
	   not one of the page's own blocks, and full width made it read as a
	   fourth section. */
	.switch {
		width: 75%;
		margin: 0 auto;
	}

	/* One flexible gap, not two. Splitting the slack evenly between all
	   three left a void above each of the bottom pair; keeping them
	   together means the spare room collects in a single break after the
	   section that matters, and the pair still lands above the nav. */
	.stages {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 16px;
		min-height: 0;
	}
	.rest {
		margin-top: auto;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.hello {
		padding: 4px 2px 0;
	}
	/* Lighter and smaller than it was. A 31px near-black serif was the
	   heaviest thing on the page and pulled the eye away from the one
	   section meant to hold it. */
	.hello h1 {
		margin: 0;
		font-family: var(--font-serif);
		font-weight: 400;
		font-size: 25px;
		line-height: 1.1;
		letter-spacing: -0.01em;
		color: var(--ink-3);
	}
	.lead {
		margin: 3px 0 0;
		font-size: 12.5px;
		line-height: 1.4;
		color: var(--ink-4);
	}
	/* The one line here that still earns full weight. */
	.lead.urgent {
		color: var(--tone-alert);
		font-weight: 600;
	}
	.date {
		margin: 0 2px;
	}

	/* One field: text, mode chips and action share a border. */
	.composer {
		border: 1px solid var(--line-2);
		border-radius: 12px;
		background: var(--sunk);
		padding: 4px 4px 4px;
	}
	.composer.focused {
		border-color: var(--tone-brand);
		box-shadow: 0 0 0 3px var(--tone-brand-tint);
	}
	textarea {
		display: block;
		width: 100%;
		border: 0;
		background: transparent;
		padding: 9px 9px 4px;
		font-family: inherit;
		font-size: 14px;
		line-height: 1.5;
		color: var(--ink);
		resize: none;
	}
	textarea:focus {
		outline: none;
	}
	textarea::placeholder {
		color: var(--ink-4);
	}
	.listening {
		margin: 0;
		padding: 13px 9px 9px;
		font-size: 13.5px;
		line-height: 1.5;
		color: var(--ink-3);
	}
	.tools {
		display: flex;
		align-items: center;
		gap: 7px;
		padding: 2px 2px 0;
	}
	.modes {
		display: flex;
		gap: 3px;
		padding: 3px;
		border-radius: 9px;
		background: var(--wash-1);
	}
	.mode {
		display: flex;
		align-items: center;
		gap: 5px;
		min-height: 30px;
		padding: 0 9px;
		border: 0;
		border-radius: 7px;
		background: transparent;
		font-family: inherit;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--ink-3);
		cursor: pointer;
	}
	.mode.on {
		background: var(--card);
		color: var(--tone-brand);
		box-shadow: 0 1px 2px rgba(30, 26, 24, 0.1);
	}
	/* Smaller and darker than the full-width slab it replaces: it is the
	   end of a field, not a section of the page. */
	.go {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 7px;
		min-height: 38px;
		padding: 0 15px;
		border: 0;
		border-radius: 9px;
		background: #26527d;
		color: #ffffff;
		font-family: inherit;
		font-size: 14px;
		font-weight: 600;
		text-decoration: none;
		cursor: pointer;
	}
	.go:disabled {
		background: var(--line);
		color: var(--ink-4);
		cursor: default;
	}
</style>
