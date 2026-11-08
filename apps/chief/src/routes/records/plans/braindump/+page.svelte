<script>
	/**
	 * B7 Business Plan — P2 Braindump.
	 * This is Capture's surface, reused verbatim. Business Plan owning its
	 * own recorder would be the first crack in the branch boundary.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Wave, Banner, Btn, Note } from '$lib/kit';
</script>

<svelte:head><title>Braindump · Chief</title></svelte:head>

<Screen back="/records/plans" nav={false}>
	<Wave
		text="We sell workflow software to small logistics firms. Carmen runs ops. The biggest blocker is onboarding time..."
	/>
	<Banner t="ai" title="84 seconds" meta="Keep going, or stop whenever you like." />
	<Btn t="ai" href="/records/plans/coverage" label="Done" />
	<Note>Nothing is written to the plan yet. This is a recording, not an answer.</Note>
</Screen>
