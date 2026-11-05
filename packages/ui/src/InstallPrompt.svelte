<script>
	/**
	 * Captures the Android/Chrome beforeinstallprompt event and offers
	 * an explicit install affordance. iOS Safari gives no such event,
	 * so there the component stays hidden — Add to Home Screen is manual.
	 */
	/**
	 * beforeinstallprompt is not in lib.dom, so the event is typed locally.
	 * @typedef {Event & {
	 *   prompt: () => void,
	 *   userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
	 * }} BeforeInstallPromptEvent
	 */

	/** @type {BeforeInstallPromptEvent | null} */
	let deferred = $state(null);
	let dismissed = $state(false);

	$effect(() => {
		/** @param {Event} e */
		const onPrompt = (e) => {
			e.preventDefault();
			deferred = /** @type {BeforeInstallPromptEvent} */ (e);
		};
		const onInstalled = () => {
			deferred = null;
		};
		window.addEventListener('beforeinstallprompt', onPrompt);
		window.addEventListener('appinstalled', onInstalled);
		return () => {
			window.removeEventListener('beforeinstallprompt', onPrompt);
			window.removeEventListener('appinstalled', onInstalled);
		};
	});

	async function install() {
		if (!deferred) return;
		deferred.prompt();
		await deferred.userChoice;
		deferred = null;
	}
</script>

{#if deferred && !dismissed}
	<div class="bar">
		<span>Install this app to your home screen.</span>
		<button class="go" onclick={install}>Install</button>
		<button class="x" onclick={() => (dismissed = true)} aria-label="Dismiss">&times;</button>
	</div>
{/if}

<style>
	.bar {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px 12px;
		border: 1px solid var(--line);
		border-radius: var(--radius-sm);
		background: var(--white);
		font-size: var(--size-body);
	}
	.go {
		margin-left: auto;
		min-height: 32px;
		padding: 0 12px;
		border: 1px solid var(--ink);
		border-radius: var(--radius-sm);
		background: var(--ink);
		color: var(--white);
		font-weight: 700;
		cursor: pointer;
	}
	.x {
		border: 0;
		background: none;
		font-size: 18px;
		line-height: 1;
		color: var(--muted);
		cursor: pointer;
		min-width: 32px;
		min-height: 32px;
	}
</style>
