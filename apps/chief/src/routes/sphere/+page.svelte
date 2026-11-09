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
	import { Banner, Note } from '$lib/kit';
	import { SPHERES } from '$lib/spheres.js';
	import { shell } from '$lib/state.svelte.js';
	import { goto } from '$app/navigation';

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

	/** @param {string} key */
	function pick(key) {
		shell.sphere = key;
		goto('/');
	}
</script>

<svelte:head><title>Sphere · Chief</title></svelte:head>

<Screen back="/" nav={false}>
	<Banner
		title="You are writing into"
		meta="Records you create land in the sphere you pick here."
	/>

	{#each Object.entries(SPHERES) as [key, sphere] (key)}
		<button class="opt" onclick={() => pick(key)} aria-pressed={shell.sphere === key}>
			<span class="sw" style="background:{sphere.swatch}"></span>
			<span class="body">
				<span class="t">{sphere.name}</span>
				<span class="m">{BLURBS[key]}</span>
			</span>
			{#if shell.sphere === key}<span class="tick" aria-hidden="true">✓</span>{/if}
		</button>
	{/each}

	<Note>
		Spheres overlap and compete for the same hours — that is the point of naming them, not a problem
		to fix. Nothing is hidden either way: All life still shows all of it.
	</Note>
</Screen>

<style>
	.opt {
		min-height: 48px;
		border: 1px solid var(--line-3);
		border-radius: 11px;
		background: var(--card);
		display: flex;
		align-items: center;
		gap: 11px;
		padding: 8px 13px;
		text-align: left;
		font-family: inherit;
		width: 100%;
	}
	.opt[aria-pressed='true'] {
		border-color: var(--ink-4);
	}
	.sw {
		width: 14px;
		height: 14px;
		border-radius: 4px;
		flex: none;
	}
	.body {
		flex: 1;
		min-width: 0;
	}
	.t {
		display: block;
		font-family: var(--font-mono);
		font-size: 11.5px;
		font-weight: 600;
		letter-spacing: 0.09em;
		color: var(--ink);
	}
	.m {
		display: block;
		font-size: 12px;
		color: var(--ink-3);
		margin-top: 3px;
	}
	.tick {
		font-weight: 700;
	}
</style>
