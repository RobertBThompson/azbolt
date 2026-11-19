// PocketBase runs these in its own JS runtime, where `migrate`,
// `Collection` and `app` are globals. They are not Node modules.

/**
 * Ownerships — who holds what, and how much of it.
 *
 * Each end is an organization or an asset, so each end has two
 * fields and exactly one of the pair is filled. The holder is never a
 * person: a person is an organization of type C, and that is what
 * holds.
 *
 * `units` is the share, out of the units the held asset is divided
 * into (10,000 unless it says otherwise), or out of 10,000 for an
 * organization. The link carries only the share: what the share is
 * worth is worked out from the asset's own dated value, so the two
 * cannot come to disagree. A manager or guarantor holds no share and
 * has no units.
 *
 * Called holder and held because every record already has an `owner`,
 * which is the account it belongs to.
 */
migrate(
	function (app) {
		if (exists(app, 'ownerships')) return;
		const users = app.findCollectionByNameOrId('users');
		const orgs = app.findCollectionByNameOrId('organizations');
		const assets = app.findCollectionByNameOrId('assets');
		const end = (name, collection) => ({
			name,
			type: 'relation',
			maxSelect: 1,
			cascadeDelete: true,
			collectionId: collection.id
		});
		const collection = new Collection({
			name: 'ownerships',
			type: 'base',
			listRule: 'owner = @request.auth.id',
			viewRule: 'owner = @request.auth.id',
			createRule: "@request.auth.id != '' && owner = @request.auth.id",
			updateRule: 'owner = @request.auth.id',
			deleteRule: 'owner = @request.auth.id',
			fields: [
				end('holder_org', orgs),
				end('holder_asset', assets),
				end('held_org', orgs),
				end('held_asset', assets),
				{
					name: 'role',
					type: 'select',
					required: true,
					maxSelect: 1,
					values: ['Owner', 'Manager', 'Guarantor']
				},
				{ name: 'units', type: 'number', onlyInt: true, min: 0 },
				{ name: 'since', type: 'date' },
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
			indexes: ['CREATE INDEX idx_ownerships_owner ON ownerships (owner)']
		});
		app.save(collection);
	},
	function (app) {
		app.delete(app.findCollectionByNameOrId('ownerships'));
	}
);

function exists(app, name) {
	try {
		return !!app.findCollectionByNameOrId(name);
	} catch (err) {
		return false;
	}
}
