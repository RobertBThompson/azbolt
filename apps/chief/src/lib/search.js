/**
 * Search: one question asked of every kind of record at once.
 *
 * Every word typed has to be found somewhere in a record for it to
 * match, in any order, so "house note" finds "Note on the house". A
 * match in the name counts for more than one in the small print, and
 * names that begin with what was typed come first.
 */

/**
 * @typedef {{
 *   kind: 'Person'|'Organization'|'Asset'|'Liability'|'Task'|'Endeavor'|'Jot',
 *   group: 'People'|'Work'|'Assets',
 *   href: string, title: string, meta: string, text?: string
 * }} Findable  `text` is extra small print to search that is not shown
 */

/** @param {string} s */
const plain = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/**
 * @param {Findable[]} items
 * @param {string} query
 * @param {string} [group]  'All', or one of the groups
 * @returns {Findable[]}
 */
export function find(items, query, group = 'All') {
	const words = plain(query).split(/\s+/).filter(Boolean);
	if (!words.length) return [];
	/** @type {{ item: Findable, score: number, at: number }[]} */
	const hits = [];
	items.forEach((item, at) => {
		if (group !== 'All' && item.group !== group) return;
		const title = plain(item.title);
		const rest = plain(`${item.meta} ${item.text ?? ''}`);
		let score = 0;
		for (const w of words) {
			if (title.startsWith(w)) score += 4;
			else if (title.includes(` ${w}`)) score += 3;
			else if (title.includes(w)) score += 2;
			else if (rest.includes(w)) score += 1;
			else return;
		}
		hits.push({ item, score, at });
	});
	return hits.sort((a, b) => b.score - a.score || a.at - b.at).map((h) => h.item);
}
