/**
 * Tone answers "what is this screen asking of you", never "which section
 * is this". The tokens live in packages/config/tokens.css.
 */
/** @type {Record<string, { ink: string, tint: string }>} */
export const TONE = {
	neutral: { ink: 'var(--tone-graphite)', tint: 'var(--tone-graphite-tint)' },
	cool: { ink: 'var(--tone-cool)', tint: 'var(--tone-cool-tint)' },
	ai: { ink: 'var(--tone-ai)', tint: 'var(--tone-ai-tint)' },
	warm: { ink: 'var(--tone-clay)', tint: 'var(--tone-clay-tint)' },
	alert: { ink: 'var(--tone-alert)', tint: 'var(--tone-alert-tint)' },
	brand: { ink: 'var(--tone-brand)', tint: 'var(--tone-brand-tint)' }
};

/**
 * Unknown keys fall back to neutral rather than throwing, because a tone
 * is decoration and a typo should not blank a screen. The trade is that a
 * wrong key is invisible, so the valid set is: neutral, cool, ai, warm,
 * alert, brand. There is no 'clay' or 'graphite' key — those are token names.
 *
 * @param {keyof typeof TONE | string} t
 */
export const tone = (t) => TONE[t] ?? TONE.neutral;
