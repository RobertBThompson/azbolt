<script>
	/**
	 * Sphere.
	 *
	 * The branch that holds what a sphere *is made of*, as opposed to
	 * what you are doing right now. Home is Jot; this is the standing
	 * material behind it — the plans, the areas of living themselves,
	 * the documents, and the notes.
	 *
	 * Four entries and no more. This is a way in, not a dashboard: a
	 * screen whose whole job is to send you somewhere should not try to
	 * summarise where it is sending you.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Icon } from '$lib/kit';
	import { tone } from '$lib/kit/tone.js';
	import { SPHERES } from '$lib/spheres.js';
	import { shell } from '$lib/state.svelte.js';

	const sphere = $derived(SPHERES[shell.sphere] ?? SPHERES.all);

	/* Tone keys are not token names — warm is --tone-clay — so these go
	   through the helper rather than being interpolated into a custom
	   property that may not exist. */
	const ENTRIES = [
		{
			href: '/sphere/switch',
			icon: 'globe',
			label: 'Spheres',
			meta: 'The areas of living themselves, and which one you are in',
			tone: 'cool'
		},
		{
			href: '/records/plans/overview',
			icon: 'doc',
			label: 'Business plans',
			meta: 'The motor behind a sphere — career, household or company',
			tone: 'warm'
		},
		{
			href: '/documents',
			icon: 'doc',
			label: 'Documents',
			meta: 'Files, wherever they actually live',
			tone: 'cool'
		},
		{
			href: '/notes',
			icon: 'notes',
			label: 'Notes',
			meta: 'An outline per thought, nested as deep as it needs',
			tone: 'cool'
		}
	];
</script>

<svelte:head><title>Sphere · Chief</title></svelte:head>

<Screen>
	<header class="head">
		<p class="eyebrow">You are in</p>
		<h1>{sphere.name}</h1>
	</header>

	<ul class="entries">
		{#each ENTRIES as e (e.href)}
			<li>
				<a href={e.href} style="--t:{tone(e.tone).ink}">
					<span class="glyph"><Icon name={e.icon} size={18} /></span>
					<span class="body">
						<span class="t">{e.label}</span>
						<span class="m">{e.meta}</span>
					</span>
					<span class="x" aria-hidden="true">›</span>
				</a>
			</li>
		{/each}
	</ul>
</Screen>

<style>
	.head {
		padding: 2px 2px 0;
	}
	.head h1 {
		margin: 1px 0 0;
		font-family: var(--font-serif);
		font-weight: 500;
		font-size: 29px;
		line-height: 1.1;
		letter-spacing: 0.04em;
		color: var(--ink);
	}
	.entries {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	a {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 13px;
		border: 1px solid var(--line-3);
		border-left: 4px solid var(--t);
		border-radius: 4px 13px 13px 4px;
		background: var(--card);
		text-decoration: none;
		box-shadow: 0 1px 2px rgba(30, 26, 24, 0.04);
	}
	.glyph {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		display: grid;
		place-items: center;
		background: var(--sunk);
		color: var(--t);
		flex: none;
	}
	.body {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.t {
		font-size: 15px;
		font-weight: 600;
		color: var(--ink);
	}
	.m {
		font-size: 12px;
		line-height: 1.4;
		color: var(--ink-3);
	}
	.x {
		color: var(--ink-4);
		font-size: 17px;
	}
	@media (min-width: 900px) {
		.entries {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
