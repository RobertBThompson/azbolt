<script>
	/**
	 * B8 — G14 Export ready.
	 * Repeats scope and retention before download. Exact archive duration
	 * and encryption policy are implementation choices, but both must be
	 * stated here rather than implied.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Row, Btn } from '$lib/kit';
</script>

<svelte:head><title>Export ready · Chief</title></svelte:head>

<Screen back="/settings/account/data/export" nav={false}>
	<Banner title="Your export is ready" meta="Encrypted archive · expiry shown before download." />
	<Row title="Included" meta="Selected branch records and evidence" trailing="›" />
	<Row title="Excluded" meta="Private notes and unselected data" trailing="›" />
	<Row title="Format" meta="JSON, CSV and original documents" trailing="›" />
	<Btn label="Download archive" />
	<Btn primary={false} href="/settings/account/data/export" label="Prepare another export" />
</Screen>
