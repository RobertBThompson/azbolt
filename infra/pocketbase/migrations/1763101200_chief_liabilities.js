// PocketBase runs these in its own JS runtime, where `migrate`,
// `Collection` and `app` are globals. They are not Node modules.

/**
 * Liabilities — what is owed, by which organization.
 *
 * The borrower is always an organization: a person owes through their
 * own, the same way they own through it. The lender and the asset it
 * is secured on are optional, because a debt half tied in is still a
 * debt and still counts against net worth.
 *
 * Every amount is whole cents. `rate` is a percentage and `months` a
 * count, so neither is. `due_day` is the day of the month a payment
 * falls on; the schedule counts from `started`, and a 31st falls on
 * the last day of a shorter month.
 */
migrate(
	function (app) {
		if (exists(app, 'liabilities')) return;
		const users = app.findCollectionByNameOrId('users');
		const orgs = app.findCollectionByNameOrId('organizations');
		const assets = app.findCollectionByNameOrId('assets');
		const cents = (name) => ({ name, type: 'number', onlyInt: true, min: 0 });
		const collection = new Collection({
			name: 'liabilities',
			type: 'base',
			listRule: 'owner = @request.auth.id',
			viewRule: 'owner = @request.auth.id',
			createRule: "@request.auth.id != '' && owner = @request.auth.id",
			updateRule: 'owner = @request.auth.id',
			deleteRule: 'owner = @request.auth.id',
			fields: [
				{ name: 'name', type: 'text', required: true, presentable: true, max: 160 },
				{ name: 'type', type: 'text', max: 60 },
				{
					name: 'borrower',
					type: 'relation',
					required: true,
					maxSelect: 1,
					cascadeDelete: false,
					collectionId: orgs.id
				},
				{
					name: 'lender',
					type: 'relation',
					maxSelect: 1,
					cascadeDelete: false,
					collectionId: orgs.id
				},
				{
					name: 'asset',
					type: 'relation',
					maxSelect: 1,
					cascadeDelete: false,
					collectionId: assets.id
				},
				cents('start_amount'),
				cents('balance'),
				cents('payment'),
				{ name: 'currency', type: 'text', required: true, min: 3, max: 3 },
				{ name: 'rate', type: 'number', min: 0 },
				{
					name: 'frequency',
					type: 'select',
					maxSelect: 1,
					values: ['Monthly', 'Quarterly', 'Yearly']
				},
				{ name: 'months', type: 'number', onlyInt: true, min: 0 },
				{ name: 'due_day', type: 'number', onlyInt: true, min: 0, max: 31 },
				{ name: 'started', type: 'date' },
				{ name: 'notes', type: 'text', max: 2000 },
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
			indexes: ['CREATE INDEX idx_liabilities_owner ON liabilities (owner)']
		});
		app.save(collection);
	},
	function (app) {
		app.delete(app.findCollectionByNameOrId('liabilities'));
	}
);

function exists(app, name) {
	try {
		return !!app.findCollectionByNameOrId(name);
	} catch (err) {
		return false;
	}
}
