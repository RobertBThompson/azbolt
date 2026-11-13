<script>
	/**
	 * The technical attributes of an asset — the columns the assets table
	 * actually has: rights, period, tangibility, liquidity, inventory,
	 * quantity and notes.
	 *
	 * Every one is optional. The three either/or attributes are shown as
	 * both answers side by side rather than as switches, because "not
	 * liquid" is an answer and an unlabelled off-switch is not.
	 *
	 * Shared by the second step of adding an asset and by editing one, so
	 * the two cannot ask for different things.
	 */
	import { Select, Field, Seg, SectionHead } from '$lib/kit';

	/**
	 * @type {{
	 *   rights?: string, period?: string, quantity?: string, notes?: string,
	 *   tangible?: number, liquid?: number, inventory?: number
	 * }}
	 */
	let {
		rights = $bindable(''),
		period = $bindable(''),
		quantity = $bindable('1'),
		notes = $bindable(''),
		tangible = $bindable(0),
		liquid = $bindable(1),
		inventory = $bindable(1)
	} = $props();

	const RIGHTS = ['Owned', 'Licensed', 'Leased', 'Contracted', 'Held in trust', 'Borrowed'];
</script>

<Select
	label="Rights"
	options={RIGHTS}
	bind:value={rights}
	placeholder="Owned, licensed, leased…"
/>
<Field label="Period" placeholder="Start and end, if relevant" bind:value={period} />
<Field label="Quantity" placeholder="1" bind:value={quantity} />

<SectionHead label="Tangibility" t="warm" />
<Seg t="warm" a="Tangible" b="Intangible" bind:active={tangible} />
<SectionHead label="Liquidity" t="warm" />
<Seg t="warm" a="Liquid" b="Not liquid" bind:active={liquid} />
<SectionHead label="Inventory" t="warm" />
<Seg t="warm" a="Inventory" b="Not inventory" bind:active={inventory} />

<Field label="Notes" placeholder="Anything worth knowing later" lines={3} bind:value={notes} />
