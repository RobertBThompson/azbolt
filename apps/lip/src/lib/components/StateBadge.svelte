<script>
	/**
	 * Six states. Each pairs a shape/stroke treatment with the word itself —
	 * color never carries the meaning alone, and no state has a unique hue.
	 * Stroke weight is 1.5px minimum so dashed/solid/struck stay legible at
	 * caption size on a real device.
	 *
	 * @type {{ state: 'proposed'|'review'|'contested'|'locked'|'reopened'|'withdrawn' }}
	 */
	let { state } = $props();

	const words = {
		proposed: 'Proposed',
		review: 'Under review',
		contested: 'Contested',
		locked: 'Locked',
		reopened: 'Reopened',
		withdrawn: 'Withdrawn'
	};
</script>

<span class="badge {state}">{words[state]}</span>

<style>
	.badge {
		display: inline-flex;
		align-items: center;
		font: 700 8px var(--font-sans);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: 3px 7px;
		border-radius: 20px;
		white-space: nowrap;
	}
	.proposed {
		border: 1.5px dashed var(--muted);
		color: var(--muted);
	}
	.review {
		border: 1.5px solid var(--ink);
		color: var(--ink);
	}
	.contested {
		border: 1.5px solid var(--ink);
		background: repeating-linear-gradient(45deg, #efeee8 0 4px, #e2e0d7 4px 8px);
		color: var(--ink);
	}
	.locked {
		background: var(--ink);
		color: #fff;
	}
	.reopened {
		border: 1.5px solid var(--ink);
		border-bottom-width: 3px;
		color: var(--ink);
	}
	.withdrawn {
		border: 1.5px solid var(--line);
		color: var(--muted-2);
		text-decoration: line-through;
	}
</style>
