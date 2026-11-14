<script>
	/**
	 * F1 Directory — D2 Add a person.
	 *
	 * Typed in, one at a time. Picking from the phone's contacts is the
	 * faster road and is not built: when it is, it will ask for that one
	 * person, on that tap, and never read the whole address book.
	 */
	import { goto } from '$app/navigation';
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, Banner, Btn } from '$lib/kit';
	import { createPerson } from '$lib/pb.js';
	import { session } from '$lib/session.svelte.js';
	import PersonForm from '../PersonForm.svelte';

	let fields = $state({
		first_name: '',
		last_name: '',
		role: '',
		relationship: '',
		email: '',
		phone: '',
		notes: ''
	});
	let busy = $state(false);
	let fault = $state('');

	const ready = $derived(fields.first_name.trim() !== '');

	async function add() {
		if (!ready || busy) return;
		busy = true;
		fault = '';
		try {
			const made = await createPerson(trimmed(fields));
			await goto(`/people/${made.id}`, { replaceState: true });
		} catch (/** @type {any} */ err) {
			fault = err?.response?.data?.email
				? 'That email address is not one the server accepts.'
				: err?.message || 'The server did not answer.';
			busy = false;
		}
	}

	/** @param {typeof fields} f */
	const trimmed = (f) =>
		/** @type {typeof fields} */ (
			Object.fromEntries(Object.entries(f).map(([k, v]) => [k, v.trim()]))
		);
</script>

<svelte:head><title>Add a person · Chief</title></svelte:head>

<Screen back="/people" nav={false}>
	{#if session.signedIn}
		<form
			class="form"
			onsubmit={(e) => {
				e.preventDefault();
				add();
			}}
		>
			<PersonForm bind:value={fields} />
			{#if fault}<Alert title="Not added" meta={fault} />{/if}
			<Btn
				t="cool"
				type="submit"
				label={busy ? 'Adding…' : 'Add person'}
				disabled={!ready || busy}
			/>
		</form>
		<Btn primary={false} label="Choose from contacts" soon />
	{:else}
		<Banner
			t="cool"
			title="Sign in to add a person"
			meta="The people on show are samples. Yours are kept under your own account."
		/>
		<Btn t="cool" href="/signin" label="Sign in" />
	{/if}
</Screen>

<style>
	.form {
		display: contents;
	}
</style>
