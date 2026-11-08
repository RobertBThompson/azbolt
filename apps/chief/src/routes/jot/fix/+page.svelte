<script>
	/**
	 * F2 Capture — Q7 Wrong, fix it mid-flow.
	 * The other three approvals are held, not discarded. Correcting one
	 * proposal never re-runs the jot, and the correction becomes a rule offer
	 * rather than a silent learning.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, Field, Appr, Btn, Note } from '$lib/kit';
</script>

<svelte:head><title>Fix a placement · Chief</title></svelte:head>

<Screen back="/jot/review" nav={false}>
	<Alert title="You excluded 1 of 4" meta="“Talk to Carmen” was placed as an Azbolt task." />
	<Field label="What is it instead" placeholder="A personal call, to Carmen Ruiz" />
	<Appr
		title="Re-proposed · Task"
		meta="Personal · linked to Carmen Ruiz"
		confidence="Updated"
		index={1}
		total={1}
	/>
	<Btn t="ai" href="/jot/approved" label="Apply and continue with 4" />
	<Note>Remember this for next time? Offered after approval, never applied before it.</Note>
</Screen>
