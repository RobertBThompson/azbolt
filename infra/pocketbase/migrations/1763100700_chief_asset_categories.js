// PocketBase runs these in its own JS runtime, where `migrate`,
// `Collection` and `app` are globals. They are not Node modules.

/**
 * Asset categories — a list the Chief edits, not a fixed set.
 *
 * Real estate and Vehicle are offered to a new account because nearly
 * everyone has them; Livestock is added by the Chief who has cattle.
 * A category is a name and nothing else, so adding one never asks a
 * question the Chief has not thought about yet.
 */
migrate(
	function (app) {
		if (exists(app, 'asset_categories')) return;
		const users = app.findCollectionByNameOrId('users');
		const collection = new Collection({
			name: 'asset_categories',
			type: 'base',
			listRule: 'owner = @request.auth.id',
			viewRule: 'owner = @request.auth.id',
			createRule: "@request.auth.id != '' && owner = @request.auth.id",
			updateRule: 'owner = @request.auth.id',
			deleteRule: 'owner = @request.auth.id',
			fields: [
				{ name: 'name', type: 'text', required: true, presentable: true, max: 80 },
				{ name: 'archived', type: 'date' },
				{
					name: 'owner',
					type: 'relation',
					required: true,
					maxSelect: 1,
					cascadeDelete: true,
					collectionId: users.id
				}
			],
			indexes: [
				'CREATE UNIQUE INDEX idx_asset_categories_owner_name ON asset_categories (owner, name)'
			]
		});
		app.save(collection);
	},
	function (app) {
		app.delete(app.findCollectionByNameOrId('asset_categories'));
	}
);

function exists(app, name) {
	try {
		return !!app.findCollectionByNameOrId(name);
	} catch (err) {
		return false;
	}
}
