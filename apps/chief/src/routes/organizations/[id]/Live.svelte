<script>
	/**
	 * One of the account's own organizations.
	 *
	 * Shows only what is kept: its type, what it is for, and the spheres
	 * it works in. Members, rights and stewardship appear in the sample
	 * view because they are designed; they are left off here until there
	 * are records behind them, rather than drawn empty.
	 */
	import { goto } from '$app/navigation';
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, Btn, Field, Note, SectionHead, SpherePick, TypeBadge } from '$lib/kit';
	import { archive, updateOrganization } from '$lib/pb.js';
	import { orgType } from '$lib/orgtypes.js';
	import TypePick from '../TypePick.svelte';

	/** @type {{ org: import('$lib/pb.js').OrgRow }} */
	let { org: first } = $props();

	// Keyed on the record id by the page, so the first value is the only one.
	// svelte-ignore state_referenced_locally
	let org = $state(first);
	const type = $derived(orgType(org.code));

	let editing = $state(false);
	let name = $state('');
	let code = $state('');
	let charter = $state('');
	let busy = $state(false);
	let fault = $state('');
	let confirming = $state(false);

	function edit() {
		name = org.name;
		code = org.code;
		charter = org.charter;
		fault = '';
		editing = true;
	}

	/** @param {any} err */
	const why = (err) =>
		err?.response?.data?.name
			? 'Another organization already has that name.'
			: err?.message || 'The server did not answer.';

	async function save() {
		if (!name.trim() || busy) return;
		busy = true;
		fault = '';
		try {
			org = await updateOrganization(org.id, {
				name: name.trim(),
				code,
				charter: charter.trim()
			});
			editing = false;
		} catch (err) {
			fault = why(err);
		}
		busy = false;
	}

	/** @param {string[]} next */
	async function place(next) {
		const before = org.spheres;
		org = { ...org, spheres: next };
		fault = '';
		try {
			org = await updateOrganization(org.id, { spheres: next });
		} catch (err) {
			org = { ...org, spheres: before };
			fault = why(err);
		}
	}

	async function remove() {
		busy = true;
		fault = '';
		try {
			await archive('organizations', org.id);
			await goto('/organizations');
		} catch (err) {
			fault = why(err);
			busy = false;
		}
	}
</script>

<svelte:head><title>{org.name} · Chief</title></svelte:head>

<Screen back="/organizations" nav={false}>
	{#if editing}
		<form
			class="form"
			onsubmit={(e) => {
				e.preventDefault();
				save();
			}}
		>
			<Field label="Name" bind:value={name} required />
			{#if !org.self}<TypePick bind:value={code} />{/if}
			<Field label="What it is for" bind:value={charter} lines={3} />
			{#if fault}<Alert title="Not saved" meta={fault} />{/if}
			<Btn
				t="cool"
				type="submit"
				label={busy ? 'Saving…' : 'Save changes'}
				disabled={busy || !name.trim()}
			/>
			<Btn primary={false} label="Cancel" onclick={() => (editing = false)} />
		</form>
	{:else}
		<header class="head">
			<div class="line">
				<TypeBadge code={org.code} />
				{#if org.self}<span class="persp">You</span>{/if}
			</div>
			<h1>{org.name}</h1>
			{#if org.charter}<p class="charter">{org.charter}</p>{/if}
		</header>

		{#if org.self}
			<Note>
				This is you, as an organization. Nobody owns anything in person, so what you hold is held by
				this, and what you owe is owed by it.
			</Note>
		{/if}

		<SectionHead label="Spheres" t="cool" count={org.spheres.length} />
		<SpherePick picked={org.spheres} onchange={place} />

		<SectionHead label="Standing" />
		<dl class="standing">
			<div>
				<dt>Type</dt>
				<dd>{type.code} · {type.name}</dd>
			</div>
			<div>
				<dt>Identified by</dt>
				<dd>{type.identification}</dd>
			</div>
		</dl>
		<Note>
			{type.controls
				? 'An individual is the only type that can control, being the only one that is itself an intelligence.'
				: `A ${type.name} does not control on its own. It governs how individuals are tied together and how assets move among them.`}
		</Note>

		{#if fault}<Alert title="Not saved" meta={fault} />{/if}

		<Btn t="cool" label="Edit" onclick={edit} />
		{#if !org.self}
			{#if confirming}
				<Alert
					title="Remove {org.name}?"
					meta="It leaves your lists. Records that name it keep the name."
				/>
				<Btn
					t="alert"
					label={busy ? 'Removing…' : 'Yes, remove it'}
					onclick={remove}
					disabled={busy}
				/>
				<Btn primary={false} label="Keep it" onclick={() => (confirming = false)} />
			{:else}
				<Btn primary={false} label="Remove" onclick={() => (confirming = true)} />
			{/if}
		{/if}
	{/if}
</Screen>

<style>
	.form {
		display: contents;
	}
	.head {
		padding: 2px 2px 0;
	}
	.line {
		display: flex;
		align-items: center;
		gap: 9px;
		--badge-ink: var(--on-field-2);
	}
	.persp {
		margin-left: auto;
		font-family: var(--font-label);
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.1em;
		color: var(--on-field-2);
	}
	.head h1 {
		margin: 7px 0 0;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 31px;
		line-height: 1.1;
		color: var(--on-field);
		letter-spacing: -0.015em;
		text-shadow: var(--on-field-shade);
	}
	.charter {
		margin: 4px 0 0;
		font-size: 16px;
		line-height: 1.45;
		color: var(--on-field-2);
	}
	.standing {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin: 0;
		border: 1px solid var(--glass-line);
		border-radius: var(--r-md);
		background: var(--glass);
		padding: 14px 16px;
		box-shadow: var(--glass-shadow);
	}
	.standing div {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}
	dt {
		font-family: var(--font-label);
		font-size: 13px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ink-3);
		font-weight: 700;
	}
	dd {
		margin: 0;
		font-size: 15.5px;
		color: var(--ink);
	}
</style>
