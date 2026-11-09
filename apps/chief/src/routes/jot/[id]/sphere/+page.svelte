<script>
	/**
	 * F2 Capture — Sphere It.
	 *
	 * The second of a jot's three stages. Everything here is optional and
	 * nothing blocks: a jot that leaves with no sphere is still a jot, and
	 * stays in the queue rather than being lost or nagged about.
	 *
	 * Order matters. Sphere first, because it narrows everything under it
	 * — once a jot belongs to Azbolt, the people and assets worth
	 * offering are Azbolt's. People and assets then attach inside that
	 * narrowing rather than from the whole directory.
	 *
	 * Task It is offered at the end as a choice, not a step. Most jots
	 * are a record of something, not a commitment to do it, and promoting
	 * every jot to a task is how a capture tool turns into a nagging
	 * backlog.
	 */
	import { page } from '$app/stores';
	import Screen from '$lib/shell/Screen.svelte';
	import { Btn, Note, Row, SectionHead } from '$lib/kit';
	import { PLACEABLE } from '$lib/spheres.js';
	import { UNSPHERED, PEOPLE, ORGS, ASSETS } from '$lib/data.js';

	const id = $derived($page.params.id ?? '');
	const jot = $derived(UNSPHERED[id] ?? { text: 'Untitled jot', meta: 'No sphere', thrown: '' });

	/**
	 * A jot is in All life until it is told otherwise. That is a real
	 * placement, not an empty one, so there is nothing to clear and
	 * nothing to warn about.
	 */
	let sphere = $state('all');
	/** @type {string[]} */
	let who = $state([]);
	/** @type {string[]} */
	let assets = $state([]);

	/** @param {string[]} list @param {string} key */
	function toggle(list, key) {
		return list.includes(key) ? list.filter((k) => k !== key) : [...list, key];
	}

	const attached = $derived(who.length + assets.length);
</script>

<svelte:head><title>Sphere it · Chief</title></svelte:head>

<Screen back="/" nav={false}>
	<blockquote class="jot">
		<p>{jot.text}</p>
		<span class="said">Your words, kept exactly · thrown {jot.thrown}</span>
	</blockquote>

	<SectionHead label="Select sphere" t="warm" />
	<div class="grid">
		{#each PLACEABLE as [key, sph] (key)}
			<button
				type="button"
				class="pick"
				class:on={sphere === key}
				aria-pressed={sphere === key}
				onclick={() => (sphere = key)}
			>
				<span class="swatch" style="background:{sph.swatch}"></span>
				<span class="nm">{sph.name}</span>
			</button>
		{/each}
	</div>

	<SectionHead label="Any people or organizations" t="cool" />
	<div class="grid">
		{#each Object.entries(PEOPLE) as [key, p] (key)}
			<button
				type="button"
				class="pick"
				class:on={who.includes(key)}
				aria-pressed={who.includes(key)}
				onclick={() => (who = toggle(who, key))}
			>
				<span class="nm">{p.name}</span>
			</button>
		{/each}
		{#each Object.entries(ORGS) as [key, o] (key)}
			<button
				type="button"
				class="pick"
				class:on={who.includes(key)}
				aria-pressed={who.includes(key)}
				onclick={() => (who = toggle(who, key))}
			>
				<span class="nm">{o.name}</span>
			</button>
		{/each}
	</div>

	<SectionHead label="Any assets" t="cool" />
	<div class="grid">
		{#each Object.entries(ASSETS) as [key, a] (key)}
			<button
				type="button"
				class="pick"
				class:on={assets.includes(key)}
				aria-pressed={assets.includes(key)}
				onclick={() => (assets = toggle(assets, key))}
			>
				<span class="nm">{a.name}</span>
			</button>
		{/each}
	</div>

	<div class="done">
		<Btn t="warm" href="/" label={sphere === 'all' ? 'Keep it in all life' : 'Sphere it'} />
		<Btn primary={false} href="/work/tasks/new" label="Task it" />
	</div>

	<Note>
		{attached === 0
			? 'Nothing attached yet. All life is a real answer, not a blank — a jot can stay there.'
			: `${attached} attached. Everything here is optional and can change later.`}
	</Note>
</Screen>

<style>
	.jot {
		margin: 0;
		border-left: 3px solid var(--tone-clay);
		background: var(--card);
		border-radius: 0 11px 11px 0;
		padding: 11px 13px;
	}
	.jot p {
		margin: 0 0 5px;
		font-family: var(--font-serif);
		font-size: 16px;
		line-height: 1.35;
		color: var(--ink);
	}
	.said {
		font-family: var(--font-mono);
		font-size: 10px;
		letter-spacing: 0.05em;
		color: var(--ink-3);
	}
	.grid {
		display: flex;
		flex-wrap: wrap;
		gap: 7px;
	}
	.pick {
		display: flex;
		align-items: center;
		gap: 7px;
		min-height: var(--tap-min);
		padding: 0 13px;
		border-radius: 11px;
		border: 1px solid var(--line-2);
		background: var(--card);
		font-family: inherit;
		font-size: 13px;
		color: var(--ink-2);
		cursor: pointer;
	}
	/* Selected state carries a filled background and a heavier border, so
	   it survives being read without colour. */
	.pick.on {
		border-color: var(--tone-clay);
		background: var(--tone-clay-tint);
		color: var(--ink);
		font-weight: 600;
	}
	.swatch {
		width: 11px;
		height: 11px;
		border-radius: 3px;
		flex: none;
	}
	.nm {
		white-space: nowrap;
	}
	.done {
		display: flex;
		flex-direction: column;
		gap: 9px;
		padding-top: 6px;
	}
</style>
