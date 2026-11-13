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
	const greetLead = $derived(greeting.slice(0, greeting.lastIndexOf(' ') + 1));
	const greetLast = $derived(greeting.slice(greeting.lastIndexOf(' ') + 1));
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

<Screen horizon>
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
			<h1>{greetLead}<span class="pop-word">{greetLast}</span></h1>
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
								<Icon name="keyboard" size={17} />
								<span>Text</span>
							</button>
							<button
								type="button"
								class="mode"
								class:on={input === 1}
								aria-pressed={input === 1}
								onclick={() => (input = 1)}
							>
								<Icon name="mic" size={17} />
								<span>Voice</span>
							</button>
						</div>

						{#if input === 0}
							<button class="go" type="button" disabled={!canThrow} onclick={() => (draft = '')}>
								<Icon name="throw" size={18} />
								Throw it
							</button>
						{:else}
							<a class="go" href="/jot/listening">
								<Icon name="mic" size={18} />
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
		gap: 11px;
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
		padding: 6px 2px 0;
		margin-bottom: 11px;
	}
	.hello-date {
		display: none;
	}
	/* The one line of display type on the screen, set heavy enough to
	   hold against the sunrise behind it. */
	.hello h1 {
		margin: 0;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 33px;
		line-height: 1.08;
		letter-spacing: -0.018em;
		color: var(--on-field);
		text-shadow: var(--on-field-shade);
	}
	.lead {
		margin: 5px 0 0;
		font-size: 15px;
		font-weight: 500;
		line-height: 1.4;
		color: var(--on-field-2);
		text-shadow: 0 1px 10px rgba(24, 16, 80, 0.4);
	}
	/* Still the attention tone, lifted to carry on the field. */
	.lead.urgent {
		color: #ffd9ad;
		font-weight: 600;
	}
	.date {
		margin: 0 2px;
		color: var(--on-field-2);
	}

	/* A light object held inside the coloured panel: lit along its top,
	   shaded underneath, with the panel's own shadow falling on it. */
	.composer {
		border: 1px solid rgba(255, 255, 255, 0.95);
		border-radius: var(--r-md);
		background: linear-gradient(180deg, #ffffff 0%, #fbf9ff 55%, #f1edfc 100%);
		padding: 6px;
		box-shadow:
			inset 0 1px 0 #ffffff,
			inset 0 -12px 18px -14px rgba(86, 66, 170, 0.3),
			0 12px 26px -12px rgba(24, 4, 50, 0.7);
	}
	.composer:focus-within {
		box-shadow:
			inset 0 1px 0 #ffffff,
			inset 0 -12px 18px -14px rgba(86, 66, 170, 0.3),
			0 0 0 3px rgba(255, 255, 255, 0.45),
			0 12px 26px -12px rgba(24, 4, 50, 0.7);
	}
	textarea {
		display: block;
		width: 100%;
		border: 0;
		background: transparent;
		padding: 12px 12px 6px;
		font-family: inherit;
		font-size: 17px;
		line-height: 1.45;
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
		padding: 15px 12px 10px;
		font-size: 16px;
		line-height: 1.5;
		color: var(--ink-3);
	}
	.tools {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 7px;
		padding: 4px 4px 4px;
	}
	.modes {
		display: flex;
		gap: 7px;
	}
	/* Each a pill of its own rather than two halves of a grey track. */
	.mode {
		display: flex;
		align-items: center;
		gap: 6px;
		min-height: 42px;
		padding: 0 13px;
		border: 1px solid var(--line-2);
		border-radius: 999px;
		background: linear-gradient(180deg, #ffffff 0%, #f6f3fd 100%);
		box-shadow:
			inset 0 1px 0 #ffffff,
			0 2px 6px -2px rgba(60, 44, 140, 0.3);
		font-family: inherit;
		font-size: 15.5px;
		font-weight: 600;
		color: var(--ink-2);
		cursor: pointer;
	}
	.mode.on {
		border-color: color-mix(in srgb, var(--tone-brand) 42%, #ffffff);
		background: linear-gradient(180deg, #ffffff 0%, var(--tone-brand-tint) 100%);
		color: var(--tone-brand);
		box-shadow:
			inset 0 1px 0 #ffffff,
			0 0 0 3px color-mix(in srgb, var(--tone-brand) 13%, transparent),
			0 4px 10px -3px color-mix(in srgb, var(--tone-brand) 50%, transparent);
	}
	.go {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 8px;
		min-height: 44px;
		padding: 0 16px;
		border: 0;
		border-radius: 999px;
		background: var(--gloss), linear-gradient(118deg, #4b8dd3 0%, #2f6aa8 45%, #204d7b 100%);
		color: #ffffff;
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.6),
			0 0 0 1px rgba(32, 77, 123, 0.35),
			0 10px 20px -8px rgba(32, 77, 123, 0.9);
		font-family: var(--font-display);
		font-size: 16px;
		font-weight: 700;
		letter-spacing: 0.01em;
		text-decoration: none;
		text-shadow: 0 1px 2px rgba(10, 30, 60, 0.4);
		cursor: pointer;
	}
	/* Disabled reads as waiting, not as a different colour of button:
	   the same pill in unlit glass. */
	.go:disabled {
		background: linear-gradient(180deg, #ebe7f8 0%, #dcd6f0 100%);
		color: #6a6592;
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.9),
			inset 0 0 0 1px rgba(86, 66, 170, 0.14);
		text-shadow: none;
		cursor: default;
	}
	.mode:focus-visible,
	.go:focus-visible {
		outline: 2px solid var(--tone-cool);
		outline-offset: 2px;
	}

	/* 360px phones: the three controls only share a line if each gives
	   up a little padding. */
	@media (max-width: 23.5rem) {
		.modes {
			gap: 5px;
		}
		.mode {
			padding-inline: 10px;
			font-size: 15px;
		}
		.go {
			padding-inline: 13px;
			font-size: 15px;
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
			margin-bottom: 11px;
			/* Smoke, not paper: the greeting stays white on the field at
			   every width, and the sunrise shows through behind it. */
			border: 1px solid var(--smoke-line);
			border-radius: var(--r-lg);
			background: rgba(26, 18, 92, 0.16);
			box-shadow: var(--smoke-shadow);
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
			color: var(--on-field-2);
		}
		.hello h1 {
			font-size: clamp(2.25rem, 3.6vw, 3.1rem);
		}
		.lead {
			margin-top: 8px;
			font-size: 16.5px;
		}
		.dash-panel .date {
			display: none;
		}
		.stages,
		.rest {
			gap: 18px;
		}
		.composer {
			padding: 8px;
		}
		textarea,
		.listening {
			min-height: 8rem;
			padding: 14px;
			font-size: 18px;
		}
		textarea {
			resize: vertical;
		}
		textarea::placeholder {
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
