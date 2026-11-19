<script>
	/**
	 * B8 — G8 Profile & sign-in.
	 * Identity and access live together because a name change is routine
	 * while a sign-in change affects recovery.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, Banner, Field, Btn, Note, SectionHead } from '$lib/kit';
	import { goto } from '$app/navigation';
	import { session } from '$lib/session.svelte.js';
	import { changePassword } from '$lib/pb.js';

	/* This screen showed a sample person's name to whoever was signed in,
	   which is the one place a wrong name is unmistakably a bug. */
	let name = $state(session.user?.name ?? '');
	let saved = $state(false);

	let current = $state('');
	let next = $state('');
	let again = $state('');
	let busy = $state(false);
	let fault = $state('');
	let changed = $state(false);

	const wrong = $derived(
		next !== '' && next.length < 8
			? 'A password is at least 8 characters.'
			: again !== '' && again !== next
				? 'The two new passwords are not the same.'
				: ''
	);
	const ready = $derived(current !== '' && next.length >= 8 && again === next);

	/** @param {SubmitEvent} e */
	async function saveName(e) {
		e.preventDefault();
		saved = false;
		saved = await session.setName(name.trim());
	}

	/** @param {SubmitEvent} e */
	async function savePassword(e) {
		e.preventDefault();
		if (!ready || busy) return;
		busy = true;
		fault = '';
		changed = false;
		try {
			await changePassword(current, next);
			current = next = again = '';
			changed = true;
		} catch (/** @type {any} */ err) {
			fault = err?.response?.data?.oldPassword
				? 'The current password is not right.'
				: err?.message || 'The server did not answer.';
		}
		busy = false;
	}

	function signOut() {
		session.signOut();
		goto('/');
	}
</script>

<svelte:head><title>Profile & sign-in · Chief</title></svelte:head>

<Screen back="/settings/account" nav={false}>
	{#if session.signedIn}
		<Banner title={session.label} meta={session.user?.email ?? 'Signed in'} />

		<form onsubmit={saveName}>
			<Field label="Display name" autocomplete="name" bind:value={name} />
			{#if session.error}<Alert title="Not saved" meta={session.error} />{/if}
			<Btn
				type="submit"
				label={session.busy ? 'Saving…' : saved ? 'Saved' : 'Save name'}
				disabled={session.busy || name.trim() === ''}
			/>
		</form>
		<Note>
			This is what Chief calls you. Your own organization keeps its name until you change it on its
			page.
		</Note>

		<SectionHead label="Password" />
		<form onsubmit={savePassword}>
			<Field
				label="Current password"
				type="password"
				autocomplete="current-password"
				bind:value={current}
			/>
			<Field label="New password" type="password" autocomplete="new-password" bind:value={next} />
			<Field
				label="New password again"
				type="password"
				autocomplete="new-password"
				bind:value={again}
			/>
			{#if wrong}<Note>{wrong}</Note>{/if}
			{#if fault}<Alert title="Not changed" meta={fault} />{/if}
			{#if changed}<Banner
					title="Password changed"
					meta="Other devices will need to sign in again."
				/>{/if}
			<Btn
				primary={false}
				type="submit"
				label={busy ? 'Changing…' : 'Change password'}
				disabled={!ready || busy}
			/>
		</form>

		<Btn primary={false} label="Sign out" onclick={signOut} />
	{:else}
		<Banner title="Not signed in" meta="Sign in to see and change your profile." />
		<Btn href="/signin" label="Sign in" />
	{/if}
</Screen>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 9px;
	}
</style>
