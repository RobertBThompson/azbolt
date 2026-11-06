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
				height={300}
				land
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
		padding: 20px 18px 28px;
		display: flex;
		flex-direction: column;
	}
	h1 {
		font-size: 30px;
		line-height: 1.15;
		margin: 10px 0 20px;
		text-wrap: balance;
	}
	h2 {
		font-size: 26px;
		line-height: 1.2;
		margin: 8px 0 0;
		text-wrap: balance;
	}
	.q {
		font-size: var(--size-body);
		line-height: 1.55;
		color: var(--muted);
		margin: 10px 0 20px;
	}
	.note {
		font-size: var(--size-small);
		line-height: 1.7;
		color: var(--muted);
		margin: 18px 0;
	}

	/* The three modes shown as their real treatments, so the words map
	   onto something the user will recognise later. */
	.sample {
		border-radius: var(--radius);
		padding: 16px 18px;
		margin-bottom: 10px;
	}
	.sample b {
		font: 700 var(--size-label) var(--font-sans);
		letter-spacing: 0.11em;
		text-transform: uppercase;
		color: var(--ink);
	}
	.sample p {
		font-size: var(--size-small);
		line-height: 1.55;
		margin: 7px 0 0;
	}
	.measure {
		background: var(--white);
		box-shadow: var(--shadow-sm);
		color: var(--muted);
	}
	.verify {
		background: var(--verify-tint);
		border-left: 5px solid var(--teal-500);
		box-shadow: var(--shadow-sm);
		color: var(--muted);
	}
	.act {
		background: linear-gradient(145deg, #11373a, #081f22);
		color: #9ab2b0;
		box-shadow: var(--shadow);
	}
	.act b {
		color: #fff;
	}

	.progresswrap {
		padding: 16px 18px 0;
	}
	.progress {
		height: 5px;
		background: var(--line);
		border-radius: 3px;
		overflow: hidden;
	}
	.progress i {
		display: block;
		height: 100%;
		border-radius: 3px;
		background: linear-gradient(90deg, var(--app-accent), var(--app-accent-strong));
		transition: width 280ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	.step {
		display: block;
		font: 700 var(--size-label) var(--font-sans);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--muted);
		margin-top: 12px;
	}

	.options {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	/* Answer cards are the whole point of these screens, so they get real
	   size: 15px text, generous padding, nothing cramped. */
	.opt {
		text-align: left;
		padding: 16px 18px;
		border: 2px solid transparent;
		border-radius: var(--radius-sm);
		background: var(--white);
		box-shadow: var(--shadow-sm);
		font-size: var(--size-body);
		line-height: 1.5;
		color: var(--ink-2);
	}
	.opt.selected {
		border-color: var(--app-accent-strong);
		background: var(--app-accent-tint);
		color: var(--ink);
	}

	.nav {
		display: flex;
		gap: 10px;
		margin-top: 20px;
	}
	.primary,
	.ghost {
		min-height: 56px;
		border-radius: var(--radius-sm);
		font: 700 var(--size-body) var(--font-sans);
		letter-spacing: 0.02em;
		margin-top: 10px;
	}
	.primary {
		flex: 2;
		border: 0;
		background: linear-gradient(160deg, var(--teal-700), var(--teal-900));
		color: #fff;
		box-shadow: 0 8px 20px rgba(15, 74, 77, 0.32);
	}
	.primary:disabled {
		background: #c9ccc6;
		color: #8b918d;
		box-shadow: none;
		cursor: not-allowed;
	}
	.ghost {
		flex: 1;
		border: 1.5px solid var(--line);
		background: var(--white);
	}
	.version {
		font-size: var(--size-label);
		line-height: 1.6;
		color: var(--muted);
		margin-top: 18px;
	}
	.mapwrap {
		margin-top: 16px;
	}
	.retake {
		text-align: center;
		font-size: var(--size-small);
		font-weight: 600;
		color: var(--muted);
		margin-top: 14px;
		min-height: var(--tap-min);
		display: flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
	}
</style>
