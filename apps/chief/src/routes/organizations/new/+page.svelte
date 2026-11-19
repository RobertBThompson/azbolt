<script>
	/**
	 * F1 Directory — D8 Add organization.
	 *
	 * Three things and it exists: a name, what kind of body it is, and
	 * what it is for. Spheres, ownership and proof are attached from its
	 * own page afterwards, once there is a record to attach them to.
	 */
	import { goto } from '$app/navigation';
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, Banner, Btn, Field } from '$lib/kit';
	import { createOrganization } from '$lib/pb.js';
	import { session } from '$lib/session.svelte.js';
	import TypePick from '../TypePick.svelte';

	let name = $state('');
	let code = $state('');
	let charter = $state('');
	let busy = $state(false);
	let fault = $state('');

	const ready = $derived(name.trim() !== '' && code !== '');

	async function create() {
		if (!ready || busy) return;
		busy = true;
		fault = '';
		try {
			const made = await createOrganization({
				name: name.trim(),
				code,
				charter: charter.trim()
			});
			await goto(`/organizations/${made.id}`, { replaceState: true });
		} catch (/** @type {any} */ err) {
			fault = err?.response?.data?.name
				? 'You already have an organization with that name.'
				: err?.message || 'The server did not answer.';
			busy = false;
		}
	}
</script>

<svelte:head><title>Add organization · Chief</title></svelte:head>

<Screen back="/organizations" nav={false}>
	{#if session.signedIn}
		<form
			class="form"
			onsubmit={(e) => {
				e.preventDefault();
				create();
			}}
		>
			<Field label="Name" placeholder="Organization name" bind:value={name} required />
			<TypePick bind:value={code} />
			<Field
				label="What it is for"
				placeholder="One sentence is enough"
				bind:value={charter}
				lines={3}
			/>
			{#if fault}<Alert title="Not created" meta={fault} />{/if}
			<Btn
				t="cool"
				type="submit"
				label={busy ? 'Creating…' : 'Create organization'}
				disabled={!ready || busy}
			/>
		</form>
	{:else}
		<Banner
			t="cool"
			title="Sign in to add an organization"
			meta="The ones on show are samples. Yours are kept under your own account."
		/>
		<Btn t="cool" href="/signin" label="Sign in" />
	{/if}
</Screen>

<style>
	.form {
		display: contents;
	}
</style>
