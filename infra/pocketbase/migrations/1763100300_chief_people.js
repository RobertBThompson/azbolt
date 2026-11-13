// PocketBase runs these in its own JS runtime, where `migrate`,
// `Collection` and `app` are globals. They are not Node modules.

/**
 * People — everyone the Chief deals with.
 *
 * A person is never an asset. A person can stand behind an
 * organization, and the contract that binds them is an asset, but the
 * person is not.
 *
 * A person belongs to as many spheres as they belong to: a brother who
 * works in the business is in Family and in Business, and asking which
 * one he "really" is in is the wrong question.
 */
migrate(
	function (app) {
		if (exists(app, 'people')) return;
		const users = app.findCollectionByNameOrId('users');
		const spheres = app.findCollectionByNameOrId('spheres');
		const orgs = app.findCollectionByNameOrId('organizations');
		const collection = new Collection({
			name: 'people',
			type: 'base',
			listRule: 'owner = @request.auth.id',
			viewRule: 'owner = @request.auth.id',
			createRule: "@request.auth.id != '' && owner = @request.auth.id",
			updateRule: 'owner = @request.auth.id',
			deleteRule: 'owner = @request.auth.id',
			fields: [
				{ name: 'first_name', type: 'text', required: true, presentable: true, max: 80 },
				{ name: 'last_name', type: 'text', max: 80 },
				{ name: 'role', type: 'text', max: 120 },
				{ name: 'relationship', type: 'text', max: 60 },
				{ name: 'email', type: 'email' },
				{ name: 'phone', type: 'text', max: 40 },
				{ name: 'notes', type: 'text', max: 2000 },
				{
					name: 'organization',
					type: 'relation',
					maxSelect: 1,
					cascadeDelete: false,
					collectionId: orgs.id
				},
				{
					name: 'spheres',
					type: 'relation',
					maxSelect: 20,
					cascadeDelete: false,
					collectionId: spheres.id
				},
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
				'CREATE INDEX idx_people_owner ON people (owner)',
				'CREATE INDEX idx_people_organization ON people (organization)'
			]
		});
		app.save(collection);
	},
	function (app) {
		app.delete(app.findCollectionByNameOrId('people'));
	}
);

function exists(app, name) {
	try {
		return !!app.findCollectionByNameOrId(name);
	} catch (err) {
		return false;
	}
}
