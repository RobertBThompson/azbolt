<script>
	/**
	 * B7 Business Plan — P1.
	 * The blank-page problem solved by removing the blank page. No section
	 * list is shown before there is content to put in it — a list of eleven
	 * empty sections is a demand, not a start.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Hero, Banner, Btn, Icon, Note, SectionHead } from '$lib/kit';
	import { SPHERES } from '$lib/spheres.js';
	import { shell } from '$lib/state.svelte.js';

	const sphere = $derived(SPHERES[shell.sphere] ?? SPHERES.all);

	/**
	 * What a plan is for, structurally.
	 *
	 * A plan belongs to a sphere and ties to an Organization, and it is
	 * the thing that pushes records out: a Circle of Friends plan under
	 * the Friends sphere can push a committee into Organizations, send an
	 * Endeavor with its Tasks, and assign the Assets that committee will
	 * own, rent or use. Goals and objectives sit in the plan; the work
	 * and the things it needs end up in the branches that already hold
	 * them, rather than being copied into a document.
	 */
	const PUSHES = [
		{ icon: 'sphere', label: 'Organization', meta: 'A committee, project group or branch' },
		{ icon: 'action', label: 'Endeavor', meta: 'An outcome the plan commits to' },
		{ icon: 'task', label: 'Tasks', meta: 'The steps under it, with stewardship named' },
		{ icon: 'asset', label: 'Assets', meta: 'What they will own, rent or use' }
	];
</script>

<svelte:head><title>Business plan · Chief</title></svelte:head>

<Screen back="/sphere" nav={false}>
	<Hero
		t="cool"
		title="Tell me about Azbolt"
		meta="Ninety seconds, out loud, in your own words. I will sort it into the standard sections."
	/>
	<Banner
		t="cool"
		title="You could start with"
		meta="What you sell, who buys it, and what is in the way."
	/>
	<Btn t="ai" href="/sphere/plans/braindump" label="Start talking" />
	<Btn primary={false} href="/sphere/plans/coverage" label="Type it instead" />
	<Btn primary={false} href="/sphere/plans/overview" label="See an existing plan" />

	<SectionHead label="A plan pushes out" t="warm" count={PUSHES.length} />
	<p class="lede">
		This plan sits in {sphere.name} and ties to an organization. Its goals and objectives stay here; what
		the plan commits to goes out into the branches that already hold that kind of record.
	</p>
	<ul class="pushes">
		{#each PUSHES as p (p.label)}
			<li>
				<span class="g"><Icon name={p.icon} size={16} /></span>
				<span class="b">
					<span class="t">{p.label}</span>
					<span class="m">{p.meta}</span>
				</span>
			</li>
		{/each}
	</ul>
	<Note>
		Nothing is duplicated. A plan that sends an endeavor does not keep its own copy of it — the
		endeavor lives in Action, and the plan points at it.
	</Note>
</Screen>

<style>
	.lede {
		margin: 0 2px;
		font-size: 12.5px;
		line-height: 1.5;
		color: var(--ink-3);
	}
	.pushes {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 1px;
		border: 1px solid var(--line-3);
		border-radius: 12px;
		overflow: hidden;
		background: var(--line-4);
	}
	li {
		display: flex;
		align-items: center;
		gap: 11px;
		padding: 9px 13px;
		background: var(--card);
	}
	.g {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		display: grid;
		place-items: center;
		background: var(--tone-clay-tint);
		color: var(--tone-clay);
		flex: none;
	}
	.b {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}
	.t {
		font-size: 13.5px;
		font-weight: 600;
		color: var(--ink);
	}
	.m {
		font-size: 11.5px;
		color: var(--ink-3);
	}
</style>
