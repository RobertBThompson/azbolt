<script>
	/**
	 * F2 Capture — Sphere It.
	 *
	 * The second of a jot's three stages, and one choice: which
	 * organization this belongs to. That is what puts it in a sphere.
	 * A jot names no sphere itself — the organization is in spheres, and
	 * the jot is wherever its organization is. So a sphere renamed, or
	 * an organization moved between spheres, is changed in one place and
	 * every jot under it follows.
	 *
	 * Your own organization leads the list, because most of what a
	 * person jots is their own business.
	 *
	 * Task It is offered at the end as a choice, not a step. Most jots
	 * are a record of something, not a commitment to do it, and promoting
	 * every jot to a task is how a capture tool turns into a nagging
	 * backlog.
	 */
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Screen from '$lib/shell/Screen.svelte';
	import {
		Blank,
		Btn,
		Delete,
		Note,
		SectionHead,
		SourceNote,
		SphereTags,
		TypeBadge
	} from '$lib/kit';
	import { drop, jotOf, kept, place } from '$lib/jots.svelte.js';

	let { data } = $props();

	const id = $page.params.id ?? '';
	/* Read once. Sphering the jot takes it out of the queue a moment
	   before this screen is left, and the words must not vanish — or
	   fail — in that moment. */
	const found = /** @type {NonNullable<ReturnType<typeof jotOf>>} */ (jotOf(id));
	const jot = { text: found.text, thrown: found.thrown };
	const orgs = $derived(data.orgs.data);

	/** Yours until told otherwise. */
	let org = $state('');
	$effect(() => {
		if (!org) org = orgs.find((o) => o.self)?.id ?? '';
	});
	const chosen = $derived(orgs.find((o) => o.id === org) ?? null);

	let busy = $state(false);
	let fault = $state('');

	async function keep() {
		if (!org) return;
		busy = true;
		fault = '';
		try {
			await place(id, org);
			goto('/');
		} catch (/** @type {any} */ err) {
			fault = err?.message || 'The server did not answer.';
			busy = false;
		}
	}
</script>

<svelte:head><title>Sphere it · Chief</title></svelte:head>

<Screen back="/" nav={false}>
	<blockquote class="jot edged">
		<p>{jot.text}</p>
		<span class="said">Your words, kept exactly · thrown {jot.thrown}</span>
	</blockquote>

	<SectionHead label="Which organization is it for" t="warm" />
	<div class="orgs">
		{#each orgs as o (o.id)}
			<button
				type="button"
				class="pick"
				class:on={org === o.id}
				aria-pressed={org === o.id}
				onclick={() => (org = o.id)}
			>
				<span class="top">
					<TypeBadge code={o.code} showName={false} />
					<span class="nm">{o.name}</span>
					{#if o.self}<span class="you">You</span>{/if}
				</span>
				{#if o.spheres.length}<SphereTags keys={o.spheres} size="sm" />{/if}
			</button>
		{/each}
	</div>
	{#if data.orgs.source !== 'live'}
		<SourceNote source={data.orgs.source} error={data.orgs.error} />
	{/if}

	<div class="done">
		{#if chosen && chosen.spheres.length === 0}
			<Blank>
				{chosen.name} is in no sphere yet, so this will show under All life only. Put the organization
				in a sphere from its own page and this follows it there.
			</Blank>
		{/if}
		{#if fault}<Blank>{fault}</Blank>{/if}
		<Btn t="warm" label={busy ? 'Saving…' : 'Sphere it'} onclick={keep} disabled={busy || !org} />
		<Btn primary={false} href="/" label="Back to your jots" />
		<Btn primary={false} href="/work/tasks/new?jot={id}" label="Task it" />
		<Delete
			what="this jot"
			warn="Your words go with it."
			label="Delete this jot"
			ondelete={async () => {
				await drop(id);
				await goto('/');
			}}
		/>
	</div>

	<Note>
		{#if kept()}
			A jot goes under an organization, and the organization is what sits in a sphere. Change the
			organization's spheres and everything filed under it moves with it.
		{:else}
			You are not signed in, so this is not kept: the jot leaves the list for this visit only.
		{/if}
	</Note>
</Screen>

<style>
	.jot {
		margin: 0;
		background: var(--glass);
		border-radius: var(--r-md);
		padding: 14px 16px 14px 20px;
		border: 1px solid var(--glass-line);
		box-shadow: var(--glass-shadow);
		--edge-ink: var(--tone-clay);
	}
	.jot p {
		margin: 0 0 5px;
		font-family: var(--font-display);
		font-size: 19px;
		line-height: 1.35;
		color: var(--ink);
		font-weight: 600;
	}
	.said {
		font-family: var(--font-label);
		font-size: 13px;
		letter-spacing: 0.05em;
		color: var(--ink-3);
		font-weight: 600;
	}
	.orgs {
		display: flex;
		flex-direction: column;
		gap: 9px;
	}
	.pick {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 7px;
		min-height: var(--tap-min);
		padding: 11px 16px;
		text-align: left;
		border-radius: var(--r-md);
		border: 1px solid var(--glass-line);
		background: var(--glass);
		font-family: inherit;
		font-size: 16px;
		color: var(--ink-2);
		cursor: pointer;
		box-shadow:
			inset 0 1px 0 #ffffff,
			0 6px 14px -6px rgba(30, 20, 90, 0.5);
		font-weight: 500;
	}
	/* Selected state carries a filled background and a heavier border, so
	   it survives being read without colour. */
	.pick.on {
		border-color: color-mix(in srgb, var(--tone-clay) 60%, #ffffff);
		background: linear-gradient(180deg, #ffffff 0%, var(--tone-clay-tint) 100%);
		color: var(--ink);
		font-weight: 700;
		box-shadow:
			inset 0 1px 0 #ffffff,
			inset 0 0 0 1.5px color-mix(in srgb, var(--tone-clay) 60%, transparent),
			0 0 0 3px color-mix(in srgb, var(--tone-clay) 18%, transparent),
			0 8px 16px -8px color-mix(in srgb, var(--tone-clay) 70%, transparent);
	}
	.top {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.nm {
		font-family: var(--font-display);
		font-size: 17px;
	}
	.you {
		margin-left: auto;
		font-family: var(--font-label);
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.1em;
		color: var(--ink-3);
	}
	.done {
		display: flex;
		flex-direction: column;
		gap: 9px;
		padding-top: 6px;
	}
</style>
