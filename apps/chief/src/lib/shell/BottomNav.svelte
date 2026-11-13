<script>
	import { page } from '$app/stores';
	import Icon from '$lib/kit/Icon.svelte';

	/* The columns and offsets place the tabs along the mobile curve. */
	const tabs = [
		{ label: 'Sphere', href: '/sphere', icon: 'globe', column: 1, y: 30 },
		{ label: 'Action', href: '/work', icon: 'action', column: 2, y: 15 },
		{ label: 'People', href: '/people', icon: 'people', column: 4, y: 15 },
		{ label: 'Asset', href: '/records', icon: 'asset', column: 5, y: 30 }
	];
	const shortcuts = [
		{ label: 'Notes', href: '/notes', icon: 'notes' },
		{ label: 'Documents', href: '/documents', icon: 'doc' }
	];

	/** @param {string} href */
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
		<defs>
			<!-- The wave is a fill, not an outline. A stroke across the top
			     drew a hard line into the shoulders where the curve
			     flattens, which is the seam the bar exists to avoid. -->
			<linearGradient id="navwave" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%" stop-color="rgba(255,255,255,0.86)" />
				<stop offset="100%" stop-color="rgba(255,255,255,0.97)" />
			</linearGradient>
		</defs>
		<path
			d="M0 32 C 74 32, 112 4, 195 4 C 278 4, 316 32, 390 32 L390 94 L0 94 Z"
			fill="url(#navwave)"
		/>
	</svg>

	<div class="row">
		<a href="/" class="jot" aria-label="Home" aria-current={active('/') ? 'page' : undefined}>
			<img src="/logo.png" alt="" width="40" height="40" />
			<span class="jot-label">Home</span>
		</a>

		{#each tabs as tab (tab.href)}
			{@const on = active(tab.href)}
			<a
				class="tab"
				href={tab.href}
				style="--column:{tab.column}; --y:{tab.y}px"
				aria-current={on ? 'page' : undefined}
			>
				<span class="glyph" class:on><Icon name={tab.icon} size={19} /></span>
				<span class="label" class:on>{tab.label}</span>
				<span class="rail" class:on aria-hidden="true"></span>
			</a>
		{/each}

		<div class="quick">
			{#each shortcuts as shortcut (shortcut.href)}
				<a
					href={shortcut.href}
					aria-label={shortcut.label}
					aria-current={$page.url.pathname === shortcut.href ? 'page' : undefined}
				>
					<Icon name={shortcut.icon} size={15} />
					<span class="quick-label">{shortcut.label}</span>
				</a>
			{/each}
		</div>
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
		background-color: transparent;
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		/* The SVG stops at the bar's own height; this paints the home
		   indicator strip beneath it in the same wash, so the surface does
		   not end in a line part-way down the gesture area. */
		background-image: linear-gradient(rgba(255, 255, 255, 0.97), rgba(255, 255, 255, 0.97));
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
		grid-template-columns: repeat(2, minmax(0, 1fr)) 108px repeat(2, minmax(0, 1fr));
		align-items: start;
	}
	.tab {
		grid-column: var(--column);
		grid-row: 1;
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
	a:focus-visible {
		outline: 2px solid var(--tone-cool);
		outline-offset: -2px;
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

	/* Two discs under the mark. Dark blue so they read as actions against
	   the tabs' plain glyphs, and small enough that the mark stays the
	   thing your eye lands on. */
	.quick {
		grid-column: 3;
		grid-row: 1;
		justify-self: center;
		margin-top: 48px;
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
		background: linear-gradient(135deg, #3f7cb8, #22517f);
		color: #ffffff;
		box-shadow: 0 6px 14px -4px rgba(34, 81, 127, 0.7);
	}
	.quick a[aria-current='page'] {
		box-shadow:
			0 0 0 2px var(--paper),
			0 0 0 3.5px #26527d;
	}

	/* The mark sits on the crest, overlapping the curve it rises from. */
	.jot {
		grid-column: 3;
		grid-row: 1;
		justify-self: center;
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
			0 0 0 6px rgba(255, 255, 255, 0.92),
			0 2px 4px rgba(40, 28, 80, 0.12),
			0 12px 28px -8px rgba(40, 28, 80, 0.35);
	}
	.jot img {
		display: block;
		width: 40px;
		height: 40px;
	}
	.jot-label,
	.quick-label {
		display: none;
	}

	@media (prefers-reduced-motion: no-preference) {
		.jot {
			transition: box-shadow 140ms ease;
		}
	}

	@media (min-width: 48rem) {
		nav {
			grid-area: primary;
			height: auto;
			max-height: calc(100vh - 32px);
			max-height: calc(100dvh - 32px);
			padding: 8px;
			top: 16px;
			bottom: auto;
			overflow-y: auto;
			border: 1px solid var(--line-2);
			border-radius: 16px;
			background: var(--sunk);
			box-shadow: var(--shadow-sm);
			backdrop-filter: none;
			-webkit-backdrop-filter: none;
		}
		.curve {
			display: none;
		}
		.row {
			display: flex;
			flex-direction: column;
			align-items: stretch;
			height: auto;
			gap: 3px;
		}
		.row a {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			gap: 10px;
			padding: 0 12px;
			width: 100%;
			height: auto;
			min-height: 46px;
			border-radius: 9px;
			color: var(--ink-3);
			font-size: 14px;
			font-weight: 600;
		}
		.row a:hover {
			background: var(--wash-2);
		}
		.label {
			font: inherit;
			color: inherit;
		}
		.rail {
			display: none;
		}
		.row a[aria-current='page'] {
			background: var(--tone-brand-tint);
			color: var(--app-accent-text);
		}
		.row .jot {
			min-height: 50px;
			margin: 0 0 4px;
			box-shadow: none;
		}
		.row .jot[aria-current='page'] {
			background: var(--app-accent-text);
			color: #fff;
		}
		.jot[aria-current='page']:focus-visible {
			outline-color: #fff;
			outline-offset: -4px;
		}
		.jot img {
			width: 28px;
			height: 28px;
			background: var(--card);
			border-radius: 50%;
			padding: 2px;
		}
		.jot-label,
		.quick-label {
			display: block;
		}
		.quick {
			flex-direction: column;
			gap: 3px;
			margin-top: 6px;
			padding-top: 6px;
			border-top: 1px solid var(--line-3);
		}
		.quick a {
			background: transparent;
			box-shadow: none;
		}
		.quick a[aria-current='page'] {
			box-shadow: none;
		}
	}
</style>
