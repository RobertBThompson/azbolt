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
	import { Banner, Blank, Btn, Field, Note, SourceNote } from '$lib/kit';
	import {
		addSphere,
		kept,
		load,
		placeable,
		rename,
		retire,
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
		title="You are writing into"
		meta="Records you create land in the sphere you pick here."
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

	<Note>
		Spheres overlap and compete for the same hours — that is the point of naming them, not a problem
		to fix. Nothing is hidden either way: All life still shows all of it.
	</Note>
</Screen>

<style>
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
