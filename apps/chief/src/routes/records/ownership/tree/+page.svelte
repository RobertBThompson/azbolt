<script>
	/**
	 * Ownership — the tree.
	 *
	 * The same links as the list, drawn as owner to owned. It is worked
	 * out from the links rather than kept as a picture of its own, so it
	 * cannot show a structure the records do not hold.
	 *
	 * Indentation carries the depth and a rule down the left carries the
	 * line of descent. Anything that never reaches an organization is
	 * listed underneath, on its own, because that is exactly what a tree
	 * would otherwise hide.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { PageHead, Alert, Btn, TypeBadge } from '$lib/kit';
	import { ORGS, PEOPLE } from '$lib/data.js';
	import { money, nodeHref, nodeName, ownershipTree, sharePercent } from '$lib/assets.js';

	const { rows, loose } = ownershipTree();

	/**
	 * What sits above a root. Every chain of organizations ends at
	 * individuals, since an individual is the only type that controls —
	 * so where the members who own it are known, the root names them.
	 * @param {string} org
	 */
	function above(org) {
		const owners = (ORGS[org]?.members ?? [])
			.filter((m) => m.role === 'owner')
			.map((m) => (m.who === 'me' ? 'You' : (PEOPLE[m.who]?.name ?? m.who)));
		return owners.length ? `Owned by ${owners.join(' and ')}` : 'Nothing above it';
	}
</script>

<svelte:head><title>Ownership tree · Chief</title></svelte:head>

<Screen back="/records/ownership" nav={false}>
	<PageHead eyebrow="Ownership" title="Owner to owned" meta="Tap anything to open its link." />

	<ul class="tree">
		{#each rows as r, i (i)}
			<li style="--d:{r.depth}" class:root={r.depth === 0}>
				<a href={r.link ? `/records/ownership/${r.link.id}` : nodeHref(r.node)}>
					<span class="nm">
						{#if r.node.cls === 'organization'}
							<TypeBadge code={ORGS[r.node.id]?.code ?? 'CO'} showName={false} />
						{:else}
							<span class="dot" aria-hidden="true"></span>
						{/if}
						{nodeName(r.node)}
					</span>
					{#if r.link}
						<span class="tm">
							{r.link.role}{sharePercent(r.link) !== null ? ` · ${sharePercent(r.link)}%` : ''}{r
								.link.currentValue !== null
								? ` · ${money(r.link.currentValue)}`
								: ''}
						</span>
					{:else}
						<span class="tm">{above(r.node.id)}</span>
					{/if}
				</a>
			</li>
		{/each}
	</ul>

	{#if loose.length}
		<Alert
			title="Not on the tree"
			meta="{loose.map((a) => a.name).join(', ')} — no chain to an organization yet."
		/>
	{/if}

	<Btn primary={false} href="/records/ownership" label="Switch to list" />
</Screen>

<style>
	.tree {
		list-style: none;
		margin: 0;
		padding: 0;
		border: 1px solid var(--glass-line);
		border-radius: var(--r-md);
		background: var(--line-3);
		box-shadow: var(--glass-shadow);
		display: flex;
		flex-direction: column;
		gap: 1px;
		overflow: hidden;
	}
	li {
		background: var(--card);
	}
	li.root {
		background: linear-gradient(96deg, var(--tone-clay-tint) 0%, #ffffff 70%);
	}
	a {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-height: 54px;
		justify-content: center;
		/* Depth is drawn, not stored as padding on the text, so each
		   level's rule stays in line with its own parent. */
		padding: 9px 16px 9px calc(16px + var(--d) * 22px);
		text-decoration: none;
	}
	/* The line of descent. */
	li:not(.root) a::before {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: calc(16px + (var(--d) - 1) * 22px + 6px);
		width: 2px;
		border-radius: 2px;
		background: var(--line);
	}
	.nm {
		display: flex;
		align-items: center;
		gap: 9px;
		font-size: 16.5px;
		font-weight: 600;
		color: var(--ink);
	}
	li.root .nm {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 17.5px;
	}
	.dot {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: radial-gradient(
			circle at 34% 26%,
			color-mix(in srgb, var(--tone-clay) 45%, #ffffff) 0%,
			var(--tone-clay) 60%
		);
		flex: none;
	}
	.tm {
		font-size: 14px;
		color: var(--ink-3);
	}
	a:focus-visible {
		outline: 2px solid var(--tone-cool);
		outline-offset: -3px;
	}
</style>
