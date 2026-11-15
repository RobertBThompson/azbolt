<script>
	/**
	 * Says what the sphere in focus has done to a list: how much of it is
	 * shown quieter because it is only related, and how much is out of
	 * view altogether. A list that silently got shorter reads as lost
	 * records; this is the line that says it did not.
	 *
	 * Under All life it says nothing, because nothing has been set back.
	 */
	/** @type {{ quiet?: number, hidden?: number, what?: string }} */
	let { quiet = 0, hidden = 0, what = 'records' } = $props();
	import { shell } from '$lib/state.svelte.js';
	import { sphereOf } from '$lib/spheres.svelte.js';

	const name = $derived(sphereOf(shell.sphere).name);
</script>

{#if shell.sphere !== 'all'}
	<a class="focus" href="/sphere/switch">
		<span class="sw" style="background:{sphereOf(shell.sphere).swatch}"></span>
		<span class="say">
			<strong>Looking through {name}.</strong>
			{#if quiet}{quiet} from related spheres {quiet === 1 ? 'is' : 'are'} set back.{/if}
			{#if hidden}{hidden}
				{hidden === 1 ? `of your ${what} is` : `of your ${what} are`} out of view; All life shows {hidden ===
				1
					? 'it'
					: 'them'}.{/if}
		</span>
		<span class="go" aria-hidden="true">›</span>
	</a>
{/if}

<style>
	.focus {
		display: flex;
		align-items: center;
		gap: 10px;
		min-height: var(--tap-min);
		padding: 9px 14px;
		border: 1.5px dashed rgba(255, 255, 255, 0.75);
		border-radius: var(--r-sm);
		background: rgba(255, 255, 255, 0.14);
		color: var(--on-field);
		font-size: 14.5px;
		line-height: 1.4;
		text-decoration: none;
	}
	.sw {
		flex: none;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		box-shadow:
			inset 0 1px 1px rgba(255, 255, 255, 0.55),
			0 1px 3px rgba(30, 20, 90, 0.35);
	}
	.say {
		flex: 1;
	}
	.go {
		flex: none;
		font-size: 18px;
	}
</style>
