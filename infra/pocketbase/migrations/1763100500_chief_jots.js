// PocketBase runs these in its own JS runtime, where `migrate`,
// `Collection` and `app` are globals. They are not Node modules.

/**
 * Jots — the first thing Chief has to keep.
 *
 * A jot is a thought said before it is forgotten: no title, no
 * category, nothing to choose. Everything after that is optional.
 * `sphere` is empty until someone places it, which means All life —
 * the default is a real answer, not a blank waiting to be filled —
 * and `sphered` records when that choice was made, so the queue of
 * jots still to place is the ones where it has not been.
 */
migrate(
	function (app) {
		if (exists(app, 'jots')) return;
		const users = app.findCollectionByNameOrId('users');
		const spheres = app.findCollectionByNameOrId('spheres');
		const people = app.findCollectionByNameOrId('people');
		const collection = new Collection({
			name: 'jots',
			type: 'base',
			listRule: 'owner = @request.auth.id',
			viewRule: 'owner = @request.auth.id',
			createRule: "@request.auth.id != '' && owner = @request.auth.id",
			updateRule: 'owner = @request.auth.id',
			deleteRule: 'owner = @request.auth.id',
			fields: [
				{ name: 'text', type: 'text', required: true, presentable: true, max: 2000 },
				{
					name: 'sphere',
					type: 'relation',
					maxSelect: 1,
					cascadeDelete: false,
					collectionId: spheres.id
				},
				{ name: 'sphered', type: 'date' },
				{
					name: 'people',
					type: 'relation',
					maxSelect: 20,
					cascadeDelete: false,
					collectionId: people.id
				},
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
			indexes: ['CREATE INDEX idx_jots_owner_created ON jots (owner, created)']
		});
		app.save(collection);
	},
	function (app) {
		app.delete(app.findCollectionByNameOrId('jots'));
	}
);

function exists(app, name) {
	try {
		return !!app.findCollectionByNameOrId(name);
	} catch (err) {
		return false;
	}
}
