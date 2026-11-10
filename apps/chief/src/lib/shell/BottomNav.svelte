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
	 * The mark is home, and home is Jot. It is the centre of the bar
	 * because capture is the thing this app is for, and putting the
	 * brand and the home of the app in the same place costs a slot
	 * nothing.
	 *
	 * Notes and Documents sit under it as two filled discs. They are
	 * reachable from anywhere without spending one of the four tab slots
	 * on either, and they are the only places in the bar drawn as
	 * buttons rather than tabs — they go somewhere specific rather than
	 * switching which branch you are in.
	 *
	 * The labels share one treatment. Sphere used to be Today and carried
	 * mono caps to set it apart, alongside a hairline; with icons on every
	 * tab and a coloured rail under the current one, both were marking
	 * something already marked twice over.
	 */
	import { page } from '$app/stores';
	import Icon from '$lib/kit/Icon.svelte';

	/* Curve y at each icon centre, for a 390-wide viewBox with a 56px
	   centre column. Solved from M0 32 C 74 32, 112 4, 195 4. */
	const left = [
		{ label: 'Sphere', href: '/sphere', icon: 'globe', y: 29 },
		{ label: 'Action', href: '/work', icon: 'action', y: 11 }
	];
	const right = [
		{ label: 'People', href: '/people', icon: 'people', y: 11 },
		{ label: 'Asset', href: '/records', icon: 'asset', y: 29 }
	];

	/**
	 * Sphere owns '/' exactly; the others own their whole subtree.
	 * @param {string} href
	 */
	function active(href) {
		const path = $page.url.pathname;
		if (href === '/') return path === '/';
		// Notes and Documents belong to the Sphere branch without living
		// under its path, so Sphere stays current while they are open.
		if (href === '/sphere') {
			return path.startsWith('/sphere') || path === '/notes' || path === '/documents';
		}
		return path === href || path.startsWith(href + '/');
	}
</script>

<nav aria-label="Primary">
	<svg class="curve" viewBox="0 0 390 94" preserveAspectRatio="none" aria-hidden="true">
		<path
			d="M0 32 C 74 32, 112 4, 195 4 C 278 4, 316 32, 390 32 L390 94 L0 94 Z"
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
			<a href={tab.href} style="--y:{tab.y}px" aria-current={on ? 'page' : undefined}>
				<span class="glyph" class:on><Icon name={tab.icon} size={19} /></span>
				<span class="label" class:on>{tab.label}</span>
				<span class="rail" class:on aria-hidden="true"></span>
			</a>
		{/each}

		<div class="centre">
			<a href="/" class="jot" aria-label="Home" aria-current={active('/') ? 'page' : undefined}>
				<img src="/logo.png" alt="" width="40" height="40" />
				<span class="jot-label">Home</span>
			</a>
			<div class="quick">
				<a
					href="/notes"
					aria-label="Notes"
					aria-current={$page.url.pathname === '/notes' ? 'page' : undefined}
				>
					<Icon name="notes" size={15} />
				</a>
				<a
					href="/documents"
					aria-label="Documents"
					aria-current={$page.url.pathname === '/documents' ? 'page' : undefined}
				>
					<Icon name="doc" size={15} />
				</a>
			</div>
		</div>

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
		/* Sticky rather than fixed: it keeps its place in the flow, so
		   nothing has to reserve space for it and the last row of a long
		   page is never hidden underneath. It simply stops scrolling
		   away. */
		position: sticky;
		bottom: 0;
		z-index: 5;
		height: calc(var(--nav) + env(safe-area-inset-bottom));
		padding-bottom: env(safe-area-inset-bottom);
		/* Translucent so a long page reads through it, with a blur so the
		   labels stay legible over whatever is passing underneath.
		   Backdrop-filter is unevenly supported, hence the opaque-enough
		   base colour underneath it. */
		background-color: color-mix(in srgb, var(--paper) 86%, transparent);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		/* The SVG stops at the bar's own height; this paints the home
		   indicator strip beneath it in the same wash, so the surface does
		   not end in a line part-way down the gesture area. */
		background-image: linear-gradient(var(--wash-2), var(--wash-2));
		background-size: 100% env(safe-area-inset-bottom);
		background-position: bottom;
		background-repeat: no-repeat;
	}
	/* The viewBox is the bar's full height, not the wave's, so the fill
	   reaches the bottom edge under every icon. Keeping the element the
	   same height as the viewBox means preserveAspectRatio="none" only
	   ever stretches horizontally, so the wave never distorts. */
	.curve {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: var(--nav);
		pointer-events: none;
	}
	.row {
		position: relative;
		height: var(--nav);
		display: grid;
		/* Sphere | Action | mark + quick | People | Asset */
		grid-template-columns: repeat(2, 1fr) 108px repeat(2, 1fr);
		align-items: start;
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
		font-size: 11.5px;
		font-weight: 600;
		letter-spacing: 0.005em;
		color: var(--ink-3);
	}
	.label.on {
		color: var(--tone-brand);
	}

	.centre {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	/* Two discs under the mark. Dark blue so they read as actions against
	   the tabs' plain glyphs, and small enough that the mark stays the
	   thing your eye lands on. */
	.quick {
		display: flex;
		/* Wide enough that the two read as a pair flanking the mark
		   rather than a stack under it. */
		gap: 26px;
	}
	.quick a {
		width: 28px;
		height: 28px;
		min-height: 28px;
		min-width: 28px;
		padding: 0;
		border-radius: 50%;
		display: grid;
		place-items: center;
		background: #26527d;
		color: #ffffff;
		box-shadow: 0 1px 3px rgba(30, 26, 24, 0.22);
	}
	.quick a[aria-current='page'] {
		box-shadow:
			0 0 0 2px var(--paper),
			0 0 0 3.5px #26527d;
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
	/* Only the bar shows this label; on a phone the mark is the label. */
	.jot-label {
		display: none;
	}

	@media (prefers-reduced-motion: no-preference) {
		.jot {
			transition: box-shadow 140ms ease;
		}
	}

	/* ── Desktop: a rail, not a bar ──────────────────────────────────── */
	@media (min-width: 900px) {
		nav {
			width: 236px;
			flex: none;
			height: auto;
			padding: 26px 0 0;
			position: sticky;
			top: 0;
			bottom: auto;
			background-image: none;
			background-color: transparent;
			backdrop-filter: none;
			-webkit-backdrop-filter: none;
		}
		/* The wave belongs to an edge of the screen. There is no edge here. */
		.curve {
			display: none;
		}
		.row {
			display: flex;
			flex-direction: column;
			align-items: stretch;
			height: auto;
			gap: 2px;
		}
		a {
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			gap: 13px;
			padding: 0 13px;
			min-height: 46px;
			border-radius: 11px;
		}
		.label {
			font-family: var(--font-sans);
			font-size: 14px;
			font-weight: 600;
			letter-spacing: 0;
			text-transform: none;
		}
		/* A 17px underline under a left-aligned row marks nothing. The
		   whole row carries the state instead. */
		.rail {
			display: none;
		}
		a[aria-current='page'] {
			background: var(--tone-brand-tint);
		}

		/* Capture leads the rail, as it leads the page. */
		.jot {
			order: -1;
			width: 100%;
			height: auto;
			min-height: 50px;
			margin: 0 0 10px;
			padding: 0 13px;
			border-radius: 13px;
			background: var(--tone-brand);
			flex-direction: row;
			justify-content: flex-start;
			gap: 11px;
			box-shadow: 0 2px 6px rgba(159, 62, 73, 0.25);
		}
		.jot img {
			width: 28px;
			height: 28px;
			background: var(--paper);
			border-radius: 50%;
			padding: 2px;
		}
		.jot-label {
			display: block;
			font-size: 14.5px;
			font-weight: 600;
			color: #ffffff;
		}
	}
</style>
