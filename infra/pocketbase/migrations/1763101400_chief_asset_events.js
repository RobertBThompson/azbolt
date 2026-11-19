// PocketBase runs these in its own JS runtime, where `migrate`,
// `Collection` and `app` are globals. They are not Node modules.

/**
 * Asset events — what has happened to a thing.
 *
 * Five of the six kinds are recorded here: acquired, moved,
 * transferred, kept up, let go. The sixth, re-valued, is not: a
 * valuation is its own record, and listing it twice would let the two
 * disagree.
 *
 * An event is a dated line and nothing more. Whatever it changed — the
 * place a thing is kept, who holds it, whether it is held at all — is
 * changed on the record it belongs to. This is the history of that,
 * in the Chief's own words.
 *
 * `amount` is whole cents: what upkeep cost, or what letting go
 * brought in. It is a note on the event, not a cash entry.
 */
migrate(
	function (app) {
		if (exists(app, 'asset_events')) return;
		const users = app.findCollectionByNameOrId('users');
		const assets = app.findCollectionByNameOrId('assets');
		const collection = new Collection({
			name: 'asset_events',
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
				{
					name: 'type',
					type: 'select',
					required: true,
					maxSelect: 1,
					values: ['Acquired', 'Moved', 'Transferred', 'Upkeep', 'Let go']
				},
				{ name: 'detail', type: 'text', max: 240 },
				{ name: 'amount', type: 'number', onlyInt: true, min: 0 },
				{ name: 'currency', type: 'text', max: 3 },
				{ name: 'happened_on', type: 'date', required: true },
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
			indexes: ['CREATE INDEX idx_asset_events_asset ON asset_events (asset, happened_on)']
		});
		app.save(collection);
	},
	function (app) {
		app.delete(app.findCollectionByNameOrId('asset_events'));
	}
);

function exists(app, name) {
	try {
		return !!app.findCollectionByNameOrId(name);
	} catch (err) {
		return false;
	}
}
