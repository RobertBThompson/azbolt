<script>
	import { goto } from '$app/navigation';
	import Quadrant from '$lib/components/Quadrant.svelte';
	import { issues, BINS, INSTRUMENT_VERSION, computePosition } from '$lib/data/instrument.js';
	import { savePosition } from '$lib/storage/position.js';

	/**
	 * Three steps: intro, the instrument, and then Home itself.
	 * There is deliberately no "Your Result" screen — onboarding ends on
	 * the screen the user will actually use every day, with their own dot
	 * already on it.
	 */
	let step = $state(/** @type {'intro' | 'instrument' | 'landing'} */ ('intro'));
	let index = $state(0);

	/** @type {Record<string, string>} */
	let answers = $state({});
	/** Selection is separate from commitment — advancing needs an explicit tap. */
	let choice = $state('');

	let issue = $derived(issues[index]);
	let progress = $derived((index / issues.length) * 100);
	let preview = $derived(computePosition(answers));

	function confirm() {
		if (!choice) return;
		answers = { ...answers, [issue.id]: choice };
		choice = '';
		if (index < issues.length - 1) {
			index += 1;
		} else {
			savePosition(answers);
			step = 'landing';
		}
	}

	function back() {
		if (index === 0) {
			step = 'intro';
			return;
		}
		index -= 1;
		choice = answers[issues[index].id] ?? '';
	}
</script>

<svelte:head><title>Welcome · LIP</title></svelte:head>

{#if step === 'intro'}
	<div class="pad">
		<span class="eyebrow">Welcome</span>
		<h1>Three things happen here, and they stay separate.</h1>

		<!-- The three modes introduced as visual treatments, not as colors.
		     Each sample below is the real treatment used throughout the app. -->
		<div class="sample measure">
			<b>Measure</b>
			<p>AI proposes a measurement. Every score traces to its evidence in one tap.</p>
		</div>
		<div class="sample verify">
			<b>Verify</b>
			<p>You inspect that evidence and agree, adjust, or flag it.</p>
		</div>
		<div class="sample act">
			<b>Act</b>
			<p>Collective action unlocks only after verified conditions are met — never before.</p>
		</div>

		<p class="note">
			Agreeing with a measurement never enrols you in an action. That separation is structural, not
			a setting you have to find.
		</p>

		<button class="primary" onclick={() => (step = 'instrument')}>Begin</button>
	</div>
{:else if step === 'instrument'}
	<div class="progresswrap">
		<div class="progress"><i style="width:{progress}%"></i></div>
		<span class="step">Issue {index + 1} of {issues.length}</span>
	</div>

	<div class="pad">
		<span class="eyebrow">{issue.axis === 'fiscal' ? 'Fiscal' : 'Social'}</span>
		<h2>{issue.title}</h2>
		<p class="q">{issue.question}</p>

		<!-- Plain language only. This is the only screen in LIP with no score
		     on it, and that is deliberate. -->
		<div class="options" role="radiogroup" aria-label={issue.title}>
			{#each BINS as bin (bin)}
				<button
					class="opt"
					class:selected={choice === bin}
					role="radio"
					aria-checked={choice === bin}
					onclick={() => (choice = bin)}
				>
					{issue.definitions[bin]}
				</button>
			{/each}
		</div>

		<div class="nav">
			<button class="ghost" onclick={back}>Back</button>
			<button class="primary" disabled={!choice} onclick={confirm}>
				{index === issues.length - 1 ? 'Finish' : 'Continue'}
			</button>
		</div>

		<p class="version">
			Instrument {INSTRUMENT_VERSION} · your session stays pinned to this version even if it
			updates while you answer.
		</p>
	</div>
{:else}
	<div class="pad">
		<span class="eyebrow">Welcome to your map</span>
		<h2>This is Home. You're already on it.</h2>

		<div class="mapwrap">
			<Quadrant
				objects={[{ id: 'me', name: 'YOU', type: 'you', position: preview, coverage: 100 }]}
				height={240}
			/>
		</div>

		<p class="note">
			<b>Private by default.</b> Your placement is never public and never leaves this device. Only your
			anonymous bin can contribute to balancing a QC quorum, so items needing your perspective can find
			you without exposing who you are.
		</p>

		<button class="primary" onclick={() => goto('/?welcome=1')}>Enter the live map</button>
		<a class="retake" href="/welcome" onclick={() => { step = 'intro'; index = 0; answers = {}; }}>
			Start over
		</a>
	</div>
{/if}

<style>
	.pad {
		padding: 16px 14px 24px;
		display: flex;
		flex-direction: column;
	}
	h1 {
		font-size: 24px;
		line-height: 1.15;
		margin: 8px 0 16px;
	}
	h2 {
		font-size: 21px;
		line-height: 1.2;
		margin: 6px 0 0;
	}
	.q {
		font-size: 13px;
		line-height: 1.5;
		color: var(--muted);
		margin: 8px 0 16px;
	}
	.note {
		font-size: 11px;
		line-height: 1.6;
		color: var(--muted);
		margin: 16px 0;
	}

	/* Mode samples: the real treatments, so the words map onto something. */
	.sample {
		border-radius: var(--radius);
		padding: 12px 14px;
		margin-bottom: 8px;
	}
	.sample b {
		font: 700 10px var(--font-sans);
		letter-spacing: 0.11em;
		text-transform: uppercase;
	}
	.sample p {
		font-size: 11px;
		line-height: 1.5;
		margin: 5px 0 0;
	}
	.measure {
		background: var(--white);
		border: 1px solid var(--line);
		color: var(--muted);
	}
	.verify {
		background: var(--verify-tint);
		border: 1px solid var(--line);
		border-left: 4px solid var(--ink);
		color: var(--muted);
	}
	.act {
		background: var(--ink);
		color: #b9bdb6;
	}
	.sample b {
		color: var(--ink);
	}
	.act b {
		color: #fff;
	}

	.progresswrap {
		padding: 12px 14px 0;
	}
	.progress {
		height: 3px;
		background: var(--line);
		border-radius: 2px;
		overflow: hidden;
	}
	.progress i {
		display: block;
		height: 100%;
		background: var(--app-accent);
		transition: width 180ms ease;
	}
	.step {
		display: block;
		font: 700 9px var(--font-sans);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--muted);
		margin-top: 8px;
	}

	.options {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.opt {
		text-align: left;
		min-height: var(--tap-min);
		padding: 12px 14px;
		border: 1px solid var(--line-strong);
		border-radius: var(--radius-sm);
		background: var(--white);
		font-size: 12px;
		line-height: 1.5;
		color: var(--ink-2);
		cursor: pointer;
	}
	.opt.selected {
		border-color: var(--ink);
		border-width: 2px;
		background: var(--app-accent-tint);
		color: var(--ink);
	}

	.nav {
		display: flex;
		gap: 8px;
		margin-top: 16px;
	}
	.primary {
		flex: 2;
		min-height: var(--tap-min);
		border: 1px solid var(--ink);
		background: var(--ink);
		color: #fff;
		border-radius: var(--radius-sm);
		font: 700 12px var(--font-sans);
		letter-spacing: 0.04em;
		cursor: pointer;
		margin-top: 8px;
	}
	.primary:disabled {
		background: #4a4d47;
		border-color: #4a4d47;
		color: #9a9d95;
		cursor: not-allowed;
	}
	.ghost {
		flex: 1;
		min-height: var(--tap-min);
		border: 1px solid var(--ink);
		background: var(--white);
		border-radius: var(--radius-sm);
		font: 700 12px var(--font-sans);
		cursor: pointer;
		margin-top: 8px;
	}
	.version {
		font-size: 9px;
		color: var(--muted);
		margin-top: 14px;
	}
	.mapwrap {
		margin-top: 12px;
	}
	.retake {
		text-align: center;
		font-size: 10px;
		color: var(--muted);
		margin-top: 12px;
		min-height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
