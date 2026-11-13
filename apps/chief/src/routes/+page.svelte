<script>
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Expander, Icon, Row, StateSwitch, Stats } from '$lib/kit';
	import { UNSPHERED } from '$lib/data.js';

	const viewId = 'home-view';
	let view = $state(0);
	/** 0 = text, 1 = voice. Text is first because it needs no permission. */
	let input = $state(0);
	let draft = $state('');

	const queue = Object.entries(UNSPHERED);
	const canThrow = $derived(draft.trim().length > 0);

	const now = new Date();
	const hour = now.getHours();
	const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
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
	<div class="home-top">
		<div class="home-switch">
			<StateSwitch
				a="Jot"
				b="Dash"
				aIcon="spark"
				bIcon="dash"
				id={viewId}
				label="Home view"
				bind:active={view}
			/>
		</div>

		<header class="hello">
			<p class="eyebrow hello-date">{weekday} · {date}</p>
			<h1>{greeting}</h1>
			<p class="lead" class:urgent={lead.tone === 'alert'}>{lead.text}</p>
		</header>
	</div>

	<div
		class="jot-panel"
		role="tabpanel"
		id="{viewId}-panel-0"
		aria-labelledby="{viewId}-tab-0"
		hidden={view !== 0}
	>
		<div class="stages">
			<Expander
				label="Throw it"
				icon="throw"
				t="brand"
				lead
				lede="No title, nothing to choose — it lands in All life."
			>
				<div class="composer">
					{#if input === 0}
						<textarea
							rows="3"
							bind:value={draft}
							aria-label="Jot text"
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
	</div>
	<div
		class="dash-panel"
		role="tabpanel"
		id="{viewId}-panel-1"
		aria-labelledby="{viewId}-tab-1"
		hidden={view !== 1}
	>
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
	</div>
</Screen>

<style>
	.home-top,
	.dash-panel:not([hidden]) {
		display: flex;
		flex-direction: column;
		gap: 9px;
	}
	.jot-panel {
		container-type: inline-size;
	}
	.stages,
	.rest {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 24px;
	}

	.hello {
		padding: 4px 2px 0;
		margin-bottom: 9px;
	}
	.hello-date {
		display: none;
	}
	.hello h1 {
		margin: 0;
		font-family: var(--font-serif);
		font-weight: 400;
		font-size: 25px;
		line-height: 1.1;
		letter-spacing: -0.01em;
		color: var(--on-field);
		text-shadow: 0 1px 24px rgba(40, 28, 80, 0.4);
	}
	.lead {
		margin: 3px 0 0;
		font-size: 12.5px;
		line-height: 1.4;
		color: var(--on-field-2);
	}
	/* Still the attention tone, lifted to carry on the field. */
	.lead.urgent {
		color: #ffd7a8;
		font-weight: 600;
	}
	.date {
		margin: 0 2px;
		color: var(--on-field-2);
	}

	.composer {
		border: 1px solid var(--line-2);
		border-radius: 12px;
		background: #ffffff;
		padding: 4px;
	}
	.composer:focus-within {
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
		font-size: 15px;
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
		flex-wrap: wrap;
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
	.go {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 7px;
		min-height: 38px;
		padding: 0 15px;
		border: 0;
		border-radius: 9px;
		background:
			linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent 52%),
			linear-gradient(118deg, #3f7cb8, #22517f);
		color: #ffffff;
		box-shadow: 0 8px 18px -6px rgba(34, 81, 127, 0.65);
		font-family: inherit;
		font-size: 14px;
		font-weight: 600;
		text-decoration: none;
		cursor: pointer;
	}
	/* Disabled reads as waiting, not as a different colour of button.
	   The gradient and its shadow go; the label stays legible. */
	.go:disabled {
		background: rgba(40, 28, 80, 0.1);
		color: rgba(40, 28, 80, 0.45);
		box-shadow: none;
		cursor: default;
	}
	.mode:focus-visible,
	.go:focus-visible {
		outline: 2px solid var(--tone-cool);
		outline-offset: 2px;
	}

	@media (max-width: 22rem) {
		.mode {
			padding-inline: 7px;
		}
		.go {
			padding-inline: 11px;
		}
	}

	@media (min-width: 48rem) {
		.home-top {
			display: grid;
			grid-template-columns: minmax(0, 1fr) auto;
			grid-template-areas: 'greeting switch';
			align-items: start;
			gap: 18px;
			padding: clamp(20px, 2.5vw, 32px);
			margin-bottom: 9px;
			border: 1px solid var(--line-2);
			border-radius: 18px;
			background:
				radial-gradient(ellipse at 86% 0%, #ffedcd, transparent 65%),
				linear-gradient(115deg, var(--sunk) 25%, var(--tone-brand-tint) 72%, var(--tone-cool-tint));
		}
		.home-switch {
			grid-area: switch;
		}
		.hello {
			grid-area: greeting;
			margin: 0;
			padding: 0;
		}
		.hello-date {
			display: block;
			margin: 0 0 9px;
			color: var(--ink-3);
		}
		.hello h1 {
			font-size: clamp(2.125rem, 3.6vw, 3rem);
			color: var(--ink);
		}
		.lead {
			margin-top: 8px;
			font-size: 14px;
			color: var(--ink-3);
		}
		.dash-panel .date {
			display: none;
		}
		.stages,
		.rest {
			gap: 16px;
		}
		.composer {
			padding: 6px;
		}
		textarea,
		.listening {
			min-height: 8rem;
			padding: 12px;
			font-size: 16px;
		}
		textarea {
			resize: vertical;
		}
		textarea::placeholder {
			color: var(--ink-3);
		}
		.mode {
			min-height: 38px;
		}
		.go {
			min-height: 44px;
		}
		.go:disabled {
			background: var(--line-2);
			color: var(--ink-3);
		}

		@container (min-width: 42rem) {
			.stages {
				grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
				align-items: start;
				gap: 20px;
			}
		}
	}
</style>
