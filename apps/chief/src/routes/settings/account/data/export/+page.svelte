<script>
	/**
	 * B8 — G13 Review export.
	 * Explicit about scope and omissions. Selection happens by branch so a
	 * user can take a complete archive or a smaller, understandable subset
	 * without exposing private notes by accident.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Appr, Chips, Btn } from '$lib/kit';

	let records = $state(true);
	let evidence = $state(true);
	let notes = $state(false);
</script>

<svelte:head><title>Review export · Chief</title></svelte:head>

<Screen back="/settings/account/data" nav={false}>
	<Banner title="Choose what leaves Chief" meta="Nothing is changed or removed by an export." />
	<Appr
		t="neutral"
		bind:included={records}
		title="Records"
		meta="People, work, assets, money and plans"
		confidence="Included"
		index={1}
		total={3}
	/>
	<Appr
		t="neutral"
		bind:included={evidence}
		title="Evidence files"
		meta="Original uploads and audit metadata"
		confidence="Included"
		index={2}
		total={3}
	/>
	<Appr
		t="neutral"
		bind:included={notes}
		title="Private notes"
		meta="Excluded by default"
		confidence="Off"
		index={3}
		total={3}
	/>
	<Chips items={['JSON', 'CSV', 'Documents']} />
	<Btn href="/settings/account/data/export/ready" label="Prepare export" />
</Screen>
