<script>
	/**
	 * F1 Directory — Organization.
	 *
	 * Laid out the way the Lexicon defines an Organization: a type, a
	 * charter, the life Spheres it operates in, its members, and — kept
	 * apart on purpose — its two capacities.
	 *
	 * Asset Rights and Action Stewardship are never one list. Rights say
	 * what it may hold and claim; Stewardship says what it is answerable
	 * for having done. An Organization can steward actions over Assets it
	 * holds no right in (a manager, a trustee, a committee) and hold
	 * rights in Assets it never touches. Collapsing them would lose the
	 * distinction that makes a manager not an owner.
	 *
	 * Control is shown only where the vocabulary permits it. C is the
	 * only type that is itself an intelligence; every other type is a
	 * combination of Organizations, so what it shows is how Cs are tied
	 * together, not an intelligence of its own.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Btn, Note, SectionHead, SphereTags, TypeBadge } from '$lib/kit';
	import { ORGS, PEOPLE } from '$lib/data.js';
	import { orgType, perspective } from '$lib/orgtypes.js';
	import { page } from '$app/stores';

	const id = $derived($page.params.id ?? '');
	const org = $derived(ORGS[id] ?? ORGS.tn);
	const type = $derived(orgType(org.code));
	const persp = $derived(perspective(org));

	/** @param {string} who */
	const nameOf = (who) => (who === 'me' ? 'You' : (PEOPLE[who]?.name ?? ORGS[who]?.name ?? who));

	const parent = $derived(org.controlledBy ? ORGS[org.controlledBy] : null);
</script>

<svelte:head><title>{org.name} · Chief</title></svelte:head>

<Screen back="/organizations" nav={false}>
	<header class="head">
		<div class="line">
			<TypeBadge code={org.code} />
			<span class="persp">{persp}</span>
		</div>
		<h1>{org.name}</h1>
		<p class="charter">{org.charter}</p>
		{#if org.resolution !== 'known'}
			<p class="res">{org.resolution} — a real record that can resolve later</p>
		{/if}
	</header>

	<SectionHead label="Spheres" t="cool" count={org.spheres.length} />
	<p class="note">Areas of living this works in. A type is not a sphere.</p>
	<SphereTags keys={org.spheres} />

	<SectionHead label="Members" t="cool" count={org.members.length} />
	<ul class="members">
		{#each org.members as m (m.who)}
			<li>
				<span class="mn">{nameOf(m.who)}</span>
				<span class="mr">{m.role}</span>
			</li>
		{/each}
	</ul>

	<SectionHead label="Asset rights" t="warm" count={org.rights.length} />
	<p class="note">What it may hold and claim.</p>
	{#if org.rights.length}
		<ul class="caps">
			{#each org.rights as r (r)}<li>{r}</li>{/each}
		</ul>
	{:else}
		<p class="empty">Holds no asset rights. That is a position, not a gap.</p>
	{/if}

	<SectionHead label="Action stewardship" t="ai" count={org.stewardship.length} />
	<p class="note">What it is answerable for having done — separate from what it owns.</p>
	{#if org.stewardship.length}
		<ul class="caps">
			{#each org.stewardship as a (a)}<li>{a}</li>{/each}
		</ul>
	{:else}
		<p class="empty">Stewards no actions yet.</p>
	{/if}

	<SectionHead label="Standing" />
	<dl class="standing">
		<div>
			<dt>Type</dt>
			<dd>{type.code} · {type.name}</dd>
		</div>
		<div>
			<dt>Identified by</dt>
			<dd>{type.identification}</dd>
		</div>
		{#if parent}
			<div>
				<dt>Controlled by</dt>
				<dd><a href="/organizations/{org.controlledBy}">{parent.name}</a></dd>
			</div>
		{/if}
		{#if org.controls?.length}
			<div>
				<dt>Controls</dt>
				<dd>
					{#each org.controls as c, i (c)}<a href="/organizations/{c}">{ORGS[c]?.name ?? c}</a
						>{#if i < org.controls.length - 1},
						{/if}{/each}
				</dd>
			</div>
		{/if}
	</dl>

	<Note>
		{type.controls
			? 'An individual is the only type that can control, being the only one that is itself an intelligence.'
			: `A ${type.name} does not control on its own. It governs how individuals are tied together and how assets move among them.`}
	</Note>

	<Btn primary={false} href="/organizations" label="Back to organizations" />
</Screen>

<style>
	.head {
		padding: 2px 2px 0;
	}
	.line {
		display: flex;
		align-items: center;
		gap: 9px;
	}
	.persp {
		margin-left: auto;
		font-family: var(--font-mono);
		font-size: 9.5px;
		font-weight: 700;
		letter-spacing: 0.1em;
		color: var(--ink-4);
	}
	.head h1 {
		margin: 7px 0 0;
		font-family: var(--font-serif);
		font-weight: 500;
		font-size: 27px;
		line-height: 1.1;
		color: var(--ink);
	}
	.charter {
		margin: 4px 0 0;
		font-size: 13px;
		line-height: 1.45;
		color: var(--ink-3);
	}
	.res {
		margin: 6px 0 0;
		font-family: var(--font-mono);
		font-size: 10px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--tone-alert);
	}
	.note {
		margin: 0 2px;
		font-size: 12px;
		line-height: 1.45;
		color: var(--ink-3);
	}
	.members,
	.caps {
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
	.members li,
	.caps li {
		display: flex;
		align-items: center;
		gap: 10px;
		min-height: 42px;
		padding: 0 13px;
		background: var(--card);
		font-size: 13.5px;
		color: var(--ink);
	}
	.mr {
		margin-left: auto;
		font-family: var(--font-mono);
		font-size: 9.5px;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		color: var(--ink-3);
	}
	.empty {
		margin: 0;
		padding: 11px 13px;
		border: 1px dashed var(--line-2);
		border-radius: 12px;
		font-size: 12.5px;
		color: var(--ink-3);
	}
	.standing {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin: 0;
		border: 1px solid var(--line-3);
		border-radius: 12px;
		background: var(--card);
		padding: 12px 13px;
	}
	.standing div {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}
	dt {
		font-family: var(--font-mono);
		font-size: 9px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-4);
	}
	dd {
		margin: 0;
		font-size: 13px;
		color: var(--ink);
	}
	dd a {
		color: var(--tone-cool);
	}
</style>
