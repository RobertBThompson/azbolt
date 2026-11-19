<script>
	/**
	 * One of the account's own tasks.
	 *
	 * Read first, with the one thing most often done to a task — marking
	 * it done — a single tap away. Everything else is behind Edit.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, Btn, Chips, PageHead, Row, Seg, SphereTags, Delete } from '$lib/kit';
	import { goto } from '$app/navigation';
	import { destroy, updateTask } from '$lib/pb.js';
	import { isLate, spheresOf, taskLine } from '$lib/work.js';
	import { work, load, taskOf, endeavorOf, orgOf } from '$lib/work.svelte.js';
	import TaskFields from '$lib/work/TaskFields.svelte';
	import { today } from '$lib/today.js';
	import { ASSETS, money } from '$lib/assets.js';

	/** @type {{ id: string }} */
	let { id } = $props();

	/* Guarded in +page.js. Kept as it was on arrival so the screen does
	   not empty in the moment between removing it and leaving. */
	// svelte-ignore state_referenced_locally
	const first = /** @type {import('$lib/work.js').Task} */ (taskOf(id));
	const task = $derived(taskOf(id) ?? first);
	const e = $derived(endeavorOf(task.endeavor));
	const org = $derived(e ? orgOf(e.organization) : null);

	let editing = $state(false);
	let fields = $state({
		name: '',
		state: 'Now',
		endeavor: '',
		due: '',
		waiting: '',
		notes: '',
		asset: '',
		effort: '',
		gain: 0
	});
	let busy = $state(false);
	let fault = $state('');

	/* Where it stands is the buttons below, the same three as on an
	   asset's page, so it is said here only once it is Done. */
	const tags = $derived(
		[
			task.state === 'Done' ? 'Done' : '',
			isLate(task) ? 'Late' : '',
			task.waiting && task.state !== 'Done' ? `Waiting on ${task.waiting}` : ''
		].filter(Boolean)
	);

	function edit() {
		const { id: _id, doneOn: _done, ...rest } = task;
		fields = rest;
		fault = '';
		editing = true;
	}

	/** @param {() => Promise<unknown>} change @param {string} [then] */
	async function run(change, then) {
		if (busy) return;
		busy = true;
		fault = '';
		try {
			await change();
			await load();
			editing = false;
			if (then) await goto(then, { replaceState: true });
		} catch (/** @type {any} */ err) {
			fault = err?.message || 'The server did not answer.';
		}
		busy = false;
	}

	const save = () =>
		run(() =>
			updateTask(id, {
				...fields,
				// Done is dated the day it was marked, and undated if reopened.
				doneOn: fields.state === 'Done' ? task.doneOn || today() : ''
			})
		);
	const done = () => run(() => updateTask(id, { state: 'Done', doneOn: today() }));
	const reopen = () => run(() => updateTask(id, { state: 'Now', doneOn: '' }));

	const STANDING = ['Now', 'Soon', 'Later'];
	let standing = $state(0);
	$effect(() => {
		standing = Math.max(0, STANDING.indexOf(task.state));
	});
	/** @param {number} i */
	const stand = (i) => run(() => updateTask(id, { state: STANDING[i] }));
</script>

<svelte:head><title>{task.name} · Chief</title></svelte:head>

<Screen back="/work" nav={false}>
	{#if editing}
		<form
			onsubmit={(ev) => {
				ev.preventDefault();
				save();
			}}
		>
			<TaskFields bind:value={fields} />
			{#if fault}<Alert title="Not saved" meta={fault} />{/if}
			<Btn
				t="cool"
				type="submit"
				label={busy ? 'Saving…' : 'Save changes'}
				disabled={busy || !fields.name.trim()}
			/>
			<Btn primary={false} label="Cancel" onclick={() => (editing = false)} />
		</form>
	{:else}
		<PageHead eyebrow="Task" title={task.name} meta={taskLine(task, [])} />
		{#if tags.length}<Chips t="cool" items={tags} active={-1} />{/if}
		{#if org}<SphereTags keys={spheresOf(e, work.orgs)} />{/if}
		{#if task.state !== 'Done'}
			<Seg
				t="cool"
				label="Where it stands"
				items={STANDING}
				bind:active={standing}
				onpick={stand}
				disabled={busy}
			/>
		{/if}

		{#if e}
			<Row
				t="cool"
				href="/work/endeavors/{e.id}"
				title="Endeavor"
				meta="{e.name} · {org?.name ?? 'no organization'}"
				trailing="›"
			/>
		{:else}
			<Row t="cool" title="Endeavor" meta="Not part of one, so it is in no sphere yet" />
		{/if}
		{#if task.asset && ASSETS[task.asset]}
			<Row
				t="warm"
				href="/records/assets/{task.asset}"
				title="Works on"
				meta={[
					ASSETS[task.asset].name,
					task.effort ? `${task.effort.toLowerCase()} effort` : 'effort not given',
					task.gain ? `should add ${money(task.gain)}` : 'gain not given'
				].join(' · ')}
				trailing="›"
			/>
		{/if}
		{#if task.notes}<p class="notes">{task.notes}</p>{/if}

		{#if fault}<Alert title="Not saved" meta={fault} />{/if}
		{#if task.state === 'Done'}
			<Btn
				t="cool"
				label={busy ? 'Saving…' : 'Not done after all'}
				onclick={reopen}
				disabled={busy}
			/>
		{:else}
			<Btn t="cool" label={busy ? 'Saving…' : 'Mark done'} onclick={done} disabled={busy} />
		{/if}
		<Btn primary={false} label="Edit" onclick={edit} />
		<Delete
			what="this task"
			warn="A finished task is better marked done, which keeps it."
			ondelete={async () => {
				await destroy('tasks', id);
				await load();
				await goto('/work', { replaceState: true });
			}}
		/>
	{/if}
</Screen>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 11px;
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
</style>
