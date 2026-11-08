<script>
	/**
	 * B1 Onboarding — A4 Create a workspace.
	 * Three inputs, one of which is a chip row. "Workspace" is defined by the
	 * question above it rather than by a glossary.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Prog, Field, Chips, Btn } from '$lib/kit';
</script>

<svelte:head><title>Create a workspace · Chief</title></svelte:head>

<Screen back="/onboarding/focus" nav={false}>
	<Prog t="cool" title="Setup" value={0.5} meta="Step 1 of 2" />
	<Field label="What is it called" placeholder="Azbolt" />
	<Chips t="cool" items={['Company', 'Personal', 'Nonprofit', 'DAO']} />
	<Field label="What are you building" placeholder="One sentence is enough" />
	<Btn t="cool" href="/onboarding/connection" label="Create it" />
</Screen>
