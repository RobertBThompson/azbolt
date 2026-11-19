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
	import { Alert, Field, FocusNote, Row, Btn, SourceNote, EmptyLive, SphereTags } from '$lib/kit';
	import { listPeople } from '$lib/pb.js';
	import { inFocus, outOfView } from '$lib/spheres.svelte.js';

	const LENSES = [
		{ label: 'People', href: '/people', icon: 'people' },
		{ label: 'Organizations', href: '/organizations', icon: 'sphere' }
	];

	let load = $state(listPeople());
	let query = $state('');

	/**
	 * Decision 10: the sphere in focus sets people back or out of view;
	 * it is chosen once, in the sphere switcher, not again on each list.
	 * @param {any[]} people
	 */
	function visible(people) {
		const q = query.trim().toLowerCase();
		const found = people.filter(
			(p) =>
				!q || `${p.name} ${p.meta ?? ''} ${(p.spheres ?? []).join(' ')}`.toLowerCase().includes(q)
		);
		return inFocus(found, (p) => p.spheres ?? []);
	}
</script>

<svelte:head><title>People · Chief</title></svelte:head>

<Screen search>
	<LensSwitch label="Directory view" items={LENSES} at="/people" />
	<Field label="Search people" placeholder="Name, role, sphere" bind:value={query} />

	{#await load}
		<Row t="cool" title="Loading people…" dot={false} />
	{:then { data, source, error }}
		{#if source === 'live' && data.length === 0}
			<EmptyLive what="people" add="person" />
		{:else}
			{@const shown = visible(data)}
			<FocusNote
				what="people"
				quiet={shown.filter((x) => x.quiet).length}
				hidden={outOfView(data, (p) => p.spheres ?? [])}
			/>

			<div class="grid">
				{#each shown as { item: p, quiet } (p.id)}
					<a class="person edged" class:quiet href="/people/{p.id}">
						<span class="who">
							<span class="nm">{p.name}</span>
							<span class="mt">{p.meta}</span>
						</span>
						<SphereTags keys={p.spheres ?? []} size="sm" />
					</a>
				{/each}
			</div>

			{#if shown.length === 0}
				<p class="none">{query.trim() ? 'Nobody matches.' : 'Nobody in view.'}</p>
			{/if}

			<SourceNote {source} {error} onretry={() => (load = listPeople())} />
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
	/* Related to the sphere in focus, not in it: set back, still legible. */
	.person.quiet {
		background: var(--glass-dim);
		box-shadow: none;
		--edge: 0px;
	}
	.person.quiet .nm {
		font-weight: 500;
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
	/* Desktop. The cards pair up rather than each stretching to a
	   full-width band with one name in it. */
	@media (min-width: 900px) {
		.grid {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 10px;
		}
	}
</style>
