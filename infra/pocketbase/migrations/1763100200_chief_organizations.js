// PocketBase runs these in its own JS runtime, where `migrate`,
// `Collection` and `app` are globals. They are not Node modules.

/**
 * Organizations — the only thing that can hold anything.
 *
 * A person owns nothing directly: a person is an organization of type
 * C, and that organization holds and owes. The nine codes are the Build
 * Suite's own list, so Chief, Chaim and Tithe can mean the same thing
 * by the same letter.
 *
 * `controlled_by` is governance, not ownership. Who owns a share of
 * what is an ownership link, which is its own collection; an
 * organization directing another is this field.
 */
migrate(
	function (app) {
		if (exists(app, 'organizations')) return;
		const users = app.findCollectionByNameOrId('users');
		const spheres = app.findCollectionByNameOrId('spheres');
		const collection = new Collection({
			name: 'organizations',
			type: 'base',
			listRule: 'owner = @request.auth.id',
			viewRule: 'owner = @request.auth.id',
			createRule: "@request.auth.id != '' && owner = @request.auth.id",
			updateRule: 'owner = @request.auth.id',
			deleteRule: 'owner = @request.auth.id',
			fields: [
				{ name: 'name', type: 'text', required: true, presentable: true, max: 120 },
				{
					name: 'code',
					type: 'select',
					required: true,
					maxSelect: 1,
					// C individual · B business · CO common organization ·
					// CC common committee · DO decentralized organization ·
					// DB decentralized branch · P project group ·
					// DN decentralized charity · CN the Church
					values: ['C', 'B', 'CO', 'CC', 'DO', 'DB', 'P', 'DN', 'CN']
				},
				{ name: 'charter', type: 'text', max: 500 },
				{ name: 'blurb', type: 'text', max: 240 },
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
			indexes: ['CREATE UNIQUE INDEX idx_organizations_owner_name ON organizations (owner, name)']
		});
		app.save(collection);

		/* The self-relation has to wait for the collection to have an id. */
		const saved = app.findCollectionByNameOrId('organizations');
		saved.fields.add({
			name: 'controlled_by',
			type: 'relation',
			maxSelect: 1,
			cascadeDelete: false,
			collectionId: saved.id
		});
		app.save(saved);
	},
	function (app) {
		app.delete(app.findCollectionByNameOrId('organizations'));
	}
);

function exists(app, name) {
	try {
		return !!app.findCollectionByNameOrId(name);
	} catch (err) {
		return false;
	}
}
