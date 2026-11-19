// PocketBase runs these in its own JS runtime, where `migrate`,
// `Collection` and `app` are globals. They are not Node modules.

/**
 * Endeavors — a thing that is to be made true.
 *
 * An endeavor belongs to one organization, and that is how it, and
 * every task under it, comes to be in a sphere. It names none itself.
 *
 * `outcome` is the sentence that will be true when it succeeds, which
 * is what tells an endeavor from a topic.
 */
migrate(
	function (app) {
		if (exists(app, 'endeavors')) return;
		const users = app.findCollectionByNameOrId('users');
		const orgs = app.findCollectionByNameOrId('organizations');
		const collection = new Collection({
			name: 'endeavors',
			type: 'base',
			listRule: 'owner = @request.auth.id',
			viewRule: 'owner = @request.auth.id',
			createRule: "@request.auth.id != '' && owner = @request.auth.id",
			updateRule: 'owner = @request.auth.id',
			deleteRule: 'owner = @request.auth.id',
			fields: [
				{ name: 'name', type: 'text', required: true, presentable: true, max: 160 },
				{ name: 'outcome', type: 'text', max: 400 },
				{
					name: 'organization',
					type: 'relation',
					required: true,
					maxSelect: 1,
					cascadeDelete: false,
					collectionId: orgs.id
				},
				{
					name: 'stage',
					type: 'select',
					required: true,
					maxSelect: 1,
					values: ['Active', 'Planned', 'Done']
				},
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
			indexes: ['CREATE INDEX idx_endeavors_owner ON endeavors (owner)']
		});
		app.save(collection);
	},
	function (app) {
		app.delete(app.findCollectionByNameOrId('endeavors'));
	}
);

function exists(app, name) {
	try {
		return !!app.findCollectionByNameOrId(name);
	} catch (err) {
		return false;
	}
}
