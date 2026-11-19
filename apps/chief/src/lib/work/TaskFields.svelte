<script>
	/**
	 * What is kept about a task. One set of fields for adding and
	 * editing, so the two cannot ask for different things.
	 *
	 * Only the task itself is required. When, what it is for and what it
	 * is waiting on can all be left for later.
	 *
	 * A task may name the asset it works on, how big it is, and what it
	 * should add in dollars (Robert, 19 Nov). Those three are what rank it
	 * on the Asset tab, among the quick wins or by what it gives for the
	 * effort. The gain is typed in dollars and kept in cents.
	 */
	/**
	 * @type {{
	 *   value: {
	 *     name: string, state: string, endeavor: string, due: string, waiting: string, notes: string,
	 *     asset: string, effort: string, gain: number
	 *   }
	 * }}
	 */
	let { value = $bindable() } = $props();
	import { Field, Note, Select } from '$lib/kit';
	import { ASSETS, stateOf } from '$lib/assets.js';
	import { readAmount } from '$lib/amount.js';
	import { EFFORTS, TASK_STATES } from '$lib/work.js';
	import { work, orgOf } from '$lib/work.svelte.js';

	const endeavors = $derived(
		work.endeavors
			.filter((e) => e.stage !== 'Done' || e.id === value.endeavor)
			.map((e) => ({
				value: e.id,
				label: `${e.name} · ${orgOf(e.organization)?.name ?? 'no organization'}`
			}))
	);

	/* Assets still held, and the one already named even if it has since been let go. */
	const assets = Object.entries(ASSETS)
		.filter(([id, a]) => stateOf(a) !== 'Done' || id === value.asset)
		.map(([id, a]) => ({ value: id, label: a.name }))
		.sort((x, y) => x.label.localeCompare(y.label));

	// svelte-ignore state_referenced_locally
	let gainText = $state(value.gain ? String(value.gain / 100) : '');
	const badGain = $derived(gainText.trim() !== '' && readAmount(gainText) === null);
	/** @param {string} text */
	function setGain(text) {
		gainText = text;
		const n = readAmount(text);
		value.gain = n === null ? 0 : Math.round(n * 100);
	}
</script>

<Field label="Task" placeholder="What needs to happen" bind:value={value.name} required />
<Select label="When" options={TASK_STATES} bind:value={value.state} />
<Select
	label="Endeavor"
	options={endeavors}
	bind:value={value.endeavor}
	placeholder={endeavors.length ? 'Not part of one' : 'No endeavors yet'}
/>
<Select
	label="Asset it works on"
	options={assets}
	bind:value={value.asset}
	placeholder={assets.length ? 'None' : 'No assets yet'}
/>
<Select label="Effort" options={EFFORTS} bind:value={value.effort} placeholder="Not sized yet" />
<Field
	label="Gain, in dollars"
	placeholder="What it should add, roughly"
	bind:value={() => gainText, setGain}
/>
{#if badGain}<Note>That is not an amount. Type a number, like 1200.</Note>{/if}
<Field label="Due" type="date" bind:value={value.due} />
<Field label="Waiting on" placeholder="Nobody: leave empty" bind:value={value.waiting} />
<Field label="Notes" bind:value={value.notes} lines={3} />
