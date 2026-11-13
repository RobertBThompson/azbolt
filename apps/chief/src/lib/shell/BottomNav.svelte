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
	<!-- Light rising behind the bar: one cool ribbon from the left, one
	     warm from the right, crossing under the mark. Filled and soft,
	     never stroked — there is no line anywhere on this bar. -->
	<svg class="aurora" viewBox="0 0 390 106" preserveAspectRatio="none" aria-hidden="true">
		<defs>
			<linearGradient id="aurora-cool" x1="0" y1="0" x2="1" y2="0.4">
				<stop offset="0" stop-color="#c9d4ff" stop-opacity="0.55" />
				<stop offset="0.6" stop-color="#d9ccff" stop-opacity="0.22" />
				<stop offset="1" stop-color="#ffffff" stop-opacity="0" />
			</linearGradient>
			<linearGradient id="aurora-warm" x1="1" y1="0" x2="0" y2="0.4">
				<stop offset="0" stop-color="#ffc9a6" stop-opacity="0.6" />
				<stop offset="0.55" stop-color="#f7b4d6" stop-opacity="0.26" />
				<stop offset="1" stop-color="#ffffff" stop-opacity="0" />
			</linearGradient>
			<linearGradient id="aurora-veil" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stop-color="#ffffff" stop-opacity="0.2" />
				<stop offset="1" stop-color="#ffffff" stop-opacity="0.05" />
			</linearGradient>
		</defs>
		<path fill="url(#aurora-veil)" d="M0 74 C 60 46, 120 96, 195 78 S 330 38, 390 60 V130 H0 Z" />
		<path fill="url(#aurora-cool)" d="M0 42 C 44 26, 84 62, 132 82 S 204 80, 250 70 V130 H0 Z" />
		<path
			fill="url(#aurora-warm)"
			d="M390 30 C 352 24, 318 70, 268 84 S 196 82, 150 72 V130 H390 Z"
		/>
	</svg>

	<!-- The blur is cut to the wave. Left as a rectangle it drew its own
	     top edge straight across the shoulders, where the curve is lower
	     than the box: the line on each side of the bar. -->
	<svg class="defs" width="0" height="0" aria-hidden="true">
		<clipPath id="navclip" clipPathUnits="objectBoundingBox">
			<path
				d="M0 0.3333 C 0.1897 0.3333, 0.2872 0.0417, 0.5 0.0417 C 0.7128 0.0417, 0.8103 0.3333, 1 0.3333 V1 H0 Z"
			/>
		</clipPath>
	</svg>
	<div class="frost"></div>

	<svg class="curve" viewBox="0 0 390 96" preserveAspectRatio="none" aria-hidden="true">
		<defs>
			<!-- The wave is a fill, not an outline. -->
			<linearGradient id="navwave" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stop-color="#ffffff" stop-opacity="0.8" />
				<stop offset="0.5" stop-color="#ffffff" stop-opacity="0.93" />
				<stop offset="1" stop-color="#f6f3ff" stop-opacity="0.98" />
			</linearGradient>
			<!-- Brightest on the crest, where the mark sits. -->
			<radialGradient id="navsheen" cx="0.5" cy="0.04" r="0.5" fx="0.5" fy="0.04">
				<stop offset="0" stop-color="#ffffff" stop-opacity="0.95" />
				<stop offset="1" stop-color="#ffffff" stop-opacity="0" />
			</radialGradient>
		</defs>
		<path d="M0 32 C 74 32, 112 4, 195 4 C 278 4, 316 32, 390 32 V96 H0 Z" fill="url(#navwave)" />
		<path d="M0 32 C 74 32, 112 4, 195 4 C 278 4, 316 32, 390 32 V96 H0 Z" fill="url(#navsheen)" />
	</svg>

	<div class="row">
		<a href="/" class="jot" aria-label="Home" aria-current={active('/') ? 'page' : undefined}>
			<img src="/logo.png" alt="" width="42" height="42" />
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
				<span class="glyph" class:on><Icon name={tab.icon} size={21} /></span>
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
					<Icon name={shortcut.icon} size={16} />
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
		/* The SVG stops at the bar's own height; this paints the home
		   indicator strip beneath it in the same wash, so the surface does
		   not end in a line part-way down the gesture area. */
		background-color: transparent;
		background-image: linear-gradient(#f6f3ff, #f6f3ff);
		background-size: 100% env(safe-area-inset-bottom);
		background-position: bottom;
		background-repeat: no-repeat;
	}
	.defs {
		position: absolute;
	}
	.aurora {
		position: absolute;
		left: 0;
		bottom: env(safe-area-inset-bottom);
		width: 100%;
		height: 122px;
		pointer-events: none;
		opacity: 0.8;
	}
	.frost {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: var(--nav);
		clip-path: url(#navclip);
		backdrop-filter: blur(16px) saturate(1.4);
		-webkit-backdrop-filter: blur(16px) saturate(1.4);
		pointer-events: none;
	}
	/* The viewBox is the bar's full height, not the wave's, so the fill
	   reaches the bottom edge under every icon. Keeping the element the
	   same height as the viewBox means preserveAspectRatio="none" only
	   ever stretches horizontally, so the wave never distorts.

	   The shadow is cast upward: the bar floats over the page, and this
	   is the page falling into shade as it passes under the crest. */
	.curve {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: var(--nav);
		pointer-events: none;
		filter: drop-shadow(0 -7px 14px rgba(36, 24, 110, 0.26));
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
		gap: 2px;
		min-height: var(--tap-min);
		text-decoration: none;
		/* Just under the curve at this icon's x. */
		padding-top: calc(var(--y, 20px) + 7px);
	}
	a:focus-visible {
		outline: 2px solid var(--tone-cool);
		outline-offset: -2px;
		border-radius: var(--r-xs);
	}
	.glyph {
		display: grid;
		color: var(--ink-3);
	}
	.glyph.on {
		color: var(--tone-brand);
		filter: drop-shadow(0 3px 5px color-mix(in srgb, var(--tone-brand) 45%, transparent));
	}
	.rail {
		width: 18px;
		height: 3px;
		border-radius: 3px;
		background: transparent;
	}
	.rail.on {
		background: var(--tone-brand);
		box-shadow: 0 2px 6px color-mix(in srgb, var(--tone-brand) 60%, transparent);
	}
	.label {
		font-family: var(--font-display);
		font-size: 13.5px;
		font-weight: 600;
		line-height: 1.25;
		letter-spacing: 0.01em;
		color: var(--ink-2);
	}
	.label.on {
		font-weight: 700;
		color: var(--tone-brand);
	}

	/* Two beads under the mark. Blue so they read as actions against the
	   tabs' plain glyphs, and small enough that the mark stays the thing
	   your eye lands on. Lit from the top left like everything else. */
	.quick {
		grid-column: 3;
		grid-row: 1;
		justify-self: center;
		margin-top: 50px;
		display: flex;
		/* Wide enough that the two read as a pair flanking the mark
		   rather than a stack under it. */
		gap: 26px;
	}
	.quick a {
		width: 31px;
		height: 31px;
		min-height: 31px;
		min-width: 31px;
		padding: 0;
		border-radius: 50%;
		display: grid;
		place-items: center;
		background: radial-gradient(circle at 34% 22%, #9cc8f5 0%, #4585c4 38%, #1d4877 100%);
		color: #ffffff;
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.65),
			inset 0 -5px 8px -5px rgba(8, 26, 60, 0.7),
			0 0 0 2px rgba(255, 255, 255, 0.8),
			0 7px 14px -4px rgba(29, 72, 119, 0.9),
			0 0 14px rgba(96, 156, 236, 0.5);
	}
	.quick a[aria-current='page'] {
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.65),
			0 0 0 2px #ffffff,
			0 0 0 4px #26527d,
			0 7px 14px -4px rgba(29, 72, 119, 0.9);
	}

	/* The mark sits on the crest, overlapping the curve it rises from:
	   a glass orb, with a halo so it reads as lifted off the bar. */
	.jot {
		grid-column: 3;
		grid-row: 1;
		justify-self: center;
		padding-top: 0;
		margin-top: -20px;
		width: 60px;
		height: 60px;
		border-radius: 50%;
		background: radial-gradient(circle at 34% 20%, #ffffff 0%, #f8f6ff 52%, #dad2f6 100%);
		align-items: center;
		justify-content: center;
		gap: 0;
		box-shadow:
			inset 0 1px 0 #ffffff,
			inset 0 -9px 13px -9px rgba(86, 66, 170, 0.55),
			0 0 0 5px rgba(255, 255, 255, 0.6),
			0 0 26px rgba(204, 188, 255, 0.85),
			0 12px 26px -8px rgba(30, 20, 100, 0.6);
	}
	.jot img {
		display: block;
		width: 42px;
		height: 42px;
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
			padding: 9px;
			top: 16px;
			bottom: auto;
			overflow-y: auto;
			border: 1px solid var(--glass-line);
			border-radius: var(--r-md);
			background: var(--glass);
			box-shadow: var(--glass-shadow);
		}
		.curve,
		.frost,
		.aurora {
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
			gap: 11px;
			padding: 0 13px;
			width: 100%;
			height: auto;
			min-height: 48px;
			border-radius: var(--r-sm);
			background: transparent;
			box-shadow: none;
			color: var(--ink-2);
			font-size: 16px;
			font-weight: 600;
		}
		.row a:hover {
			background: var(--wash-2);
		}
		.glyph,
		.glyph.on {
			color: inherit;
			filter: none;
		}
		.label,
		.label.on {
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
			min-height: 52px;
			margin: 0 0 4px;
		}
		.row .jot[aria-current='page'] {
			background: var(--gloss), linear-gradient(118deg, var(--tone-brand), #7a2f5c);
			color: #fff;
			box-shadow: 0 8px 18px -8px color-mix(in srgb, var(--tone-brand) 80%, transparent);
		}
		.jot[aria-current='page']:focus-visible {
			outline-color: #fff;
			outline-offset: -4px;
		}
		.jot img {
			width: 30px;
			height: 30px;
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
		.quick a[aria-current='page'] {
			box-shadow: none;
		}
	}
</style>
