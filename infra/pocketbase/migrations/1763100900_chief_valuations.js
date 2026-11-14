// PocketBase runs these in its own JS runtime, where `migrate`,
// `Collection` and `app` are globals. They are not Node modules.

/**
 * Valuations — what an asset was worth, and on what day.
 *
 * Kept as a list rather than one figure on the asset, because the
 * question "what is it worth" always has "as of when" behind it, and
 * the answer a year ago is worth keeping when the answer changes.
 *
 * `amount` is whole cents with its currency beside it. Dollars as
 * decimals drift by a cent when they are added up; cents do not.
 * It is not marked required because PocketBase reads a required
 * number as "not zero", and nothing is a fair value for some things.
 */
migrate(
	function (app) {
		if (exists(app, 'valuations')) return;
		const users = app.findCollectionByNameOrId('users');
		const assets = app.findCollectionByNameOrId('assets');
		const collection = new Collection({
			name: 'valuations',
			type: 'base',
			listRule: 'owner = @request.auth.id',
			viewRule: 'owner = @request.auth.id',
			createRule: "@request.auth.id != '' && owner = @request.auth.id",
			updateRule: 'owner = @request.auth.id',
			deleteRule: 'owner = @request.auth.id',
			fields: [
				{
					name: 'asset',
					type: 'relation',
					required: true,
					maxSelect: 1,
					cascadeDelete: true,
					collectionId: assets.id
				},
				{ name: 'amount', type: 'number', onlyInt: true, min: 0 },
				{ name: 'currency', type: 'text', required: true, min: 3, max: 3 },
				{ name: 'valued_on', type: 'date', required: true },
				{ name: 'note', type: 'text', max: 240 },
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
			indexes: ['CREATE INDEX idx_valuations_asset ON valuations (asset, valued_on)']
		});
		app.save(collection);
	},
	function (app) {
		app.delete(app.findCollectionByNameOrId('valuations'));
	}
);

function exists(app, name) {
	try {
		return !!app.findCollectionByNameOrId(name);
	} catch (err) {
		return false;
	}
}
