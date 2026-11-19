// PocketBase runs these in its own JS runtime, where `migrate`,
// `Collection` and `app` are globals. They are not Node modules.

/**
 * The Chief's own organization.
 *
 * A person owns nothing directly, the Chief included: what the Chief
 * holds is held by an organization of type C that stands for them.
 * Every account has exactly one, and this marks which one it is, so
 * "what is mine" is a question the records can answer.
 *
 * One per account, enforced by the index rather than by the client:
 * two tabs opened at once would otherwise each make one.
 */
migrate(
	function (app) {
		const collection = app.findCollectionByNameOrId('organizations');
		if (!collection.fields.getByName('is_self')) {
			collection.fields.add(new BoolField({ name: 'is_self' }));
		}
		collection.addIndex('idx_organizations_owner_self', true, 'owner', 'is_self = 1');
		app.save(collection);
	},
	function (app) {
		const collection = app.findCollectionByNameOrId('organizations');
		collection.removeIndex('idx_organizations_owner_self');
		collection.fields.removeByName('is_self');
		app.save(collection);
	}
);
