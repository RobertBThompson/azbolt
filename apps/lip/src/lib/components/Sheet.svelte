<script>
	/**
	 * Bottom sheet. This is where detail goes when a screen runs out of
	 * room — the alternative to shrinking type until everything fits.
	 *
	 * @type {{
	 *   open?: boolean,
	 *   title?: string,
	 *   onclose?: () => void,
	 *   children?: import('svelte').Snippet
	 * }}
	 */
	let { open = false, title = '', onclose, children } = $props();

	/** @param {KeyboardEvent} e */
	function onkeydown(e) {
		if (e.key === 'Escape') onclose?.();
	}
</script>

<svelte:window on:keydown={onkeydown} />

{#if open}
	<div class="scrim" role="presentation" onclick={() => onclose?.()}></div>
	<div class="sheet" role="dialog" aria-modal="true" aria-label={title}>
		<div class="grip" aria-hidden="true"></div>
		<header>
			<h2>{title}</h2>
			<button class="close" onclick={() => onclose?.()}>Done</button>
		</header>
		<div class="body">
			{@render children?.()}
		</div>
	</div>
{/if}

<style>
	.scrim {
		position: fixed;
		inset: 0;
		background: rgba(6, 25, 28, 0.5);
		z-index: 60;
		animation: fade 180ms ease;
	}
	.sheet {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 61;
		max-height: 82dvh;
		display: flex;
		flex-direction: column;
		background: var(--paper);
		border-radius: var(--radius-lg) var(--radius-lg) 0 0;
		box-shadow: 0 -12px 40px rgba(6, 25, 28, 0.32);
		padding-bottom: env(safe-area-inset-bottom);
		animation: rise 240ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	.grip {
		width: 42px;
		height: 5px;
		border-radius: 3px;
		background: var(--line);
		margin: 10px auto 0;
		flex: none;
	}
	header {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 18px 10px;
		flex: none;
	}
	h2 {
		font-size: var(--size-title);
		flex: 1;
	}
	.close {
		border: 0;
		background: none;
		padding: 0 4px;
		font: 700 var(--size-small) var(--font-sans);
		color: var(--teal-500);
	}
	.body {
		flex: 1;
		overflow-y: auto;
		padding: 0 18px 24px;
		-webkit-overflow-scrolling: touch;
	}

	@keyframes rise {
		from {
			transform: translateY(14%);
			opacity: 0;
		}
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
	}
</style>
