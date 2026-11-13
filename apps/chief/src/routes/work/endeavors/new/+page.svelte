<script>
	/**
	 * B3 Work — W3 New endeavor.
	 * Three inputs. The second is phrased as a question about the future
	 * because "description" produces a title restated. Dates, people and
	 * assets are deliberately absent: an endeavor that exists and is vague
	 * beats one never created because it asked nine questions.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Field, Chips, Btn } from '$lib/kit';
</script>

<svelte:head><title>New endeavor · Chief</title></svelte:head>

<Screen back="/work/endeavors" nav={false}>
	<Banner
		t="cool"
		title="Start with the outcome"
		meta="Everything else can be added once it exists."
	/>
	<Field label="Name" placeholder="Short working title" />
	<Field label="What will be true when this succeeds" placeholder="One sentence" />
	<Chips t="cool" items={['Now', 'Next', 'Someday']} />
	<Btn t="cool" label="Create endeavor" soon />
</Screen>
