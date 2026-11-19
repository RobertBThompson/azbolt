<script>
	/**
	 * One of the account's own people.
	 *
	 * Spheres first, contact after, as in the design. The relationship
	 * part of the design — last contact, next contact, drift — needs a
	 * record of contact that is not kept yet, so it is left off rather
	 * than shown with nothing in it.
	 */
	import { goto } from '$app/navigation';
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, Btn, SectionHead, SpherePick, Delete } from '$lib/kit';
	import { destroy, updatePerson } from '$lib/pb.js';
	import PersonForm from '../PersonForm.svelte';

	/** @type {{ person: import('$lib/pb.js').PersonRow }} */
	let { person: first } = $props();

	// Keyed on the record id by the page, so the first value is the only one.
	// svelte-ignore state_referenced_locally
	let person = $state(first);
	const meta = $derived([person.role, person.relationship].filter(Boolean).join(' · '));

	let editing = $state(false);
	let fields = $state(blank());
	let busy = $state(false);
	let fault = $state('');

	function blank() {
		return {
			first_name: '',
			last_name: '',
			role: '',
			relationship: '',
			email: '',
			phone: '',
			notes: ''
		};
	}

	function edit() {
		const { id: _id, name: _name, spheres: _spheres, ...rest } = person;
		fields = rest;
		fault = '';
		editing = true;
	}

	/** @param {any} err */
	const why = (err) =>
		err?.response?.data?.email
			? 'That email address is not one the server accepts.'
			: err?.message || 'The server did not answer.';

	async function save() {
		if (!fields.first_name.trim() || busy) return;
		busy = true;
		fault = '';
		try {
			person = await updatePerson(
				person.id,
				Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, v.trim()]))
			);
			editing = false;
		} catch (err) {
			fault = why(err);
		}
		busy = false;
	}

	/** @param {string[]} next */
	async function place(next) {
		const before = person.spheres;
		person = { ...person, spheres: next };
		fault = '';
		try {
			person = await updatePerson(person.id, { spheres: next });
		} catch (err) {
			person = { ...person, spheres: before };
			fault = why(err);
		}
	}
</script>

<svelte:head><title>{person.name} · Chief</title></svelte:head>

<Screen back="/people" nav={false}>
	{#if editing}
		<form
			class="form"
			onsubmit={(e) => {
				e.preventDefault();
				save();
			}}
		>
			<PersonForm bind:value={fields} />
			{#if fault}<Alert title="Not saved" meta={fault} />{/if}
			<Btn
				t="cool"
				type="submit"
				label={busy ? 'Saving…' : 'Save changes'}
				disabled={busy || !fields.first_name.trim()}
			/>
			<Btn primary={false} label="Cancel" onclick={() => (editing = false)} />
		</form>
	{:else}
		<header class="who">
			<h1>{person.name}</h1>
			{#if meta}<p>{meta}</p>{/if}
		</header>

		<SectionHead label="Spheres" t="cool" count={person.spheres.length} />
		<SpherePick picked={person.spheres} onchange={place} />

		<SectionHead label="Contact" />
		{#if person.email || person.phone}
			<ul class="contact">
				{#if person.phone}
					<li><span class="k">Phone</span><a href="tel:{person.phone}">{person.phone}</a></li>
				{/if}
				{#if person.email}
					<li><span class="k">Email</span><a href="mailto:{person.email}">{person.email}</a></li>
				{/if}
			</ul>
		{:else}
			<p class="empty">No phone or email kept yet.</p>
		{/if}

		{#if person.notes}
			<SectionHead label="Notes" />
			<p class="notes">{person.notes}</p>
		{/if}

		{#if fault}<Alert title="Not saved" meta={fault} />{/if}

		<Btn t="cool" label="Edit" onclick={edit} />
		<Delete
			what={person.name}
			warn="Everything kept about them goes."
			ondelete={async () => {
				await destroy('people', person.id);
				await goto('/people', { replaceState: true });
			}}
		/>
	{/if}
</Screen>

<style>
	.form {
		display: contents;
	}
	.who {
		padding: 2px 2px 0;
	}
	.who h1 {
		margin: 0;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 31px;
		line-height: 1.1;
		color: var(--on-field);
		letter-spacing: -0.015em;
		text-shadow: var(--on-field-shade);
	}
	.who p {
		margin: 4px 0 0;
		font-size: 16px;
		color: var(--on-field-2);
	}
	.contact {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 1px;
		border: 1px solid var(--glass-line);
		border-radius: var(--r-md);
		overflow: hidden;
		background: var(--line-3);
		box-shadow: var(--glass-shadow);
	}
	.contact li {
		display: flex;
		align-items: center;
		gap: 12px;
		min-height: 48px;
		padding: 0 16px;
		background: var(--card);
		font-size: 16px;
	}
	.k {
		flex: none;
		width: 56px;
		font-family: var(--font-label);
		font-size: 13px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-3);
		font-weight: 700;
	}
	.contact a {
		color: var(--tone-cool);
		overflow-wrap: anywhere;
	}
	.notes {
		margin: 0;
		padding: 14px 16px;
		border: 1px solid var(--glass-line);
		border-radius: var(--r-md);
		background: var(--glass);
		box-shadow: var(--glass-shadow);
		font-size: 15.5px;
		line-height: 1.5;
		color: var(--ink);
		white-space: pre-wrap;
	}
	.empty {
		margin: 0;
		padding: 13px 16px;
		border: 1.5px dashed rgba(255, 255, 255, 0.75);
		border-radius: var(--r-sm);
		font-size: 14.5px;
		color: var(--on-field);
		background: rgba(255, 255, 255, 0.14);
	}
</style>
