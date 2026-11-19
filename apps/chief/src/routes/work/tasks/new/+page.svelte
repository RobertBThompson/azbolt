<script>
	/**
	 * B3 Work — W7 New task.
	 * Throwing a jot remains the fastest route; this screen is for
	 * deliberate entry, and for turning a jot into a task. Only the task
	 * is required.
	 *
	 * A task goes up to an endeavor and no further. The endeavor's
	 * organization is what puts it in a sphere, so nothing here asks for
	 * one.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, Banner, Btn, Note } from '$lib/kit';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { createTask, taskJot } from '$lib/pb.js';
	import { jotOf, jots, load as loadJots } from '$lib/jots.svelte.js';
	import { work, kept, load, endeavorOf } from '$lib/work.svelte.js';
	import TaskFields from '$lib/work/TaskFields.svelte';
	import { today } from '$lib/today.js';
	import { ASSETS } from '$lib/assets.js';

	const fromJot = $page.url.searchParams.get('jot') ?? '';
	const jot = fromJot ? jotOf(fromJot) : null;
	const forEndeavor = $page.url.searchParams.get('endeavor') ?? '';
	/* Arriving from an asset's own page, the task is for that asset. */
	const forAsset = $page.url.searchParams.get('asset') ?? '';

	let fields = $state({
		name: jot?.text ?? '',
		state: 'Now',
		endeavor: endeavorOf(forEndeavor) ? forEndeavor : '',
		due: '',
		waiting: '',
		notes: '',
		asset: ASSETS[forAsset] ? forAsset : '',
		effort: '',
		gain: 0
	});
	let busy = $state(false);
	let fault = $state('');

	const back = forEndeavor
		? `/work/endeavors/${forEndeavor}`
		: forAsset
			? `/records/assets/${forAsset}`
			: '/work';
	const ready = $derived(fields.name.trim() !== '');

	/** @param {SubmitEvent} e */
	async function create(e) {
		e.preventDefault();
		if (!ready || busy) return;
		busy = true;
		fault = '';
		try {
			const made = await createTask(
				{ ...fields, doneOn: fields.state === 'Done' ? today() : '' },
				jot && jot.state === 'kept' ? jot.id : ''
			);
			if (jot && jot.state === 'kept') {
				// The jot has been dealt with. If this fails the task is still
				// made; the jot simply stays in the queue to be sphered.
				await taskJot(jot.id, endeavorOf(made.endeavor)?.organization ?? '').catch(() => {});
				if (jots.loaded) await loadJots();
			}
			await load();
			await goto(back, { replaceState: true });
		} catch (/** @type {any} */ err) {
			fault = err?.message || 'The server did not answer.';
			busy = false;
		}
	}
</script>

<svelte:head><title>New task · Chief</title></svelte:head>

<Screen {back} nav={false}>
	{#if kept()}
		{#if jot}
			<Banner
				t="cool"
				title="From your jot"
				meta="Tidy the wording if you like. The jot is kept as you wrote it."
			/>
		{/if}
		<form onsubmit={create}>
			<TaskFields bind:value={fields} />
			{#if fault}<Alert title="Not saved" meta={fault} />{/if}
			<Btn
				t="cool"
				type="submit"
				label={busy ? 'Saving…' : 'Create task'}
				disabled={!ready || busy}
			/>
		</form>
		{#if !work.endeavors.length}
			<Note>
				A task is in a sphere through its endeavor. With no endeavor it shows under All life only.
			</Note>
		{/if}
	{:else}
		<Banner
			t="cool"
			title="Sign in to add a task"
			meta="The tasks on show are samples. Yours are kept under your own account."
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
