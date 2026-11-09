<script>
	/**
	 * F1 Directory — D3 Person.
	 *
	 * Three parts, in the order they matter.
	 *
	 * Spheres first: which areas of this life the person belongs to. More
	 * than one is normal, and a sphere can be invented here — a contact
	 * may sit in an area the Chief does not otherwise deal in, and that
	 * should cost nothing but typing it.
	 *
	 * Relationship second. Chief is not only an asset register; keeping
	 * relationships alive is the other half of the job, and it is the
	 * half that decays silently. So this part is actions, not a score:
	 * what strengthens this relationship next, with the drift stated
	 * plainly when there is drift.
	 *
	 * Contact last. It is the part every address book already does, so it
	 * does not get the top of the screen.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Btn, Icon, SectionHead } from '$lib/kit';
	import { PEOPLE } from '$lib/data.js';
	import { sphereOf, PLACEABLE } from '$lib/spheres.js';
	import { page } from '$app/stores';

	const person = $derived(PEOPLE[$page.params.id ?? ''] ?? PEOPLE.carmen);

	/** @type {string[]} */
	let spheres = $state([]);
	let adding = $state(false);
	let draft = $state('');

	// Re-seed when the route changes to another person.
	$effect(() => {
		spheres = [...(person.spheres ?? [])];
		adding = false;
		draft = '';
	});

	/** @param {string} key */
	function toggle(key) {
		spheres = spheres.includes(key) ? spheres.filter((k) => k !== key) : [...spheres, key];
	}

	function addCustom() {
		const name = draft.trim().toLowerCase();
		if (name && !spheres.includes(name)) spheres = [...spheres, name];
		draft = '';
		adding = false;
	}

	/** Spheres on offer: the Chief's own, plus any this person already has. */
	const offered = $derived([
		...PLACEABLE.filter(([k]) => k !== 'all').map(([k]) => k),
		...spheres.filter((k) => !PLACEABLE.some(([pk]) => pk === k))
	]);

	/**
	 * What the relationship needs, stated as something to do. Drift is
	 * named rather than scored — "six weeks quiet" is actionable in a way
	 * that "strength: 2/5" is not.
	 * @type {Record<string, { tone: string, says: string, act: string }>}
	 */
	const STRENGTH = {
		strong: { tone: 'ai', says: 'Close and current', act: 'Nothing needed. Keep the rhythm.' },
		steady: { tone: 'cool', says: 'Steady', act: 'Next contact is already set.' },
		fading: {
			tone: 'alert',
			says: 'Drifting',
			act: 'No contact scheduled and the gap is growing.'
		},
		new: { tone: 'warm', says: 'New', act: 'One follow-up decides whether this becomes anything.' }
	};
	const rel = $derived(STRENGTH[person.strength] ?? STRENGTH.steady);
</script>

<svelte:head><title>{person.name} · Chief</title></svelte:head>

<Screen back="/people" nav={false}>
	<header class="who">
		<h1>{person.name}</h1>
		<p>{person.role}</p>
	</header>

	<SectionHead label="Spheres" t="cool" count={spheres.length} />
	<p class="note">Someone can belong to several. Add one that does not exist yet if you need to.</p>
	<div class="picks">
		{#each offered as key (key)}
			{@const s = sphereOf(key)}
			<button
				type="button"
				class="pick"
				class:on={spheres.includes(key)}
				aria-pressed={spheres.includes(key)}
				onclick={() => toggle(key)}
			>
				<span class="sw" style="background:{s.swatch}"></span>
				{s.name}
			</button>
		{/each}

		{#if adding}
			<form
				class="new"
				onsubmit={(e) => {
					e.preventDefault();
					addCustom();
				}}
			>
				<!-- svelte-ignore a11y_autofocus -->
				<input
					autofocus
					bind:value={draft}
					placeholder="Australian Rugby"
					aria-label="New sphere name"
				/>
				<button type="submit" disabled={!draft.trim()}>Add</button>
			</form>
		{:else}
			<button type="button" class="pick add" onclick={() => (adding = true)}>+ New sphere</button>
		{/if}
	</div>

	<SectionHead label="Relationship" t={rel.tone} />
	<div class="rel" style="--t:var(--tone-{rel.tone})">
		<p class="says">{rel.says}</p>
		<p class="act">{rel.act}</p>
		<dl class="facts">
			<div>
				<dt>Last</dt>
				<dd>{person.last}</dd>
			</div>
			<div>
				<dt>Next</dt>
				<dd>{person.next}</dd>
			</div>
			<div>
				<dt>Cadence</dt>
				<dd>{person.cadence}</dd>
			</div>
		</dl>
	</div>

	<p class="note">Actions that strengthen this one:</p>
	<div class="acts">
		<a class="act-btn" href="/jot"><Icon name="throw" size={16} /> Jot about {person.first}</a>
		<a class="act-btn" href="/work/tasks/new"><Icon name="task" size={16} /> Set a next step</a>
		<a class="act-btn" href="/work"><Icon name="action" size={16} /> Shared: {person.endeavors}</a>
	</div>

	<SectionHead label="Contact" />
	<dl class="contact">
		<div>
			<dt>Email</dt>
			<dd>{person.email}</dd>
		</div>
		<div>
			<dt>Phone</dt>
			<dd>{person.phone}</dd>
		</div>
		<div>
			<dt>Private notes</dt>
			<dd>{person.notes}</dd>
		</div>
	</dl>

	<Btn primary={false} href="/people" label="Back to people" />
</Screen>

<style>
	.who {
		padding: 2px 2px 0;
	}
	.who h1 {
		margin: 0;
		font-family: var(--font-serif);
		font-weight: 500;
		font-size: 27px;
		line-height: 1.1;
		color: var(--ink);
	}
	.who p {
		margin: 3px 0 0;
		font-size: 13px;
		color: var(--ink-3);
	}
	.note {
		margin: 0 2px;
		font-size: 12px;
		line-height: 1.45;
		color: var(--ink-3);
	}
	.picks {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.pick {
		display: flex;
		align-items: center;
		gap: 6px;
		min-height: 36px;
		padding: 0 11px;
		border-radius: 999px;
		border: 1px solid var(--line-2);
		background: var(--card);
		font-family: var(--font-mono);
		font-size: 9.5px;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: var(--ink-3);
		cursor: pointer;
	}
	.pick.on {
		border-color: var(--tone-cool);
		background: var(--tone-cool-tint);
		color: var(--tone-cool);
	}
	.pick.add {
		border-style: dashed;
	}
	.sw {
		width: 9px;
		height: 9px;
		border-radius: 2px;
	}
	.new {
		display: flex;
		gap: 5px;
	}
	.new input {
		min-height: 36px;
		width: 150px;
		border: 1px solid var(--tone-cool);
		border-radius: 999px;
		padding: 0 12px;
		font-family: inherit;
		font-size: 12.5px;
		background: var(--card);
		color: var(--ink);
	}
	.new button {
		min-height: 36px;
		padding: 0 13px;
		border: 0;
		border-radius: 999px;
		background: var(--tone-cool);
		color: #fff;
		font-family: inherit;
		font-size: 12.5px;
		font-weight: 600;
	}
	.new button:disabled {
		opacity: 0.45;
	}

	.rel {
		border: 1px solid var(--line-3);
		border-left: 4px solid var(--t);
		border-radius: 3px 12px 12px 3px;
		background: var(--card);
		padding: 11px 13px;
	}
	.says {
		margin: 0;
		font-size: 15px;
		font-weight: 600;
		color: var(--t);
	}
	.act {
		margin: 3px 0 9px;
		font-size: 12.5px;
		line-height: 1.45;
		color: var(--ink-2);
	}
	.facts {
		display: flex;
		gap: 16px;
		margin: 0;
	}
	.facts div,
	.contact div {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}
	dt {
		font-family: var(--font-mono);
		font-size: 9px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-4);
	}
	dd {
		margin: 0;
		font-size: 12.5px;
		color: var(--ink);
	}
	.acts {
		display: flex;
		flex-direction: column;
		gap: 7px;
	}
	.act-btn {
		display: flex;
		align-items: center;
		gap: 9px;
		min-height: var(--tap-min);
		padding: 0 13px;
		border: 1px solid var(--line-2);
		border-radius: 11px;
		background: var(--card);
		font-size: 13.5px;
		font-weight: 600;
		color: var(--ink-2);
		text-decoration: none;
	}
	.contact {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin: 0;
		border: 1px solid var(--line-3);
		border-radius: 12px;
		background: var(--card);
		padding: 12px 13px;
	}
</style>
