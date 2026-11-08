<script>
	/**
	 * A placement proposal. Q4 is the screen most at risk for screen
	 * readers: traversed naively a VoiceOver user hears "checkbox, checked"
	 * four times with no idea what approving does. So each proposal is ONE
	 * accessibility element with a composed label, and the confidence tag
	 * is a non-interactive label — the whole 45pt row carries the action.
	 * Confidence is never colour-only; it is a number or a word.
	 */
	/** @type {{ title: string, meta?: string, confidence?: string, index?: number, total?: number, included?: boolean, t?: string }} */
	let {
		title,
		meta = '',
		confidence = '',
		index = 1,
		total = 1,
		included = $bindable(true),
		t = 'ai'
	} = $props();
	import { tone } from './tone.js';
	const c = $derived(tone(t));
	const label = $derived(
		`Proposal ${index} of ${total}. ${title}. ${meta}. ` +
			(confidence ? `Confidence ${confidence}. ` : '') +
			(included ? 'Included. Double-tap to exclude.' : 'Excluded. Double-tap to include.')
	);
</script>

<button
	class="appr"
	style="--t-ink:{c.ink}; --t-tint:{c.tint}"
	aria-label={label}
	aria-pressed={included}
	onclick={() => (included = !included)}
>
	<span class="box" class:on={included} aria-hidden="true"></span>
	<span class="body" aria-hidden="true">
		<span class="t">{title}</span>
		{#if meta}<span class="m">{meta}</span>{/if}
	</span>
	{#if confidence}<span class="c" aria-hidden="true">{confidence}</span>{/if}
</button>

<style>
	.appr {
		width: 100%;
		min-height: var(--tap-min);
		border: 1px solid color-mix(in srgb, var(--t-ink) 35%, transparent);
		border-radius: 11px;
		background: var(--card);
		padding: 9px 11px;
		display: flex;
		gap: 10px;
		align-items: flex-start;
		text-align: left;
		font-family: inherit;
	}
	.box {
		width: 19px;
		height: 19px;
		border-radius: 6px;
		border: 1.5px solid var(--t-ink);
		background: transparent;
		flex: none;
		margin-top: 1px;
	}
	.box.on {
		background: var(--t-tint);
	}
	.body {
		flex: 1;
		min-width: 0;
	}
	.t {
		display: block;
		font-size: 14px;
		font-weight: 600;
		line-height: 1.25;
	}
	.m {
		display: block;
		font-size: 12px;
		color: var(--ink-3);
		line-height: 1.3;
		margin-top: 2px;
	}
	.c {
		flex: none;
		font-family: var(--font-mono);
		font-size: 11px;
		font-weight: 700;
		color: var(--t-ink);
		background: var(--t-tint);
		border-radius: 11px;
		padding: 4px 9px;
	}
</style>
