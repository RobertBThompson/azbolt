<script>
	/**
	 * F2 Capture — Q11 Adjust placements.
	 * Only the selected proposal changes. The other three stay held with
	 * their original confidence and wording, so a correction never forces
	 * the user to review work they already accepted.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Row, Field, Chips, Btn } from '$lib/kit';
</script>

<svelte:head><title>Adjust placements · Chief</title></svelte:head>

<Screen back="/jot/review" nav={false}>
	<Banner
		t="ai"
		title="3 proposals held"
		meta="Adjust this one; the rest will be waiting when you return."
	/>
	<Row t="ai" title="Selected proposal" meta="Talk to Carmen · Azbolt task" trailing="91%" />
	<Field label="What should change" placeholder="Make this a personal call to Carmen Ruiz" />
	<Chips t="ai" items={['Person', 'Context', 'Time', 'Record type']} active={-1} />
	<Btn t="ai" href="/jot/review" label="Apply correction" />
</Screen>
