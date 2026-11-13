<script>
	/**
	 * Sphere — Notes.
	 *
	 * An outline, in the RemNote sense: one line per thought, nested by
	 * indent. Deliberately only the six operations that make an outliner
	 * an outliner — add, delete, move up, move down, indent, outdent —
	 * plus editing the text.
	 *
	 * Keyboard shortcuts are there for a desktop, but the controls are
	 * buttons because this is a phone app first and Tab is not reachable
	 * on a phone keyboard. The controls appear on the focused line only,
	 * so the page stays a list of thoughts rather than a toolbar per row.
	 *
	 * Notes live in this browser for now. There is no notes collection
	 * yet, and the screen says so rather than implying a backend.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import LensSwitch from '$lib/shell/LensSwitch.svelte';
	import { Icon, Note, SectionHead } from '$lib/kit';
	import {
		addAfter,
		indent,
		moveDown,
		moveUp,
		node,
		outdent,
		remove,
		setText
	} from '$lib/outline.svelte.js';

	const LENSES = [
		{ label: 'Notes', href: '/notes', icon: 'notes' },
		{ label: 'Documents', href: '/documents', icon: 'doc' }
	];

	const STORE = 'azbolt.chief.notes';

	const SEED = [
		node('Storage build-out', 0),
		node('Walk the site before Friday', 1),
		node('Carmen has the access code', 2),
		node('Decide on shelving depth', 1),
		node('Questions for the bishop', 0),
		node('Welfare visit — who goes', 1)
	];

	/** @type {{ id: string, text: string, depth: number }[]} */
	let list = $state(load());
	let focusId = $state('');
	/** @type {Record<string, HTMLInputElement>} */
	let els = {};

	function load() {
		try {
			const raw = localStorage.getItem(STORE);
			if (raw) {
				const parsed = JSON.parse(raw);
				if (Array.isArray(parsed) && parsed.length) return parsed;
			}
		} catch {
			// Private windows and blocked site data both throw here. An
			// outline that starts from the seed is a working outline.
		}
		return SEED;
	}

	$effect(() => {
		try {
			localStorage.setItem(STORE, JSON.stringify(list));
		} catch {
			// Nothing to do about it, and nothing worth interrupting for.
		}
	});

	/** @param {string} id */
	async function focus(id) {
		focusId = id;
		await Promise.resolve();
		els[id]?.focus();
	}

	/** @param {string} id */
	function add(id) {
		const r = addAfter(list, id);
		list = r.list;
		focus(r.id);
	}

	/** @param {string} id */
	function del(id) {
		const i = list.findIndex((n) => n.id === id);
		const next = list[i - 1]?.id ?? list[i + 1]?.id ?? '';
		list = remove(list, id);
		if (!list.length) list = [node('', 0)];
		focus(next || list[0].id);
	}

	/** @param {KeyboardEvent} e @param {string} id */
	function keys(e, id) {
		if (e.key === 'Enter') {
			e.preventDefault();
			add(id);
		} else if (e.key === 'Tab') {
			e.preventDefault();
			list = e.shiftKey ? outdent(list, id) : indent(list, id);
		} else if (e.key === 'Backspace' && !list.find((n) => n.id === id)?.text) {
			e.preventDefault();
			del(id);
		}
	}
</script>

<svelte:head><title>Notes · Chief</title></svelte:head>

<Screen>
	<LensSwitch label="Sphere view" items={LENSES} at="/notes" />

	<SectionHead label="Notes" t="cool" count={list.length} />

	<ol class="outline">
		{#each list as n (n.id)}
			<li style="--d:{n.depth}" class:on={focusId === n.id}>
				<span class="bullet" aria-hidden="true"></span>
				<input
					bind:this={els[n.id]}
					value={n.text}
					placeholder="Empty line"
					oninput={(e) => (list = setText(list, n.id, e.currentTarget.value))}
					onfocus={() => (focusId = n.id)}
					onkeydown={(e) => keys(e, n.id)}
					aria-label="Note, level {n.depth + 1}"
				/>
			</li>
			{#if focusId === n.id}
				<li class="tools" style="--d:{n.depth}">
					<button type="button" onclick={() => (list = outdent(list, n.id))} aria-label="Outdent">
						&lt;
					</button>
					<button type="button" onclick={() => (list = indent(list, n.id))} aria-label="Indent">
						&gt;
					</button>
					<button type="button" onclick={() => (list = moveUp(list, n.id))} aria-label="Move up">
						↑
					</button>
					<button
						type="button"
						onclick={() => (list = moveDown(list, n.id))}
						aria-label="Move down"
					>
						↓
					</button>
					<button type="button" onclick={() => add(n.id)} aria-label="Add line">+</button>
					<button type="button" class="del" onclick={() => del(n.id)} aria-label="Delete line">
						×
					</button>
				</li>
			{/if}
		{/each}
	</ol>

	<button class="append" type="button" onclick={() => add(list[list.length - 1]?.id ?? '')}>
		<Icon name="notes" size={16} /> Add a line
	</button>

	<Note>
		Enter adds a line, Tab indents, Shift-Tab outdents, Backspace on an empty line deletes it.
		Deleting a line keeps whatever was filed under it, one level up. Notes are held in this browser
		until there is somewhere to put them.
	</Note>
</Screen>

<style>
	.outline {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 1px;
		border: 1px solid var(--glass-line);
		border-radius: 12px;
		overflow: hidden;
		background: var(--glass);
		backdrop-filter: blur(14px) saturate(1.15);
		-webkit-backdrop-filter: blur(14px) saturate(1.15);
		box-shadow: var(--glass-shadow);
	}
	li {
		display: flex;
		align-items: center;
		gap: 9px;
		background: var(--card);
		/* Indent is drawn, not stored as padding on the text, so the
		   bullet column stays aligned with its own level. */
		padding-left: calc(13px + var(--d) * 18px);
	}
	li.on {
		background: var(--tone-cool-tint);
	}
	.bullet {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--ink-4);
		flex: none;
	}
	li.on .bullet {
		background: var(--tone-cool);
	}
	input {
		flex: 1;
		min-width: 0;
		min-height: 42px;
		border: 0;
		background: transparent;
		padding: 0 13px 0 0;
		font-family: inherit;
		font-size: 14px;
		color: var(--ink);
	}
	input:focus {
		outline: none;
	}
	input::placeholder {
		color: var(--ink-4);
	}
	.tools {
		gap: 5px;
		padding: 5px 9px 7px calc(13px + var(--d) * 18px);
		background: var(--tone-cool-tint);
	}
	.tools button {
		min-width: 38px;
		min-height: 34px;
		border: 1px solid var(--line-2);
		border-radius: 9px;
		background: var(--card);
		font-family: var(--font-mono);
		font-size: 14px;
		font-weight: 700;
		color: var(--ink-2);
		cursor: pointer;
	}
	.tools .del {
		margin-left: auto;
		color: var(--tone-alert);
		border-color: var(--tone-alert-tint);
	}
	.append {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 9px;
		min-height: var(--tap-min);
		border: 1px dashed rgba(255, 255, 255, 0.55);
		border-radius: 11px;
		background: rgba(255, 255, 255, 0.14);
		font-family: inherit;
		font-size: 13.5px;
		font-weight: 600;
		color: var(--on-field);
		cursor: pointer;
	}
</style>
