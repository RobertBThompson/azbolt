<script>
	/**
	 * v4 nav: Today · Action · [mark] · People · Asset.
	 *
	 * Three things make this different from the slab it replaces.
	 *
	 * It is not a separate surface. No white fill, no top border — the
	 * bar sits on the page background and a single drawn curve is the
	 * only thing dividing them, so the page appears to rise into it
	 * rather than stop at it.
	 *
	 * The centre slot is the Chief mark, unlabelled, lifted onto the
	 * crest of that curve. Capture is the one action worth a landmark.
	 *
	 * Today stands apart from the other three: it keeps its own group on
	 * the left, behind a hairline, and carries a filled marker where the
	 * rest carry hollow ones. The separation is structural, not coloured —
	 * the palette reserves hue for meaning, and "which tab" is not one.
	 */
	import { page } from '$app/stores';

	const left = [
		{ label: 'Today', href: '/' },
		{ label: 'Action', href: '/work' }
	];
	const right = [
		{ label: 'People', href: '/people' },
		{ label: 'Asset', href: '/records' }
	];

	/**
	 * Today owns '/' exactly; the others own their whole subtree.
	 * @param {string} href
	 */
	function active(href) {
		const path = $page.url.pathname;
		return href === '/' ? path === '/' : path === href || path.startsWith(href + '/');
	}
</script>

<nav aria-label="Primary">
	<!-- The curve. Drawn once, behind everything, so the hairline and the
	     wash share exactly the same path and cannot drift apart. -->
	<svg class="curve" viewBox="0 0 390 72" preserveAspectRatio="none" aria-hidden="true">
		<path
			d="M0 32 C 74 32, 112 4, 195 4 C 278 4, 316 32, 390 32 L390 72 L0 72 Z"
			fill="var(--wash-2)"
		/>
		<path
			d="M0 32 C 74 32, 112 4, 195 4 C 278 4, 316 32, 390 32"
			fill="none"
			stroke="var(--line)"
			stroke-width="1"
			vector-effect="non-scaling-stroke"
		/>
	</svg>

	<div class="row">
		<div class="group">
			{#each left as tab, i (tab.href)}
				{@const on = active(tab.href)}
				<a href={tab.href} class:today={i === 0} aria-current={on ? 'page' : undefined}>
					<span class="mark" class:filled={i === 0} class:on></span>
					<span class="label" class:on>{tab.label}</span>
				</a>
				{#if i === 0}<span class="rule" aria-hidden="true"></span>{/if}
			{/each}
		</div>

		<a href="/jot" class="jot" aria-label="Jot" aria-current={active('/jot') ? 'page' : undefined}>
			<img src="/logo.png" alt="" width="40" height="40" />
		</a>

		<div class="group">
			{#each right as tab (tab.href)}
				{@const on = active(tab.href)}
				<a href={tab.href} aria-current={on ? 'page' : undefined}>
					<span class="mark" class:on></span>
					<span class="label" class:on>{tab.label}</span>
				</a>
			{/each}
		</div>
	</div>
</nav>

<style>
	nav {
		flex: none;
		position: relative;
		height: calc(var(--nav) + env(safe-area-inset-bottom));
		padding-bottom: env(safe-area-inset-bottom);
		/* No background and no border: the page shows through, and the
		   drawn curve is the only edge. */
	}
	.curve {
		position: absolute;
		inset: 0;
		width: 100%;
		height: var(--nav);
		pointer-events: none;
	}
	.row {
		position: relative;
		height: var(--nav);
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: end;
	}
	.group {
		display: flex;
		align-items: flex-end;
		justify-content: space-evenly;
		height: 100%;
		padding: 0 6px 9px;
	}
	.rule {
		width: 1px;
		height: 17px;
		margin-bottom: 13px;
		background: var(--line);
		opacity: 0.8;
	}
	a {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		gap: 5px;
		min-width: 52px;
		min-height: var(--tap-min);
		text-decoration: none;
	}
	/* ink-3, not ink-4: at this size the lighter grey lands at 3.09:1 on
	   paper, under the 4.5 the rest of the system holds to. */
	.mark {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		border: 1.5px solid var(--ink-3);
	}
	.mark.filled {
		background: var(--ink-3);
	}
	.mark.on {
		border-color: var(--ink);
		background: var(--ink);
	}
	.label {
		font-size: 10.5px;
		font-weight: 600;
		letter-spacing: 0.01em;
		color: var(--ink-3);
	}
	.today .label {
		font-family: var(--font-mono);
		font-size: 10px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}
	.label.on {
		color: var(--ink);
	}

	/* The mark sits on the crest, overlapping the curve it rises from. */
	.jot {
		align-self: start;
		margin-top: -18px;
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: var(--paper);
		border: 0;
		align-items: center;
		justify-content: center;
		gap: 0;
		box-shadow:
			0 0 0 6px var(--paper),
			0 2px 3px rgba(30, 26, 24, 0.05),
			0 8px 20px rgba(30, 26, 24, 0.09);
	}
	.jot img {
		display: block;
		width: 40px;
		height: 40px;
	}
	/* Current state is a ring in the mark's own taupe, outside the paper
	   halo so it reads at a glance without a border appearing from nowhere. */
	.jot[aria-current='page'] {
		box-shadow:
			0 0 0 6px var(--paper),
			0 0 0 7.5px var(--brand-taupe),
			0 8px 20px rgba(30, 26, 24, 0.1);
	}

	@media (prefers-reduced-motion: no-preference) {
		.jot {
			transition: box-shadow 140ms ease;
		}
	}
</style>
