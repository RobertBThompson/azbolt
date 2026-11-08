<script>
	/**
	 * F2 Capture — Q6 Clarify one thing.
	 * One question, three answers, no form. Asked only when confidence splits
	 * between two records — never as a routine confirmation step.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Appr, Row, Btn } from '$lib/kit';
</script>

<svelte:head><title>Clarify · Chief</title></svelte:head>

<Screen back="/jot" nav={false}>
	<Banner t="ai" title="Which Carmen?" meta="Two people match. Chief will not pick for you." />
	<Appr
		title="Carmen Mendez"
		meta="Azbolt · Operations · you spoke Tuesday"
		confidence="Likely"
		index={1}
		total={2}
	/>
	<Appr
		title="Carmen Ruiz"
		meta="Personal contact"
		confidence="Other"
		index={2}
		total={2}
		included={false}
	/>
	<Row t="ai" title="Neither — someone new" meta="Create a person from this jot" trailing="›" />
	<Btn t="ai" href="/jot/review" label="Continue" />
</Screen>
