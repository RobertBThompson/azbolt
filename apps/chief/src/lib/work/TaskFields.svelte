<script>
	/**
	 * What is kept about a task. One set of fields for adding and
	 * editing, so the two cannot ask for different things.
	 *
	 * Only the task itself is required. When, what it is for and what it
	 * is waiting on can all be left for later.
	 */
	/**
	 * @type {{
	 *   value: { name: string, state: string, endeavor: string, due: string, waiting: string, notes: string }
	 * }}
	 */
	let { value = $bindable() } = $props();
	import { Field, Select } from '$lib/kit';
	import { TASK_STATES } from '$lib/work.js';
	import { work, orgOf } from '$lib/work.svelte.js';

	const endeavors = $derived(
		work.endeavors
			.filter((e) => e.stage !== 'Done' || e.id === value.endeavor)
			.map((e) => ({
				value: e.id,
				label: `${e.name} · ${orgOf(e.organization)?.name ?? 'no organization'}`
			}))
	);
</script>

<Field label="Task" placeholder="What needs to happen" bind:value={value.name} required />
<Select label="When" options={TASK_STATES} bind:value={value.state} />
<Select
	label="Endeavor"
	options={endeavors}
	bind:value={value.endeavor}
	placeholder={endeavors.length ? 'Not part of one' : 'No endeavors yet'}
/>
<Field label="Due" type="date" bind:value={value.due} />
<Field label="Waiting on" placeholder="Nobody: leave empty" bind:value={value.waiting} />
<Field label="Notes" bind:value={value.notes} lines={3} />
