<script>
	/**
	 * One of the account's own endeavors.
	 *
	 * The outcome sentence is the headline because it is what the
	 * endeavor is for. Under it: whose it is, how far along by its own
	 * tasks, and the tasks themselves, open ones first.
	 *
	 * People and assets tied to an endeavor are in the design and not
	 * kept yet, so they are left off rather than shown empty.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import {
		Alert,
		Banner,
		Blank,
		Btn,
		Field,
		Prog,
		Row,
		SectionHead,
		Select,
		SphereTags,
		Delete
	} from '$lib/kit';
	import { goto } from '$app/navigation';
	import { destroy, updateEndeavor } from '$lib/pb.js';
	import {
		ENDEAVOR_STAGES,
		TASK_STATES,
		inOrder,
		isLate,
		progressOf,
		spheresOf,
		taskLine
	} from '$lib/work.js';
	import { work, load, endeavorOf, orgOf } from '$lib/work.svelte.js';

	/** @type {{ id: string }} */
	let { id } = $props();

	// svelte-ignore state_referenced_locally
	const first = /** @type {import('$lib/work.js').Endeavor} */ (endeavorOf(id));
	const e = $derived(endeavorOf(id) ?? first);
	const org = $derived(orgOf(e.organization));
	const mine = $derived(work.tasks.filter((t) => t.endeavor === id));
	const open = $derived(
		TASK_STATES.filter((s) => s !== 'Done').flatMap((s) =>
			inOrder(mine.filter((t) => t.state === s))
		)
	);
	const done = $derived(inOrder(mine.filter((t) => t.state === 'Done')));
	const p = $derived(progressOf(id, work.tasks));

	const orgs = $derived(
		work.orgs.map((o) => ({ value: o.id, label: o.self ? `${o.name} · you` : o.name }))
	);

	let editing = $state(false);
	let name = $state('');
	let outcome = $state('');
	let organization = $state('');
	let stage = $state('Active');
	let busy = $state(false);
	let fault = $state('');

	function edit() {
		({ name, outcome, organization, stage } = e);
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
			updateEndeavor(id, { name: name.trim(), outcome: outcome.trim(), organization, stage })
		);
	const finish = () => run(() => updateEndeavor(id, { stage: 'Done' }));
</script>

<svelte:head><title>{e.name} · Chief</title></svelte:head>

<Screen back="/work/endeavors" nav={false}>
	{#if editing}
		<form
			onsubmit={(ev) => {
				ev.preventDefault();
				save();
			}}
		>
			<Field label="Name" bind:value={name} required />
			<Field label="What will be true when this succeeds" bind:value={outcome} lines={2} />
			<Select label="Whose it is" options={orgs} bind:value={organization} />
			<Select label="Stage" options={ENDEAVOR_STAGES} bind:value={stage} />
			{#if fault}<Alert title="Not saved" meta={fault} />{/if}
			<Btn
				t="cool"
				type="submit"
				label={busy ? 'Saving…' : 'Save changes'}
				disabled={busy || !name.trim() || !organization}
			/>
			<Btn primary={false} label="Cancel" onclick={() => (editing = false)} />
		</form>
	{:else}
		<Banner t="cool" title={e.name} meta={e.outcome || 'No outcome written yet.'} />
		<SphereTags keys={spheresOf(e, work.orgs)} />
		{#if org}
			<Row
				t="cool"
				href="/organizations/{org.id}"
				title="Whose it is"
				meta="{org.name} · {e.stage.toLowerCase()}"
				trailing="↗"
			/>
		{/if}
		{#if p.share !== null}
			<Prog t="cool" title="Progress" value={p.share} meta="{p.done} of {p.total} tasks done" />
		{/if}

		<SectionHead label="To do" t="cool" count={open.length} />
		{#each open as t (t.id)}
			<Row
				t={isLate(t) ? 'alert' : 'cool'}
				href="/work/tasks/{t.id}"
				title={t.name}
				meta={[t.state, taskLine(t, [])].filter(Boolean).join(' · ')}
				trailing="›"
			/>
		{:else}
			<Blank>{mine.length ? 'Every task here is done.' : 'No tasks yet.'}</Blank>
		{/each}
		{#if e.stage !== 'Done'}
			<Btn t="cool" href="/work/tasks/new?endeavor={id}" label="Add a task" />
		{/if}

		{#if done.length}
			<SectionHead label="Done" t="cool" count={done.length} />
			{#each done as t (t.id)}
				<Row
					t="neutral"
					href="/work/tasks/{t.id}"
					title={t.name}
					meta={taskLine(t, [])}
					trailing="›"
				/>
			{/each}
		{/if}

		{#if fault}<Alert title="Not saved" meta={fault} />{/if}
		{#if e.stage !== 'Done'}
			<Btn primary={false} label="It is true now — mark it done" onclick={finish} disabled={busy} />
		{/if}
		<Btn primary={false} label="Edit" onclick={edit} />
		<Delete
			what={e.name}
			warn="Its tasks are kept and stop belonging to an endeavor."
			ondelete={async () => {
				await destroy('endeavors', id);
				await load();
				await goto('/work/endeavors', { replaceState: true });
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
</style>
