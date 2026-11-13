/**
 * Money is two lenses on one door: what moves, and what is owed. They
 * are links, like every other lens switch in the app, so each has an
 * address and the back button means what it says.
 */
export const MONEY_LENSES = [
	{ label: 'Cash flow', href: '/records/money', icon: 'cash' },
	{ label: 'Liabilities', href: '/records/money/liabilities', icon: 'owed' }
];
