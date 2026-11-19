<script>
	/**
	 * B3 Work — W2 Endeavor.
	 * One record with four tabs, replacing v2's two screens. The outcome
	 * sentence is the headline because it is what the endeavor is for.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Prog, Tabs, Row, Stats } from '$lib/kit';
	import { ENDEAVORS } from '$lib/data.js';
	import { page } from '$app/stores';

	let active = $state(0);
	const e = $derived(ENDEAVORS[$page.params.id ?? '']);
</script>

<svelte:head><title>{e.name} · Chief</title></svelte:head>

<Screen back="/work/endeavors" nav={false}>
	<Banner t="cool" title={e.name} meta={e.outcome} />
	<Prog t="cool" title="Progress" value={e.progress} meta={e.milestones} />
	<Tabs items={['Overview', 'Tasks', 'People', 'Assets']} {active} onpick={(i) => (active = i)} />
	<Row t="cool" title={e.next} meta="Next action · {e.owner}" trailing={e.due} />
	<Stats items={e.stats} />
</Screen>
