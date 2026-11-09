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
				open
				lede="No title, nothing to choose — it lands in All life."
			>
				<div class="how">
					<button
						type="button"
						class="mode"
						class:on={input === 0}
						aria-pressed={input === 0}
						onclick={() => (input = 0)}
					>
						<Icon name="keyboard" size={16} /> Text
					</button>
					<button
						type="button"
						class="mode"
						class:on={input === 1}
						aria-pressed={input === 1}
						onclick={() => (input = 1)}
					>
						<Icon name="mic" size={16} /> Voice
					</button>
				</div>

				{#if input === 0}
					<form
						onsubmit={(e) => {
							e.preventDefault();
							draft = '';
						}}
					>
						<textarea
							rows="2"
							bind:this={box}
							bind:value={draft}
							placeholder="I need to call my daughter. Oh and I need to talk to Carmen ASAP."
						></textarea>
						<button class="go" type="submit" disabled={!canThrow}>
							<Icon name="throw" size={18} /> Throw it
						</button>
					</form>
				{:else}
					<a class="go" href="/jot/listening">
						<Icon name="mic" size={18} /> Hold to speak
					</a>
				{/if}
			</Expander>

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

	/* The three stages share whatever room is left. When they are closed
	   that spreads them down to the nav instead of stranding them at the
	   top; when they open, the gap floors it and the page scrolls. */
	.stages {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 16px;
		min-height: 0;
	}

	.hello {
		padding: 4px 2px 0;
	}
	.hello h1 {
		margin: 0;
		font-family: var(--font-serif);
		font-weight: 500;
		font-size: 31px;
		line-height: 1.08;
		letter-spacing: -0.015em;
		color: var(--ink);
	}
	.lead {
		margin: 5px 0 0;
		font-size: 13px;
		line-height: 1.4;
		color: var(--ink-3);
	}
	.lead.urgent {
		color: var(--tone-alert-ink);
		font-weight: 600;
	}
	.date {
		margin: 0 2px;
	}

	/* Two modes side by side, then a full-width action. The mode buttons
	   are deliberately smaller than the throw button: picking how to
	   capture is a setting, throwing is the act. */
	.how {
		display: flex;
		gap: 7px;
	}
	.mode {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 7px;
		min-height: 40px;
		border-radius: 10px;
		border: 1px solid var(--line-2);
		background: var(--sunk);
		font-family: inherit;
		font-size: 13.5px;
		font-weight: 600;
		color: var(--ink-3);
		cursor: pointer;
	}
	.mode.on {
		border-color: var(--tone-brand);
		background: var(--tone-brand-tint);
		color: var(--tone-brand);
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
		font-size: 14px;
		line-height: 1.5;
		color: var(--ink);
		resize: vertical;
	}
	textarea::placeholder {
		color: var(--ink-4);
	}
	.go {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 9px;
		width: 100%;
		min-height: 54px;
		border: 0;
		border-radius: 13px;
		background: var(--tone-cool);
		color: #ffffff;
		font-family: inherit;
		font-size: 16px;
		font-weight: 600;
		text-decoration: none;
		cursor: pointer;
		box-shadow: 0 2px 8px rgba(54, 110, 168, 0.3);
	}
	.go:disabled {
		opacity: 0.45;
		box-shadow: none;
	}
</style>
