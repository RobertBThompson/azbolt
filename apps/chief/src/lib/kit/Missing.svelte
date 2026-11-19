<script>
	/**
	 * What a screen shows when the record its link names is not there.
	 *
	 * The alternative, and what Chief used to do, is to fall back to some
	 * other record of the same kind. That is worse than an error: the
	 * screen looks right, carries someone else's name and figures, and
	 * nothing on it says so. A record that cannot be found says it
	 * plainly and offers the list it came from.
	 */
	import Btn from './Btn.svelte';
	/** @type {{ what: string, back: string, backLabel: string }} */
	let { what, back, backLabel } = $props();
</script>

<div class="missing">
	<p class="t">That {what} is not here</p>
	<p class="m">It may have been removed, or the link may be wrong. Nothing has been changed.</p>
</div>
<Btn primary={false} href={back} label={backLabel} />

<style>
	.missing {
		padding: 18px 16px;
		border: 1.5px dashed rgba(255, 255, 255, 0.7);
		border-radius: var(--r-sm);
		background: rgba(255, 255, 255, 0.12);
		color: var(--on-field);
	}
	.t {
		margin: 0 0 6px;
		font-size: 17px;
		font-weight: 700;
	}
	.m {
		margin: 0;
		font-size: 14.5px;
		line-height: 1.45;
		color: var(--on-field-2, var(--on-field));
	}
</style>
