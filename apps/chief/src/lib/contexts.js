/**
 * F0 Shell & Context — the six contexts from the v3 experience map.
 * A branch may read the active context and may never read another
 * branch's context. That single rule is what keeps the shell a frame
 * rather than a dependency.
 */
/** @type {Record<string, { name: string, swatch: string }>} */
export const CONTEXTS = {
	all: { name: 'ALL LIFE', swatch: 'var(--ctx-all)' },
	azbolt: { name: 'AZBOLT', swatch: 'var(--ctx-azbolt)' },
	tn: { name: 'TN HOLDINGS', swatch: 'var(--ctx-tn)' },
	ame: { name: 'AME', swatch: 'var(--ctx-ame)' },
	personal: { name: 'PERSONAL', swatch: 'var(--ctx-personal)' },
	account: { name: 'ACCOUNT', swatch: 'var(--ctx-account)' }
};
