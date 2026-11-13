// PocketBase runs these in its own JS runtime, where `migrate`,
// `Collection` and `app` are globals. They are not Node modules.

/**
 * Spheres — the areas of a life.
 *
 * A sphere is Family, Business, Church, Career; it is not a company.
 * The collection that used to carry this name held company, holding,
 * nonprofit and dao, which is the organization type list in the wrong
 * place. Organizations are their own collection, with the nine type
 * codes, in the migration after this one.
 *
 * Retired rather than deleted: a sphere that held records for years
 * should stop being offered without taking its history with it.
 */
migrate(
	function (app) {
		if (exists(app, 'spheres')) return;
		const users = app.findCollectionByNameOrId('users');
		const collection = new Collection({
			name: 'spheres',
			type: 'base',
			listRule: 'owner = @request.auth.id',
			viewRule: 'owner = @request.auth.id',
			createRule: "@request.auth.id != '' && owner = @request.auth.id",
			updateRule: 'owner = @request.auth.id',
			deleteRule: 'owner = @request.auth.id',
			fields: [
				{ name: 'name', type: 'text', required: true, presentable: true, max: 60 },
				{ name: 'blurb', type: 'text', max: 240 },
				{ name: 'hue', type: 'text', max: 32 },
				{ name: 'retired', type: 'bool' },
				{
					name: 'owner',
					type: 'relation',
					required: true,
					maxSelect: 1,
					cascadeDelete: true,
					collectionId: users.id
				}
			],
			indexes: ['CREATE UNIQUE INDEX idx_spheres_owner_name ON spheres (owner, name)']
		});
		app.save(collection);
	},
	function (app) {
		app.delete(app.findCollectionByNameOrId('spheres'));
	}
);

/**
 * True when a collection is already there. Chief's first instances were
 * built by hand through the dashboard, so a migration that assumed an
 * empty database would fail on the very servers it was written for.
 */
function exists(app, name) {
	try {
		return !!app.findCollectionByNameOrId(name);
	} catch (err) {
		return false;
	}
}
