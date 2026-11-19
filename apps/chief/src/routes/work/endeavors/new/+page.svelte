<script>
	/**
	 * B3 Work — W3 New endeavor.
	 * Three things. The second is phrased as a question about the future
	 * because "description" produces a title restated. The third is whose
	 * it is: an endeavor belongs to an organization, and that is how it
	 * and every task under it come to be in a sphere. Dates, people and
	 * assets are deliberately absent: an endeavor that exists and is
	 * vague beats one never created because it asked nine questions.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, Banner, Field, Select, Btn, Blank } from '$lib/kit';
	import { goto } from '$app/navigation';
	import { createEndeavor } from '$lib/pb.js';
	import { ENDEAVOR_STAGES } from '$lib/work.js';
	import { work, kept, load, orgOf } from '$lib/work.svelte.js';

	const orgs = [...work.orgs]
		.sort((a, b) => Number(b.self) - Number(a.self))
		.map((o) => ({ value: o.id, label: o.self ? `${o.name} · you` : o.name }));

	let name = $state('');
	let outcome = $state('');
	let organization = $state(work.orgs.find((o) => o.self)?.id ?? '');
	let stage = $state('Active');
	let busy = $state(false);
	let fault = $state('');

	const ready = $derived(name.trim() !== '' && organization !== '');
	const chosen = $derived(orgOf(organization));

	/** @param {SubmitEvent} e */
	async function create(e) {
		e.preventDefault();
		if (!ready || busy) return;
		busy = true;
		fault = '';
		try {
			const made = await createEndeavor({ name, outcome, organization, stage });
			await load();
			await goto(`/work/endeavors/${made.id}`, { replaceState: true });
		} catch (/** @type {any} */ err) {
			fault = err?.message || 'The server did not answer.';
			busy = false;
		}
	}
</script>

<svelte:head><title>New endeavor · Chief</title></svelte:head>

<Screen back="/work/endeavors" nav={false}>
	<Banner
		t="cool"
		title="Start with the outcome"
		meta="Everything else can be added once it exists."
	/>
	{#if kept()}
		<form onsubmit={create}>
			<Field label="Name" placeholder="Short working title" bind:value={name} required />
			<Field
				label="What will be true when this succeeds"
				placeholder="One sentence"
				bind:value={outcome}
				lines={2}
			/>
			<Select
				label="Whose it is"
				options={orgs}
				bind:value={organization}
				placeholder="Organization"
			/>
			<Select label="Stage" options={ENDEAVOR_STAGES} bind:value={stage} />
			{#if chosen && chosen.spheres.length === 0}
				<Blank>
					{chosen.name} is in no sphere yet, so this and its tasks will show under All life only.
				</Blank>
			{/if}
			{#if fault}<Alert title="Not saved" meta={fault} />{/if}
			<Btn
				t="cool"
				type="submit"
				label={busy ? 'Saving…' : 'Create endeavor'}
				disabled={!ready || busy}
			/>
		</form>
	{:else}
		<Banner
			t="cool"
			title="Sign in to add an endeavor"
			meta="The ones on show are samples. Yours are kept under your own account."
		/>
		<Btn t="cool" href="/signin" label="Sign in" />
	{/if}
</Screen>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 11px;
	}
</style>
