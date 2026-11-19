// PocketBase runs these in its own JS runtime, where `migrate`,
// `Collection` and `app` are globals. They are not Node modules.

/**
 * Archived, not deleted.
 *
 * A record someone spent months filling in should be removable from
 * the lists without being destroyed: a person who left, a sphere that
 * is over, an organization that closed. They are still named by old
 * records, and a hard delete turns those into dangling references.
 *
 * A date rather than a flag, because when something was retired is
 * worth as much as whether it was.
 */
migrate(
	function (app) {
		for (const name of ['spheres', 'organizations', 'people']) {
			const collection = app.findCollectionByNameOrId(name);
			if (collection.fields.getByName('archived')) continue;
			collection.fields.add(new DateField({ name: 'archived' }));
			app.save(collection);
		}
	},
	function (app) {
		for (const name of ['spheres', 'organizations', 'people']) {
			const collection = app.findCollectionByNameOrId(name);
			collection.fields.removeByName('archived');
			app.save(collection);
		}
	}
);
