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
	 * Filtered by type rather than by sphere, because a type answers the
	 * question this list is for: what kind of body is this. The sphere
	 * each one operates in is shown on the card, since an Organization
	 * of any type may work across several.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import LensSwitch from '$lib/shell/LensSwitch.svelte';
	import { Alert, Btn, Field, SourceNote, SphereTags, TypeBadge } from '$lib/kit';
	import { ORGS } from '$lib/data.js';
	import { orgType, perspective } from '$lib/orgtypes.js';

	const LENSES = [
		{ label: 'People', href: '/people', icon: 'people' },
		{ label: 'Organizations', href: '/organizations', icon: 'sphere' }
	];

	let query = $state('');
	let code = $state('all');

	const all = Object.entries(ORGS);
	const codes = [...new Set(all.map(([, o]) => o.code))];

	const shown = $derived(
		all.filter(([, o]) => {
			if (code !== 'all' && o.code !== code) return false;
			const q = query.trim().toLowerCase();
			if (!q) return true;
			return `${o.name} ${o.blurb} ${o.charter} ${o.spheres.join(' ')}`.toLowerCase().includes(q);
		})
	);
</script>

<svelte:head><title>Organizations · Chief</title></svelte:head>

<Screen search>
	<LensSwitch label="Directory view" items={LENSES} at="/organizations" />
	<Field label="Search organizations" placeholder="Name, purpose, sphere" bind:value={query} />

	<div class="filter" role="group" aria-label="Filter by organization type">
		<button type="button" class:on={code === 'all'} onclick={() => (code = 'all')}>All types</button
		>
		{#each codes as c (c)}
			<button type="button" class:on={code === c} onclick={() => (code = c)}>
				{c} · {orgType(c).name}
			</button>
		{/each}
	</div>

	{#if shown.length === 0}
		<p class="none">No organizations of that type.</p>
	{:else}
		<div class="grid">
			{#each shown as [id, o] (id)}
				<a class="org" href="/organizations/{id}">
					<span class="top">
						<TypeBadge code={o.code} showName={false} />
						<span class="nm">{o.name}</span>
						<span class="persp">{perspective(o)}</span>
					</span>
					<span class="charter">{o.charter}</span>
					<SphereTags keys={o.spheres} size="sm" />
					<span class="foot">
						{o.members.length} member{o.members.length === 1 ? '' : 's'}
						{#if o.resolution !== 'known'}· <em>{o.resolution}</em>{/if}
					</span>
				</a>
			{/each}
		</div>
	{/if}

	<SourceNote source="fixture" />
	<Btn t="cool" href="/organizations/new" label="Add organization" />
</Screen>

<style>
	.filter {
		display: flex;
		gap: 6px;
		overflow-x: auto;
		padding-bottom: 2px;
		scrollbar-width: none;
	}
	.filter::-webkit-scrollbar {
		display: none;
	}
	.filter button {
		flex: none;
		min-height: 32px;
		padding: 0 11px;
		border-radius: 999px;
		border: 1px solid var(--line-2);
		background: var(--card);
		font-family: var(--font-mono);
		font-size: 9.5px;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: var(--ink-3);
		cursor: pointer;
		white-space: nowrap;
	}
	.filter button.on {
		border-color: var(--tone-cool);
		background: var(--tone-cool-tint);
		color: var(--tone-cool);
	}
	.grid {
		display: flex;
		flex-direction: column;
		gap: 9px;
	}
	.org {
		display: flex;
		flex-direction: column;
		gap: 7px;
		padding: 11px 13px;
		border: 1px solid var(--line-3);
		border-left: 3px solid var(--tone-cool);
		border-radius: 3px 12px 12px 3px;
		background: var(--card);
		text-decoration: none;
	}
	.top {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.nm {
		font-size: 14.5px;
		font-weight: 600;
		color: var(--ink);
	}
	/* Perspective is contextual, so it is shown but never stored: an
	   Organization whose membership includes Me reads as Us. */
	.persp {
		margin-left: auto;
		font-family: var(--font-mono);
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.1em;
		color: var(--ink-4);
	}
	.charter {
		font-size: 12px;
		line-height: 1.4;
		color: var(--ink-3);
	}
	.foot {
		font-family: var(--font-mono);
		font-size: 9.5px;
		letter-spacing: 0.06em;
		color: var(--ink-4);
	}
	.none {
		margin: 0;
		padding: 14px 2px;
		text-align: center;
		font-size: 12.5px;
		color: var(--ink-3);
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
