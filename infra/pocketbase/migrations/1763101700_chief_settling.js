// PocketBase runs these in its own JS runtime, where `migrate`,
// `Collection` and `app` are globals. They are not Node modules.

/**
 * Settling — recording that expected money actually moved.
 *
 * A repeating entry is one record, and its later dates are worked out,
 * not stored. When one of those dates is paid, that is a new entry of
 * its own — money that moved, on the day it moved — and it says which
 * line and which month it settles, so that month stops showing as owed.
 *
 * `settles` is the repeating entry; `period` is the month settled, as
 * YYYY-MM. `liability` ties a payment to the debt it paid down.
 */
migrate(
	function (app) {
		const cash = app.findCollectionByNameOrId('cash_entries');
		const liabilities = app.findCollectionByNameOrId('liabilities');
		let changed = false;
		if (!cash.fields.getByName('settles')) {
			cash.fields.add(
				new RelationField({
					name: 'settles',
					maxSelect: 1,
					cascadeDelete: false,
					collectionId: cash.id
				})
			);
			changed = true;
		}
		if (!cash.fields.getByName('period')) {
			cash.fields.add(new TextField({ name: 'period', max: 7 }));
			changed = true;
		}
		if (!cash.fields.getByName('liability')) {
			cash.fields.add(
				new RelationField({
					name: 'liability',
					maxSelect: 1,
					cascadeDelete: false,
					collectionId: liabilities.id
				})
			);
			changed = true;
		}
		if (changed) app.save(cash);
	},
	function (app) {
		const cash = app.findCollectionByNameOrId('cash_entries');
		for (const name of ['settles', 'period', 'liability']) cash.fields.removeByName(name);
		app.save(cash);
	}
);
