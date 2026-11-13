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
	<div class="rel edged" style="--t:var(--tone-{rel.tone})">
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
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 31px;
		line-height: 1.1;
		color: var(--on-field);
		letter-spacing: -0.015em;
		text-shadow: var(--on-field-shade);
	}
	.who p {
		margin: 3px 0 0;
		font-size: 16px;
		color: var(--on-field-2);
	}
	.note {
		margin: 0;
		font-size: 14px;
		line-height: 1.45;
		color: var(--ink-2);
		background: var(--glass-dim);
		border-radius: var(--r-xs);
		padding: 9px 13px;
		box-shadow: inset 3px 0 0 rgba(255, 255, 255, 0.95);
	}
	.picks {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.pick {
		display: flex;
		align-items: center;
		gap: 6px;
		min-height: 38px;
		padding: 0 14px;
		border-radius: 999px;
		border: 1px solid var(--glass-line);
		background: var(--glass);
		font-family: var(--font-label);
		font-size: 12.5px;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: var(--ink-3);
		cursor: pointer;
		box-shadow:
			inset 0 1px 0 #ffffff,
			0 4px 10px -5px rgba(30, 20, 90, 0.45);
	}
	.pick.on {
		border-color: color-mix(in srgb, var(--tone-cool) 55%, #ffffff);
		background: linear-gradient(180deg, #ffffff 0%, var(--tone-cool-tint) 100%);
		color: var(--tone-cool);
		box-shadow:
			inset 0 1px 0 #ffffff,
			0 0 0 3px color-mix(in srgb, var(--tone-cool) 16%, transparent),
			0 5px 12px -5px color-mix(in srgb, var(--tone-cool) 60%, transparent);
	}
	.pick.add {
		border: 1.5px dashed rgba(255, 255, 255, 0.9);
		background: rgba(255, 255, 255, 0.16);
		box-shadow: none;
		color: var(--on-field);
	}
	.sw {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		box-shadow:
			inset 0 1px 1px rgba(255, 255, 255, 0.55),
			0 1px 3px rgba(30, 20, 90, 0.35);
	}
	.new {
		display: flex;
		gap: 5px;
	}
	.new input {
		min-height: 38px;
		width: 150px;
		border: 1px solid var(--glass-line);
		border-radius: 999px;
		padding: 0 14px;
		font-family: inherit;
		font-size: 16px;
		background: var(--glass);
		color: var(--ink);
		box-shadow: var(--glass-shadow);
	}
	.new button {
		min-height: 38px;
		padding: 0 16px;
		border: 0;
		border-radius: 999px;
		background: var(--gloss), linear-gradient(118deg, #4b8dd3 0%, #2f6aa8 45%, #204d7b 100%);
		color: #fff;
		font-family: var(--font-display);
		font-size: 14.5px;
		font-weight: 700;
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.6),
			0 8px 16px -8px rgba(32, 77, 123, 0.9);
	}
	.new button:disabled {
		opacity: 0.45;
	}

	.rel {
		border: 1px solid var(--glass-line);
		border-radius: var(--r-md);
		background: var(--glass);
		padding: 14px 16px 14px 20px;
		box-shadow: var(--glass-shadow);
		--edge-ink: var(--t);
	}
	.says {
		margin: 0;
		font-size: 18px;
		font-weight: 700;
		color: var(--t);
		font-family: var(--font-display);
	}
	.act {
		margin: 3px 0 9px;
		font-size: 14.5px;
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
		font-family: var(--font-label);
		font-size: 11.5px;
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
	.acts {
		display: flex;
		flex-direction: column;
		gap: 9px;
	}
	.act-btn {
		display: flex;
		align-items: center;
		gap: 10px;
		min-height: var(--tap-min);
		padding: 0 16px;
		border: 1px solid var(--glass-line);
		border-radius: var(--r-sm);
		background: var(--glass);
		font-size: 16px;
		font-weight: 600;
		color: var(--ink-2);
		text-decoration: none;
		box-shadow: var(--glass-shadow);
	}
	.contact {
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
</style>
