<script>
	/**
	 * F1 Directory — D1 People.
	 * The list leads with the next interaction, not the job title: the
	 * reason you open a person is almost always temporal. Search appears
	 * here because this list gets long — it is deliberately absent from
	 * the short lists elsewhere.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Field, Chips, Row, Btn } from '$lib/kit';
</script>

<svelte:head><title>People · Chief</title></svelte:head>

<Screen search>
	<Field label="Search people" placeholder="Name, relationship, organisation" />
	<Chips t="cool" items={['All', 'Personal', 'Work']} />
	<Row
		t="cool"
		href="/people/daughter"
		title="My daughter"
		meta="Family · follow-up tonight"
		trailing="›"
	/>
	<Row
		t="cool"
		href="/people/carmen"
		title="Carmen Mendez"
		meta="Azbolt · 2 shared endeavors"
		trailing="›"
	/>
	<Row
		t="cool"
		href="/people/pamela"
		title="Pamela Anderson"
		meta="TN Holdings · owner"
		trailing="›"
	/>
	<Row t="cool" href="/organisations" title="Organisations" meta="4 organisations" trailing="›" />
	<Btn t="cool" href="/people/add" label="Add person" />
</Screen>
