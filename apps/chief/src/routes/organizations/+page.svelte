<script>
	/**
	 * F1 Directory — D4 Organizations.
	 *
	 * An Organization is the canonical actor: anything that can hold
	 * Asset Rights, exercise Action Stewardship, or be addressed as Me,
	 * You, Us or Them. People are Organizations too — type C — and live
	 * under the People lens; this one shows the bodies they are tied
	 * together by.
	 *
	 * Reads the account's own records when signed in, and the samples
	 * otherwise, saying which.
	 *
	 * Filtered by type rather than by sphere, because a type answers the
	 * question this list is for: what kind of body is this. The sphere
	 * each one operates in is shown on the card, since an Organization
	 * of any type may work across several.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import LensSwitch from '$lib/shell/LensSwitch.svelte';
	import { Alert, Btn, Field, FocusNote, Row, SourceNote, SphereTags, TypeBadge } from '$lib/kit';
	import { focused, inFocus, outOfView } from '$lib/spheres.svelte.js';
	import { ORGS } from '$lib/data.js';
	import { listOrganizations } from '$lib/pb.js';
	import { orgType, perspective } from '$lib/orgtypes.js';

	const LENSES = [
		{ label: 'People', href: '/people', icon: 'people' },
		{ label: 'Organizations', href: '/organizations', icon: 'sphere' }
	];

	let load = $state(listOrganizations());
	let query = $state('');
	let code = $state('all');

	/** @param {import('$lib/pb.js').OrgRow[]} all */
	const codesIn = (all) => [...new Set(all.map((o) => o.code))];

	/** @param {import('$lib/pb.js').OrgRow[]} all */
	function visible(all) {
		const q = query.trim().toLowerCase();
		const found = all.filter((o) => {
			if (code !== 'all' && o.code !== code) return false;
			if (!q) return true;
			return `${o.name} ${o.blurb} ${o.charter}`.toLowerCase().includes(q);
		});
		// Decision 10: set back or out of view by the sphere in focus.
		return inFocus(found, (o) => o.spheres);
	}

	/**
	 * Us or Them is read from membership, and membership is only in the
	 * samples so far. A real record says "You" when it is the Chief's
	 * own and nothing otherwise, rather than guessing.
	 * @param {import('$lib/pb.js').OrgRow} o
	 */
	const standing = (o) => (o.self ? 'You' : ORGS[o.id] ? perspective(ORGS[o.id]) : '');
</script>

<svelte:head><title>Organizations · Chief</title></svelte:head>

<Screen search>
	<LensSwitch label="Directory view" items={LENSES} at="/organizations" />
	<Field label="Search organizations" placeholder="Name, purpose, sphere" bind:value={query} />

	{#await load}
		<Row t="cool" title="Loading organizations…" dot={false} />
	{:then { data, source, error }}
		{@const shown = visible(data)}
		{#if data.length > 1}
			<div class="filter" role="group" aria-label="Filter by organization type">
				<button type="button" class:on={code === 'all'} onclick={() => (code = 'all')}>
					All types
				</button>
				{#each codesIn(data) as c (c)}
					<button type="button" class:on={code === c} onclick={() => (code = c)}>
						{c} · {orgType(c).name}
					</button>
				{/each}
			</div>
		{/if}

		<FocusNote
			what="organizations"
			quiet={shown.filter((x) => x.quiet).length}
			hidden={outOfView(data, (o) => o.spheres)}
		/>
		{#if source !== 'error' && shown.length === 0}
			<p class="none">{focused() ? 'None in view.' : 'No organizations of that type.'}</p>
		{:else}
			<div class="grid">
				{#each shown as { item: o, quiet } (o.id)}
					{@const sample = ORGS[o.id]}
					<a class="org edged" class:quiet href="/organizations/{o.id}">
						<span class="top">
							<TypeBadge code={o.code} showName={false} />
							<span class="nm">{o.name}</span>
							<span class="persp">{standing(o)}</span>
						</span>
						{#if o.charter || o.blurb}<span class="charter">{o.charter || o.blurb}</span>{/if}
						{#if o.self}
							<span class="charter"
								>What you hold is held by this. Nobody owns anything in person.</span
							>
						{/if}
						<SphereTags keys={o.spheres} size="sm" />
						{#if source !== 'live' && sample}
							<span class="foot">
								{sample.members.length} member{sample.members.length === 1 ? '' : 's'}
								{#if sample.resolution !== 'known'}· <em>{sample.resolution}</em>{/if}
							</span>
						{/if}
					</a>
				{/each}
			</div>
		{/if}

		<SourceNote {source} {error} onretry={() => (load = listOrganizations())} />
	{:catch}
		<Alert title="Could not load organizations" meta="Reload to try again." />
	{/await}

	<Btn t="cool" href="/organizations/new" label="Add organization" />
</Screen>

<style>
	/* Related to the sphere in focus, not in it. */
	.org.quiet {
		background: var(--glass-dim);
		box-shadow: none;
		--edge: 0px;
	}
	.org.quiet .nm {
		font-weight: 500;
	}

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
	.grid {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.org {
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
	.top {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.nm {
		font-size: 18px;
		font-weight: 700;
		color: var(--ink);
		font-family: var(--font-display);
		letter-spacing: -0.005em;
	}
	/* Perspective is contextual, so it is shown but never stored: an
	   Organization whose membership includes Me reads as Us. */
	.persp {
		margin-left: auto;
		font-family: var(--font-label);
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.1em;
		color: var(--ink-3);
	}
	.charter {
		font-size: 14px;
		line-height: 1.4;
		color: var(--ink-3);
	}
	.foot {
		font-family: var(--font-label);
		font-size: 13px;
		letter-spacing: 0.06em;
		color: var(--ink-3);
		font-weight: 600;
	}
	.none {
		margin: 0;
		padding: 14px 2px;
		text-align: center;
		font-size: 14.5px;
		color: var(--on-field-2);
	}
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
