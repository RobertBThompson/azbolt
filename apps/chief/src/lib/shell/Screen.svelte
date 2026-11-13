<script>
	import SphereBar from './SphereBar.svelte';
	import BottomNav from './BottomNav.svelte';

	/**
	 * `horizon` draws the sunrise and its ridge behind the masthead. Home
	 * asks for it; every other screen gets the same field with only the
	 * glow, so the one place you land each morning is the one that looks
	 * like a morning.
	 * @type {{ search?: boolean, back?: string|null, nav?: boolean, horizon?: boolean, children: import('svelte').Snippet }}
	 */
	let { search = false, back = null, nav = true, horizon = false, children } = $props();
</script>

<div class="screen" class:railed={nav}>
	<div class="field" class:horizon aria-hidden="true">
		<div class="sun"></div>
		{#if horizon}
			<!-- Three ridges, nearest darkest, each fading to nothing at its
			     foot so it melts into the field. The same warm light is laid
			     over the far two, centred on the sun, which is what makes
			     them look lit rather than coloured in. -->
			<svg class="ridge" viewBox="0 0 390 160" preserveAspectRatio="xMaxYMin slice">
				<defs>
					<linearGradient id="ridge-far" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stop-color="#8fb3e0" stop-opacity="0.78" />
						<stop offset="0.6" stop-color="#6699ce" stop-opacity="0.34" />
						<stop offset="1" stop-color="#6c3a5e" stop-opacity="0" />
					</linearGradient>
					<linearGradient id="ridge-mid" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stop-color="#b04a62" stop-opacity="0.92" />
						<stop offset="0.62" stop-color="#7a2c44" stop-opacity="0.45" />
						<stop offset="1" stop-color="#7a2c44" stop-opacity="0" />
					</linearGradient>
					<linearGradient id="ridge-near" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stop-color="#1a2036" stop-opacity="0.95" />
						<stop offset="0.7" stop-color="#232a46" stop-opacity="0.4" />
						<stop offset="1" stop-color="#4a3563" stop-opacity="0" />
					</linearGradient>
					<radialGradient id="ridge-lit" gradientUnits="userSpaceOnUse" cx="296" cy="74" r="170">
						<stop offset="0" stop-color="#ffe2b8" stop-opacity="0.95" />
						<stop offset="0.3" stop-color="#f5b35a" stop-opacity="0.6" />
						<stop offset="0.65" stop-color="#c45a6c" stop-opacity="0.22" />
						<stop offset="1" stop-color="#c45a6c" stop-opacity="0" />
					</radialGradient>
					<linearGradient id="ridge-foot" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0.55" stop-color="#ffffff" />
						<stop offset="1" stop-color="#000000" />
					</linearGradient>
					<mask id="ridge-fade">
						<rect x="-12" y="0" width="414" height="160" fill="url(#ridge-foot)" />
					</mask>
				</defs>
				<g mask="url(#ridge-fade)">
					<path
						fill="url(#ridge-far)"
						d="M-12 160 V103 L96 100 L105.6 102.9 L114.4 107.8 L123.0 108.2 L134.7 110.4 L139.3 108.8 L144.0 111.6 L149.6 109.8 L162.6 108.5 L168.2 98.9 L177.1 95.2 L191.0 94.9 L210.8 92.1 L217.1 85.2 L220.9 84.7 L232.9 84.9 L240.2 87.8 L250.1 90.0 L255.6 86.8 L261.3 90.6 L269.0 92.4 L272.5 92.1 L275.5 95.3 L282.8 94.2 L286.1 90.9 L301.5 85.8 L308.8 85.6 L314.7 87.0 L323.4 82.7 L334.2 77.6 L349.1 74.2 L365.8 69.3 L390 60 L402 60 V160 Z"
					/>
					<path
						fill="url(#ridge-lit)"
						d="M-12 160 V103 L96 100 L105.6 102.9 L114.4 107.8 L123.0 108.2 L134.7 110.4 L139.3 108.8 L144.0 111.6 L149.6 109.8 L162.6 108.5 L168.2 98.9 L177.1 95.2 L191.0 94.9 L210.8 92.1 L217.1 85.2 L220.9 84.7 L232.9 84.9 L240.2 87.8 L250.1 90.0 L255.6 86.8 L261.3 90.6 L269.0 92.4 L272.5 92.1 L275.5 95.3 L282.8 94.2 L286.1 90.9 L301.5 85.8 L308.8 85.6 L314.7 87.0 L323.4 82.7 L334.2 77.6 L349.1 74.2 L365.8 69.3 L390 60 L402 60 V160 Z"
					/>
					<path
						fill="none"
						stroke="url(#ridge-lit)"
						stroke-width="1.1"
						stroke-linejoin="round"
						d="M-12 103 L96 100 L105.6 102.9 L114.4 107.8 L123.0 108.2 L134.7 110.4 L139.3 108.8 L144.0 111.6 L149.6 109.8 L162.6 108.5 L168.2 98.9 L177.1 95.2 L191.0 94.9 L210.8 92.1 L217.1 85.2 L220.9 84.7 L232.9 84.9 L240.2 87.8 L250.1 90.0 L255.6 86.8 L261.3 90.6 L269.0 92.4 L272.5 92.1 L275.5 95.3 L282.8 94.2 L286.1 90.9 L301.5 85.8 L308.8 85.6 L314.7 87.0 L323.4 82.7 L334.2 77.6 L349.1 74.2 L365.8 69.3 L390 60 L402 60"
					/>
					<path
						fill="url(#ridge-mid)"
						d="M-12 160 V125 L30 122 L39.8 117.4 L54.2 115.7 L61.1 117.2 L70.9 115.6 L74.1 117.6 L79.3 115.7 L87.6 117.0 L92.1 122.9 L105.4 122.7 L121.6 122.6 L130.6 118.2 L150.8 114.5 L170.0 110.8 L179.7 111.0 L193.2 104.8 L204.7 102.4 L208.9 104.7 L212.7 102.9 L216.4 98.4 L222.4 98.9 L226.8 98.2 L235.5 97.2 L243.2 96.1 L260.7 99.3 L282.1 101.9 L303.6 100.1 L318.7 98.0 L335.9 96.9 L350.0 92.7 L361.3 92.7 L376.5 92.7 L390 96 L402 96 V160 Z"
					/>
					<path
						fill="url(#ridge-lit)"
						opacity="0.55"
						d="M-12 160 V125 L30 122 L39.8 117.4 L54.2 115.7 L61.1 117.2 L70.9 115.6 L74.1 117.6 L79.3 115.7 L87.6 117.0 L92.1 122.9 L105.4 122.7 L121.6 122.6 L130.6 118.2 L150.8 114.5 L170.0 110.8 L179.7 111.0 L193.2 104.8 L204.7 102.4 L208.9 104.7 L212.7 102.9 L216.4 98.4 L222.4 98.9 L226.8 98.2 L235.5 97.2 L243.2 96.1 L260.7 99.3 L282.1 101.9 L303.6 100.1 L318.7 98.0 L335.9 96.9 L350.0 92.7 L361.3 92.7 L376.5 92.7 L390 96 L402 96 V160 Z"
					/>
					<path
						fill="none"
						stroke="url(#ridge-lit)"
						stroke-width="0.8"
						stroke-linejoin="round"
						opacity="0.7"
						d="M-12 125 L30 122 L39.8 117.4 L54.2 115.7 L61.1 117.2 L70.9 115.6 L74.1 117.6 L79.3 115.7 L87.6 117.0 L92.1 122.9 L105.4 122.7 L121.6 122.6 L130.6 118.2 L150.8 114.5 L170.0 110.8 L179.7 111.0 L193.2 104.8 L204.7 102.4 L208.9 104.7 L212.7 102.9 L216.4 98.4 L222.4 98.9 L226.8 98.2 L235.5 97.2 L243.2 96.1 L260.7 99.3 L282.1 101.9 L303.6 100.1 L318.7 98.0 L335.9 96.9 L350.0 92.7 L361.3 92.7 L376.5 92.7 L390 96 L402 96"
					/>
					<path
						fill="url(#ridge-near)"
						d="M-12 160 V143 L0 140 L6.1 141.6 L18.5 141.4 L40.4 141.3 L50.1 140.0 L63.8 141.2 L73.1 140.6 L80.7 139.2 L95.7 138.0 L102.2 137.1 L115.2 134.8 L132.1 133.0 L148.0 133.2 L163.0 132.8 L179.4 131.0 L211.8 127.6 L241.7 126.1 L250.6 124.7 L254.8 125.6 L262.8 128.0 L267.3 127.9 L273.1 127.0 L277.0 123.8 L285.2 123.0 L293.0 123.7 L298.6 125.2 L304.5 125.5 L315.8 125.8 L323.2 126.7 L344.7 124.8 L354.9 125.3 L372.4 122.5 L390 122 L402 122 V160 Z"
					/>
				</g>
			</svg>
		{/if}
	</div>
	<SphereBar {search} {back} />
	<div class="body">
		<main>{@render children()}</main>
		{#if nav}<BottomNav />{/if}
	</div>
</div>

<style>
	.screen {
		--shell-gutter: clamp(15px, calc(5vw - 9px), 28px);
		position: relative;
		isolation: isolate;
		color: var(--ink);
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		min-height: 100dvh;
	}
	/* The field is its own fixed layer rather than a fixed-attachment
	   background on the screen. Phones repaint a fixed background on
	   every scroll frame, and some ignore it and let the gradient scroll
	   away with the page; a fixed element does neither. */
	.field {
		position: fixed;
		inset: 0;
		z-index: -1;
		overflow: hidden;
		pointer-events: none;
		background:
			radial-gradient(90% 240px at 0% 0%, rgba(102, 153, 206, 0.32), transparent 70%),
			linear-gradient(
				180deg,
				var(--field-1) 0%,
				var(--field-2) 22%,
				var(--field-3) 55%,
				var(--field-4) 100%
			);
	}
	/* Away from Home the sun is only its glow, off the top corner. */
	.sun {
		position: absolute;
		top: -200px;
		right: -160px;
		width: 480px;
		height: 480px;
		border-radius: 50%;
		background: radial-gradient(
			circle,
			rgba(255, 196, 120, 0.42) 0%,
			rgba(196, 90, 108, 0.26) 32%,
			rgba(159, 62, 73, 0.12) 54%,
			transparent 70%
		);
	}
	/* On Home it comes down to the skyline and gets a core. */
	.horizon .sun {
		top: -24px;
		right: -96px;
		width: 380px;
		height: 380px;
		background: radial-gradient(
			circle,
			var(--sun-core) 0%,
			#ffe2a8 3%,
			rgba(248, 190, 100, 0.88) 7.5%,
			rgba(242, 150, 90, 0.5) 19%,
			rgba(196, 90, 108, 0.26) 38%,
			rgba(159, 62, 73, 0.1) 55%,
			transparent 70%
		);
	}
	.ridge {
		position: absolute;
		top: 88px;
		right: 0;
		width: min(100%, 620px);
		height: 160px;
		/* Fades out toward the greeting, so the type never sits on rock. */
		-webkit-mask-image: linear-gradient(90deg, transparent 6%, #000 52%);
		mask-image: linear-gradient(90deg, transparent 6%, #000 52%);
	}
	.body {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
	}
	main {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 11px;
		/* The mark is lifted 18px above the nav, so content needs more
		   clearance at the bottom than a flat bar would have asked for. */
		padding: 20px var(--shell-gutter) 30px;
		overflow-x: hidden;
	}

	@media (min-width: 48rem) {
		.screen {
			--shell-width: 74rem;
			--shell-gutter: clamp(20px, 3vw, 36px);
		}
		.body {
			width: 100%;
			max-width: var(--shell-width);
			margin-inline: auto;
			padding: 24px var(--shell-gutter) 40px;
		}
		.railed .body {
			display: grid;
			grid-template-areas: 'primary content';
			grid-template-columns: clamp(10rem, 18vw, 13rem) minmax(0, 1fr);
			align-items: start;
			gap: clamp(20px, 2.75vw, 36px);
		}
		main {
			padding: 0;
			overflow: visible;
		}
		.railed main {
			grid-area: content;
		}
		.screen:not(.railed) main {
			width: 100%;
			max-width: 44rem;
			margin-inline: auto;
		}
	}
</style>
