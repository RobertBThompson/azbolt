/**
 * Position instrument v1.4.
 *
 * Plain language only. No matrix, no confidence math, no quorum — the
 * instrument screens are deliberately the only screens in LIP with no
 * score on them.
 *
 * Each position is written as its own adherents would state it, not as an
 * opponent would characterise it. An instrument that strawmans one end
 * measures the instrument, not the respondent.
 *
 * Answers map onto the same continuous -5..+5 scale used everywhere else;
 * the five bins are a display convention over that continuum.
 */

export const INSTRUMENT_VERSION = 'v1.4';

/** Bin → continuous value. */
export const BIN_VALUES = { L: -5, CL: -2.5, C: 0, CR: 2.5, R: 5 };

export const BINS = /** @type {const} */ (['L', 'CL', 'C', 'CR', 'R']);

/**
 * @typedef {object} Issue
 * @property {string} id
 * @property {'fiscal' | 'social'} axis
 * @property {string} title
 * @property {string} question
 * @property {Record<string, string>} definitions
 */

/** @type {Issue[]} */
export const issues = [
	{
		id: 'taxation',
		axis: 'fiscal',
		title: 'Taxation',
		question: 'Who should carry how much of the tax burden?',
		definitions: {
			L: 'Rates should rise substantially on high incomes and accumulated wealth, to fund public services and narrow inequality.',
			CL: 'The system should be more progressive than it is now, with higher rates at the top and relief lower down.',
			C: 'The current balance is roughly right. Changes should be incremental and revenue-neutral.',
			CR: 'Rates should come down and the code should be simpler, with fewer targeted deductions and carve-outs.',
			R: 'Taxes should be cut substantially. Lower rates and a broader base leave more capital in productive hands.'
		}
	},
	{
		id: 'spending',
		axis: 'fiscal',
		title: 'Public spending and the safety net',
		question: 'What should government provide directly?',
		definitions: {
			L: 'Expand public programs — healthcare, housing, income support — toward universal entitlements.',
			CL: 'Strengthen and extend the existing safety net, closing gaps in who it reaches.',
			C: 'Keep current programs about as they are, focusing on making them work better rather than resizing them.',
			CR: 'Target assistance more narrowly to those in greatest need, and tie it to work where possible.',
			R: 'Shrink federal programs, returning responsibility to states, communities, families and individuals.'
		}
	},
	{
		id: 'regulation',
		axis: 'fiscal',
		title: 'Regulation of business',
		question: 'How closely should markets be supervised?',
		definitions: {
			L: 'Markets need substantially stronger public oversight on labor, environment and consolidation.',
			CL: 'Add targeted regulation where markets demonstrably harm people, and enforce what exists.',
			C: 'Keep oversight near current levels and judge individual rules on their merits.',
			CR: 'Reduce the regulatory burden, especially on small business, and simplify compliance.',
			R: 'Remove most regulation. Competition and liability discipline firms more effectively than agencies do.'
		}
	},
	{
		id: 'institutions',
		axis: 'social',
		title: 'Institutions and social standards',
		question: 'What stance should schools, employers and civic institutions take on contested social questions?',
		definitions: {
			L: 'Institutions should actively advance inclusion, with standards set and enforced consistently across them.',
			CL: 'Institutions should hold inclusive standards, with room for local variation in how they are applied.',
			C: 'Institutions should stay largely neutral on contested social questions and leave them to individuals.',
			CR: 'Institutions should defer to the traditions and norms of the communities they actually serve.',
			R: 'Institutions should uphold traditional moral standards explicitly, as part of their purpose.'
		}
	},
	{
		id: 'immigration',
		axis: 'social',
		title: 'Immigration',
		question: 'What should admission and enforcement look like?',
		definitions: {
			L: 'Expand legal immigration substantially and open broad paths to status for people already settled here.',
			CL: 'Increase legal immigration and offer a path to status for long-settled residents, with orderly processing.',
			C: 'Hold overall levels roughly where they are while improving processing times and consistent enforcement.',
			CR: 'Reduce overall levels, prioritise enforcement, and select more on skills and sponsorship.',
			R: 'Sharply reduce immigration and enforce existing law strictly, with admission as a privilege, not a default.'
		}
	},
	{
		id: 'justice',
		axis: 'social',
		title: 'Criminal justice',
		question: 'Where should the emphasis fall?',
		definitions: {
			L: 'Shift substantially from incarceration toward prevention, treatment, and reentry support.',
			CL: 'Reduce sentences for non-violent offenses and invest more in alternatives to prison.',
			C: 'Balance enforcement and reform, judging individual changes case by case.',
			CR: 'Prioritise enforcement and restitution to victims, with reform at the margins.',
			R: 'Strengthen enforcement and sentencing. Consistent consequences are the primary deterrent.'
		}
	}
];

/**
 * Average the answers on each axis onto the continuous scale.
 * Unanswered issues are skipped rather than counted as Center — treating a
 * skip as a zero would quietly pull every partial result toward the middle.
 *
 * @param {Record<string, string>} answers  issue id → bin
 */
export function computePosition(answers) {
	/** @param {'fiscal'|'social'} axis */
	const axisScore = (axis) => {
		const vals = issues
			.filter((i) => i.axis === axis && answers[i.id])
			.map((i) => BIN_VALUES[/** @type {keyof typeof BIN_VALUES} */ (answers[i.id])]);
		if (!vals.length) return 0;
		return vals.reduce((a, b) => a + b, 0) / vals.length;
	};

	const answered = issues.filter((i) => answers[i.id]).length;

	return {
		fiscal: Number(axisScore('fiscal').toFixed(2)),
		social: Number(axisScore('social').toFixed(2)),
		/** Share of the instrument actually completed. */
		coverage: Math.round((answered / issues.length) * 100),
		instrumentVersion: INSTRUMENT_VERSION
	};
}
