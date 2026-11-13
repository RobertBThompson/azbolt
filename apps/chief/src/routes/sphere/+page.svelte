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
			href: '/sphere/plans',
			icon: 'doc',
			label: 'Business plans',
			meta: 'Ties to an organization, and pushes out endeavors, tasks and assets',
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
				<a class="edged" href={e.href} style="--t:{tone(e.tone).ink}">
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
		color: var(--on-field-2);
	}
	.head h1 {
		margin: 1px 0 0;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 33px;
		line-height: 1.1;
		letter-spacing: 0.02em;
		color: var(--on-field);
		text-shadow: var(--on-field-shade);
	}
	.entries {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	a {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 14px 16px 14px 20px;
		border: 1px solid var(--glass-line);
		border-radius: var(--r-md);
		background: var(--glass);
		box-shadow: var(--glass-shadow);
		text-decoration: none;
		--edge-ink: var(--t);
	}
	.glyph {
		width: 42px;
		height: 42px;
		border-radius: var(--r-xs);
		display: grid;
		place-items: center;
		background: var(--gloss), linear-gradient(135deg, color-mix(in srgb, var(--t) 72%, #ffffff), var(--t));
		color: #ffffff;
		flex: none;
		box-shadow:
			inset 0 1px 0 #ffffff,
			inset 0 -5px 8px -5px rgba(86, 66, 170, 0.4),
			0 4px 10px -3px color-mix(in srgb, var(--t) 50%, transparent);
	}
	.body {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.t {
		font-size: 18px;
		font-weight: 700;
		color: var(--ink);
		font-family: var(--font-display);
	}
	.m {
		font-size: 14.5px;
		line-height: 1.4;
		color: var(--ink-3);
	}
	.x {
		color: var(--ink-3);
		font-size: 24px;
		font-weight: 500;
	}
	@media (min-width: 900px) {
		.entries {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
