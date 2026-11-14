// PocketBase runs these in its own JS runtime, where `migrate`,
// `Collection` and `app` are globals. They are not Node modules.

/**
 * When a record was made and last changed.
 *
 * The client sorts spheres and jots by `created`. A collection made in
 * a migration only has the fields it was given, so this makes sure
 * each of the first five has both dates, and leaves alone any that
 * already do.
 */
migrate(
	function (app) {
		for (const name of ['spheres', 'organizations', 'people', 'jots']) {
			const collection = app.findCollectionByNameOrId(name);
			let changed = false;
			if (!collection.fields.getByName('created')) {
				collection.fields.add(new AutodateField({ name: 'created', onCreate: true }));
				changed = true;
			}
			if (!collection.fields.getByName('updated')) {
				collection.fields.add(
					new AutodateField({ name: 'updated', onCreate: true, onUpdate: true })
				);
				changed = true;
			}
			if (changed) app.save(collection);
		}
	},
	function () {
		// Nothing to undo: the dates are harmless and other records sort by them.
	}
);
