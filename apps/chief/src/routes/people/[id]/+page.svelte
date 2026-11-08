<script>
	/**
	 * F1 Directory — D3 Person profile.
	 * A relationship record that is useful without being a CRM. Private notes
	 * stay private; nothing here is scored or ranked.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Chips, Row, Btn } from '$lib/kit';
	import { PEOPLE } from '$lib/data.js';
	import { page } from '$app/stores';

	const person = $derived(PEOPLE[$page.params.id ?? ''] ?? PEOPLE.carmen);
</script>

<svelte:head><title>{person.name} · Chief</title></svelte:head>

<Screen back="/people" nav={false}>
	<Banner t="cool" title={person.name} meta={person.role} />
	<Chips t="cool" items={person.tags} active={-1} />
	<Row t="cool" title="Next interaction" meta={person.next} trailing="›" />
	<Row t="cool" title="Shared endeavors" meta={person.endeavors} trailing="↗" />
	<Row t="cool" title="Private notes" meta={person.notes} trailing="›" />
	<Btn t="ai" primary={false} href="/jot" label="Jot about {person.first}" />
</Screen>
