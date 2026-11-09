<script>
	/**
	 * v4 nav: Today · Action · [mark] · People · Asset.
	 *
	 * It is not a separate surface. No white fill, no top border — the
	 * bar sits on the page background and a single drawn curve is the
	 * only thing dividing them, so the page appears to rise into it.
	 *
	 * The four icons sit just under that curve and follow it. Their
	 * offsets are the curve's own y at each icon's centre, solved from
	 * the same cubic the SVG draws, so they cannot drift apart from it:
	 * Today and Asset ride the low shoulders, Action and People ride
	 * higher as the wave climbs toward the crest.
	 *
	 * The mark is a capture action, not a tab. It takes you to Throw It
	 * on Today with the field focused, and it never claims aria-current,
	 * because "where am I" and "do the thing" are different questions and
	 * two current items in one bar answers neither.
	 *
	 * Today stands apart from the other three: its own group behind a
	 * hairline, mono caps where the rest are sentence case.
	 */
	import { page } from '$app/stores';
	import Icon from '$lib/kit/Icon.svelte';

	/* Curve y at each icon centre, for a 390-wide viewBox with a 56px
	   centre column. Solved from M0 32 C 74 32, 112 4, 195 4. */
	const left = [
		{ label: 'Today', href: '/', icon: 'today', y: 29 },
		{ label: 'Action', href: '/work', icon: 'action', y: 11 }
	];
	const right = [
		{ label: 'People', href: '/people', icon: 'people', y: 11 },
		{ label: 'Asset', href: '/records', icon: 'asset', y: 29 }
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
		{#each left as tab, i (tab.href)}
			{@const on = active(tab.href)}
			<a
				href={tab.href}
				class:today={i === 0}
				style="--y:{tab.y}px"
				aria-current={on ? 'page' : undefined}
			>
				<span class="glyph" class:on><Icon name={tab.icon} size={19} /></span>
				<span class="label" class:on>{tab.label}</span>
				<span class="rail" class:on aria-hidden="true"></span>
			</a>
			{#if i === 0}<span class="rule" aria-hidden="true"></span>{/if}
		{/each}

		<a href="/?throw" class="jot" aria-label="Throw a jot">
			<img src="/logo.png" alt="" width="40" height="40" />
		</a>

		{#each right as tab (tab.href)}
			{@const on = active(tab.href)}
			<a href={tab.href} style="--y:{tab.y}px" aria-current={on ? 'page' : undefined}>
				<span class="glyph" class:on><Icon name={tab.icon} size={19} /></span>
				<span class="label" class:on>{tab.label}</span>
				<span class="rail" class:on aria-hidden="true"></span>
			</a>
		{/each}
	</div>
</nav>

<style>
	nav {
		flex: none;
		position: relative;
		height: calc(var(--nav) + env(safe-area-inset-bottom));
		padding-bottom: env(safe-area-inset-bottom);
	}
	.curve {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 72px;
		pointer-events: none;
	}
	.row {
		position: relative;
		height: var(--nav);
		display: grid;
		/* Today | rule | Action | mark | People | Asset */
		grid-template-columns: 1fr auto 1fr 56px 1fr 1fr;
		align-items: start;
	}
	.rule {
		justify-self: center;
		width: 1px;
		height: 17px;
		margin-top: 34px;
		background: var(--line);
		opacity: 0.8;
	}
	a {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		min-height: var(--tap-min);
		text-decoration: none;
		/* Just under the curve at this icon's x. */
		padding-top: calc(var(--y, 20px) + 7px);
	}
	.glyph {
		color: var(--ink-3);
	}
	.glyph.on {
		color: var(--tone-brand);
	}
	.rail {
		width: 17px;
		height: 2px;
		border-radius: 2px;
		background: transparent;
	}
	.rail.on {
		background: var(--tone-brand);
	}
	.label {
		font-size: 10.5px;
		font-weight: 600;
		letter-spacing: 0.01em;
		color: var(--ink-3);
	}
	.label.on {
		color: var(--tone-brand);
	}
	.today .label {
		font-family: var(--font-mono);
		font-size: 10px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	/* The mark sits on the crest, overlapping the curve it rises from. */
	.jot {
		padding-top: 0;
		margin-top: -18px;
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: var(--paper);
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
	@media (prefers-reduced-motion: no-preference) {
		.jot {
			transition: box-shadow 140ms ease;
		}
	}
</style>
