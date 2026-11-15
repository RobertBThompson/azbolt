<script>
	/**
	 * F0 Shell — SH1 Sphere switcher.
	 *
	 * The switcher states the consequence of switching, not just the list
	 * of options. This is the sheet every branch opens; no branch renders
	 * its own.
	 *
	 * The list is the Chief's own spheres. It is not a set the app
	 * decides — these are the areas a particular life is divided into,
	 * and two Chiefs will not share them.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Blank, Btn, Field, Note, SectionHead, SourceNote } from '$lib/kit';
	import { overlap } from '$lib/focus.js';
	import {
		addSphere,
		kept,
		load,
		overlaps,
		placeable,
		rename,
		retire,
		setOverlap,
		sphereOf,
		spheres
	} from '$lib/spheres.svelte.js';
	import { shell, setSphere } from '$lib/state.svelte.js';
	import { goto } from '$app/navigation';

	/** Said of the stand-ins only; a Chief's own spheres speak for themselves. */
	/** @type {Record<string, string>} */
	const BLURBS = {
		all: 'Every sphere at once — and the default',
		family: 'The household as a whole',
		spouse: 'The two of you',
		children: 'Each of them, and all of them',
		church: 'Callings, service, congregation',
		career: 'Your own work and standing',
		business: 'What you own and run',
		hobby: 'Time that answers to nobody'
	};

	let adding = $state('');
	let editing = $state('');
	let editName = $state('');
	let busy = $state(false);
	let fault = $state('');

	$effect(() => {
		if (!spheres.loaded) load();
	});

	/** @param {string} key */
	function pick(key) {
		setSphere(key);
		goto('/sphere');
	}

	/** @param {() => Promise<unknown>} work */
	async function run(work) {
		busy = true;
		fault = '';
		try {
			await work();
		} catch (/** @type {any} */ err) {
			fault = err?.message || 'The server did not answer.';
		} finally {
			busy = false;
		}
	}

	/** None, a quarter, a half — in the order the choice is offered. */
	const SHARES = /** @type {[number, string][]} */ ([
		[0, 'None'],
		[25, '25%'],
		[50, '50%']
	]);

	/** Every pair of spheres once, All life left out: it is all of them. */
	const pairs = $derived.by(() => {
		const keys = placeable()
			.map(([k]) => k)
			.filter((k) => k !== 'all');
		/** @type {[string, string][]} */
		const out = [];
		for (let i = 0; i < keys.length; i++)
			for (let j = i + 1; j < keys.length; j++) out.push([keys[i], keys[j]]);
		return out;
	});
	/** @param {string} a @param {string} b */
	const shareOf = (a, b) => overlap(a, b, overlaps.map);

	const add = () =>
		run(async () => {
			await addSphere(adding);
			adding = '';
		});

	const save = () =>
		run(async () => {
			await rename(editing, editName);
			editing = '';
		});
</script>

<svelte:head><title>Sphere · Chief</title></svelte:head>

<Screen back="/sphere" nav={false}>
	<Banner
		title="Look through a sphere"
		meta="What is in it stands forward, what is in a sphere it overlaps is set back, and the rest is out of view. All life shows everything alike."
	/>

	{#if spheres.source === 'error'}
		<SourceNote source="error" error={spheres.error} onretry={load} />
	{/if}
	{#each placeable() as [key, sphere] (key)}
		{#if editing === key}
			<div class="edit">
				<Field label="Name" bind:value={editName} />
				<Btn label={busy ? 'Saving…' : 'Save'} onclick={save} disabled={busy} />
				<Btn primary={false} label="Cancel" onclick={() => (editing = '')} />
				<Btn
					primary={false}
					label="Retire it"
					onclick={() => run(() => retire(key)).then(() => (editing = ''))}
					disabled={busy}
				/>
			</div>
		{:else}
			<div class="opt-row">
				<button class="opt" onclick={() => pick(key)} aria-pressed={shell.sphere === key}>
					<span class="sw" style="background:{sphere.swatch}"></span>
					<span class="body">
						<span class="t">{sphere.name}</span>
						<span class="m">{BLURBS[key] ?? 'Yours'}</span>
					</span>
					{#if shell.sphere === key}<span class="tick" aria-hidden="true">✓</span>{/if}
				</button>
				{#if kept() && key !== 'all'}
					<button
						class="pen"
						onclick={() => {
							editing = key;
							editName = sphere.name;
						}}
						aria-label="Change {sphere.name}">Change</button
					>
				{/if}
			</div>
		{/if}
	{/each}

	{#if kept()}
		<div class="add">
			<Field label="Add a sphere" placeholder="Grandchildren" bind:value={adding} />
			<Btn label={busy ? 'Adding…' : 'Add it'} onclick={add} disabled={busy || !adding.trim()} />
		</div>
	{:else if spheres.loaded && spheres.source !== 'error'}
		<Blank>
			These are stand-ins. {spheres.source === 'anon' ? 'Sign in' : 'Connect a server'} to write your
			own, which are nobody else's business.
		</Blank>
	{/if}
	{#if fault}<Blank>{fault}</Blank>{/if}

	{#if pairs.length}
		<SectionHead label="How they overlap" count={pairs.filter(([a, b]) => shareOf(a, b)).length} />
		{#if overlaps.error}
			<SourceNote source="error" error={overlaps.error} onretry={load} />
		{/if}
		{#each pairs as [a, b] (a + b)}
			<div class="pair">
				<span class="names">
					<span class="sw" style="background:{sphereOf(a).swatch}"></span>
					{sphereOf(a).name}
					<span class="amp">and</span>
					<span class="sw" style="background:{sphereOf(b).swatch}"></span>
					{sphereOf(b).name}
				</span>
				<span
					class="choice"
					role="group"
					aria-label="How much {sphereOf(a).name} and {sphereOf(b).name} overlap"
				>
					{#each SHARES as [share, word] (share)}
						<button
							type="button"
							class:on={shareOf(a, b) === share}
							aria-pressed={shareOf(a, b) === share}
							disabled={busy || !kept()}
							onclick={() => run(() => setOverlap(a, b, share))}
						>
							{word}
						</button>
					{/each}
				</span>
			</div>
		{/each}
		{#if !kept()}
			<Blank>These overlaps belong to the stand-ins. Yours are yours to set once you sign in.</Blank
			>
		{/if}
	{/if}

	<Note>
		Spheres overlap and compete for the same hours — that is the point of naming them, not a problem
		to fix. Say how much each pair overlaps: by half, by a quarter, or not at all. Only people and
		organizations are placed in a sphere; everything else is wherever its organization is.
	</Note>
</Screen>

<style>
	.pair {
		display: flex;
		flex-direction: column;
		gap: 9px;
		padding: 12px 14px;
		border: 1px solid var(--glass-line);
		border-radius: var(--r-sm);
		background: var(--glass);
		box-shadow: var(--glass-shadow);
	}
	.names {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px;
		font-family: var(--font-label);
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: var(--ink);
	}
	.names .sw {
		width: 10px;
		height: 10px;
	}
	.amp {
		font-family: var(--font-body, inherit);
		font-weight: 400;
		letter-spacing: 0;
		color: var(--ink-3);
	}
	.choice {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 6px;
	}
	.choice button {
		min-height: var(--tap-min);
		border: 1px solid var(--glass-line);
		border-radius: 999px;
		background: var(--card);
		font-family: var(--font-display);
		font-size: 15px;
		font-weight: 600;
		color: var(--ink-3);
		cursor: pointer;
	}
	.choice button.on {
		background: var(--ink);
		border-color: var(--ink);
		color: #fff;
	}
	.choice button:disabled {
		cursor: default;
		opacity: 0.75;
	}

	.opt-row {
		display: flex;
		align-items: stretch;
		gap: 8px;
	}
	.opt-row .opt {
		flex: 1;
		min-width: 0;
	}
	.pen {
		flex: none;
		min-height: var(--tap-min);
		padding: 0 14px;
		border: 1px solid var(--glass-line);
		border-radius: var(--r-sm);
		background: var(--glass);
		box-shadow: var(--glass-shadow);
		font-family: var(--font-display);
		font-size: 14.5px;
		font-weight: 600;
		color: var(--ink);
		cursor: pointer;
	}
	.edit,
	.add {
		/* The label sits on a pale pane here, not on the dark field. */
		--label-ink: var(--ink-3);
		display: grid;
		gap: 10px;
		padding: 14px 16px;
		border: 1px solid var(--glass-line);
		border-radius: var(--r-sm);
		background: var(--glass);
		box-shadow: var(--glass-shadow);
	}
	.opt {
		min-height: 58px;
		border: 1px solid var(--glass-line);
		border-radius: var(--r-sm);
		background: var(--glass);
		display: flex;
		align-items: center;
		gap: 13px;
		padding: 10px 16px;
		text-align: left;
		font-family: inherit;
		width: 100%;
		box-shadow: var(--glass-shadow);
		cursor: pointer;
	}
	.opt[aria-pressed='true'] {
		border-color: var(--glass-line);
		box-shadow:
			inset 0 1px 0 #ffffff,
			inset 0 0 0 2px var(--ink-3),
			0 0 0 3px rgba(255, 255, 255, 0.45),
			0 12px 26px -10px rgba(30, 20, 90, 0.5);
	}
	.sw {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		flex: none;
		box-shadow:
			inset 0 1px 1px rgba(255, 255, 255, 0.55),
			0 2px 5px rgba(30, 20, 90, 0.4);
	}
	.body {
		flex: 1;
		min-width: 0;
	}
	.t {
		display: block;
		font-family: var(--font-label);
		font-size: 14.5px;
		font-weight: 800;
		letter-spacing: 0.1em;
		color: var(--ink);
	}
	.m {
		display: block;
		font-size: 14.5px;
		color: var(--ink-3);
		margin-top: 3px;
	}
	.tick {
		font-weight: 800;
		font-size: 18px;
		color: var(--ink-2);
	}
</style>
