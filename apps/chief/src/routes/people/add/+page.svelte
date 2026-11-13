<script>
	/**
	 * F1 Directory — D2 Add people.
	 * Contacts permission is requested on this tap, with the reason on screen
	 * — not at launch, and not as a wall. Chief never imports a whole address
	 * book.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Tabs, Banner, Appr, Btn } from '$lib/kit';

	let active = $state(0);
	let carmen = $state(true);
	let daniel = $state(true);
	const count = $derived([carmen, daniel].filter(Boolean).length);
</script>

<svelte:head><title>Add people · Chief</title></svelte:head>

<Screen back="/people" nav={false}>
	<Tabs items={['From contacts', 'Manually']} {active} onpick={(i) => (active = i)} />
	<Banner t="cool" title="Choose who comes in" meta="Chief never imports a whole address book." />
	<Appr
		t="cool"
		bind:included={carmen}
		title="Carmen Ruiz"
		meta="In device contacts"
		confidence="Add"
		index={1}
		total={2}
	/>
	<Appr
		t="cool"
		bind:included={daniel}
		title="Daniel Thompson"
		meta="In device contacts"
		confidence="Add"
		index={2}
		total={2}
	/>
	<Btn t="cool" label="Import {count} selected" soon />
	<Btn primary={false} label="Enter someone manually" soon />
</Screen>
