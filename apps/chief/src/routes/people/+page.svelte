<script>
	/**
	 * F1 Directory — D1 People.
	 *
	 * Filtered by sphere, not by a fixed set of labels. "All / Personal /
	 * Work" was a guess at how a life divides; the spheres are the Chief's
	 * own answer to that, and a person can be in several of them — Carmen
	 * is Business and Career, June is Spouse and Family.
	 *
	 * The filter lists only spheres that somebody is actually in, so it
	 * never offers an empty result, and it includes invented ones like
	 * "Australian Rugby" the moment a person is put there.
	 *
	 * Every person is an Organization — type C in the Build vocabulary —
	 * so this is not a different kind of record from the Organizations
	 * lens beside it. It is the Directory filtered to the individuals.
	 *
	 * Reads from PocketBase when one is reachable and a session is live,
	 * and falls back to the design fixtures otherwise, saying which it used.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import LensSwitch from '$lib/shell/LensSwitch.svelte';
	import { Alert, Field, Row, Btn, SourceNote, EmptyLive, SphereTags } from '$lib/kit';
	import { listPeople, seedDirectory } from '$lib/pb.js';
	import { sphereOf } from '$lib/spheres.js';

	const LENSES = [
		{ label: 'People', href: '/people', icon: 'people' },
		{ label: 'Organizations', href: '/organizations', icon: 'sphere' }
	];

	let load = $state(listPeople());
	let sphere = $state('all');
	let query = $state('');

	async function seed() {
		await seedDirectory();
		load = listPeople();
	}

	/** @param {any[]} people */
	const sphereList = (people) => [...new Set(people.flatMap((p) => p.spheres ?? []))].sort();

	/** @param {any[]} people */
	function visible(people) {
		const q = query.trim().toLowerCase();
		return people.filter((p) => {
			const inSphere = sphere === 'all' || (p.spheres ?? []).includes(sphere);
			if (!inSphere) return false;
			if (!q) return true;
			return `${p.name} ${p.meta ?? ''} ${(p.spheres ?? []).join(' ')}`.toLowerCase().includes(q);
		});
	}
</script>

<svelte:head><title>People · Chief</title></svelte:head>

<Screen search>
	<LensSwitch label="Directory view" items={LENSES} at="/people" />
	<Field label="Search people" placeholder="Name, role, sphere" bind:value={query} />

	{#await load}
		<Row t="cool" title="Loading people…" dot={false} />
	{:then { data, source }}
		{#if source === 'live' && data.length === 0}
			<EmptyLive what="people" onseed={seed} />
		{:else}
			{@const all = sphereList(data)}
			{@const shown = visible(data)}

			<div class="filter" role="group" aria-label="Filter by sphere">
				<button type="button" class:on={sphere === 'all'} onclick={() => (sphere = 'all')}>
					All life
				</button>
				{#each all as key (key)}
					{@const s = sphereOf(key)}
					<button type="button" class:on={sphere === key} onclick={() => (sphere = key)}>
						<span class="sw" style="background:{s.swatch}"></span>
						{s.name}
					</button>
				{/each}
			</div>

			<div class="grid">
				{#each shown as p (p.id)}
					<a class="person edged" href="/people/{p.id}">
						<span class="who">
							<span class="nm">{p.name}</span>
							<span class="mt">{p.meta}</span>
						</span>
						<SphereTags keys={p.spheres ?? []} size="sm" />
					</a>
				{/each}
			</div>

			{#if shown.length === 0}
				<p class="none">Nobody in that sphere yet.</p>
			{/if}

			<SourceNote {source} />
		{/if}
	{:catch}
		<Alert
			title="Could not load people"
			meta="Neither the backend nor the local fixtures answered."
		/>
	{/await}

	<Btn t="cool" href="/people/add" label="Add person" />
</Screen>

<style>
	/* Scrolls rather than wraps: the number of spheres is the Chief's
	   business, and a filter that grows a second row pushes the list it
	   filters off the screen. */
	.filter {
		display: flex;
		gap: 8px;
		overflow-x: auto;
		scrollbar-width: none;
		padding: 2px var(--shell-gutter) 8px;
		margin: -2px calc(var(--shell-gutter) * -1) -6px;
	}
	.filter::-webkit-scrollbar {
		display: none;
	}
	.filter button {
		display: flex;
		align-items: center;
		gap: 6px;
		flex: none;
		min-height: 36px;
		padding: 0 14px;
		border-radius: 999px;
		border: 1px solid var(--glass-line);
		background: var(--glass);
		font-family: var(--font-label);
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: var(--ink-3);
		cursor: pointer;
		white-space: nowrap;
		box-shadow:
			inset 0 1px 0 #ffffff,
			0 4px 10px -5px rgba(30, 20, 90, 0.45);
	}
	.filter button.on {
		border-color: color-mix(in srgb, var(--tone-cool) 55%, #ffffff);
		background: linear-gradient(180deg, #ffffff 0%, var(--tone-cool-tint) 100%);
		color: var(--tone-cool);
		box-shadow:
			inset 0 1px 0 #ffffff,
			0 0 0 3px color-mix(in srgb, var(--tone-cool) 16%, transparent),
			0 5px 12px -5px color-mix(in srgb, var(--tone-cool) 60%, transparent);
	}
	.sw {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		box-shadow:
			inset 0 1px 1px rgba(255, 255, 255, 0.55),
			0 1px 3px rgba(30, 20, 90, 0.35);
	}
	.person {
		display: flex;
		flex-direction: column;
		gap: 7px;
		padding: 14px 16px 14px 20px;
		border: 1px solid var(--glass-line);
		border-radius: var(--r-md);
		background: var(--glass);
		box-shadow: var(--glass-shadow);
		text-decoration: none;
		--edge-ink: var(--tone-cool);
	}
	.who {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.nm {
		font-size: 18px;
		font-weight: 700;
		color: var(--ink);
		font-family: var(--font-display);
		letter-spacing: -0.005em;
	}
	.mt {
		font-size: 14.5px;
		color: var(--ink-3);
	}
	.grid {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.none {
		margin: 0;
		padding: 14px 2px;
		text-align: center;
		font-size: 14.5px;
		color: var(--on-field-2);
	}
	/* Desktop. The filter has room to wrap, so nothing hides off the
	   right edge, and the cards pair up rather than each stretching to a
	   full-width band with one name in it. */
	@media (min-width: 900px) {
		.filter {
			flex-wrap: wrap;
			overflow-x: visible;
		}
		.grid {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 10px;
		}
	}
</style>
