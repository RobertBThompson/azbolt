// PocketBase runs these in its own JS runtime, where `migrate`,
// `Collection` and `app` are globals. They are not Node modules.

/**
 * Cash entries — money in and out, by organization.
 *
 * `type` is one of the seven cash types, and it is what keeps money
 * that has moved apart from money that is only expected. Only Cash In
 * and Actual Expense have moved; nothing else is counted in cash in,
 * cash out or net. Cash is out when it is paid, not when it is owed.
 *
 * An entry is one dated fact. One that repeats says how often, and the
 * app works out the later dates from this one; those are shown as
 * expected and never counted until each is recorded as having happened.
 *
 * `amount` is whole cents and always positive. The direction is in the
 * type, so there is one way to say a thing went out.
 */
migrate(
	function (app) {
		if (exists(app, 'cash_entries')) return;
		const users = app.findCollectionByNameOrId('users');
		const orgs = app.findCollectionByNameOrId('organizations');
		const collection = new Collection({
			name: 'cash_entries',
			type: 'base',
			listRule: 'owner = @request.auth.id',
			viewRule: 'owner = @request.auth.id',
			createRule: "@request.auth.id != '' && owner = @request.auth.id",
			updateRule: 'owner = @request.auth.id',
			deleteRule: 'owner = @request.auth.id',
			fields: [
				{ name: 'label', type: 'text', required: true, presentable: true, max: 160 },
				{
					name: 'organization',
					type: 'relation',
					required: true,
					maxSelect: 1,
					cascadeDelete: false,
					collectionId: orgs.id
				},
				{
					name: 'type',
					type: 'select',
					required: true,
					maxSelect: 1,
					values: [
						'Cash In',
						'Cash Receivable',
						'Cash Projected',
						'Actual Expense',
						'Accrued Expense',
						'Projected Expense',
						'Payable'
					]
				},
				{ name: 'category', type: 'text', max: 80 },
				{ name: 'amount', type: 'number', onlyInt: true, min: 0 },
				{ name: 'currency', type: 'text', required: true, min: 3, max: 3 },
				{
					name: 'frequency',
					type: 'select',
					maxSelect: 1,
					values: ['Once', 'Monthly', 'Quarterly', 'Yearly']
				},
				{ name: 'date', type: 'date', required: true },
				{ name: 'archived', type: 'date' },
				{
					name: 'owner',
					type: 'relation',
					required: true,
					maxSelect: 1,
					cascadeDelete: true,
					collectionId: users.id
				},
				{ name: 'created', type: 'autodate', onCreate: true },
				{ name: 'updated', type: 'autodate', onCreate: true, onUpdate: true }
			],
			indexes: ['CREATE INDEX idx_cash_entries_owner_date ON cash_entries (owner, date)']
		});
		app.save(collection);
	},
	function (app) {
		app.delete(app.findCollectionByNameOrId('cash_entries'));
	}
);

function exists(app, name) {
	try {
		return !!app.findCollectionByNameOrId(name);
	} catch (err) {
		return false;
	}
}
