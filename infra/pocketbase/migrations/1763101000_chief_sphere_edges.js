// PocketBase runs these in its own JS runtime, where `migrate`,
// `Collection` and `app` are globals. They are not Node modules.

/**
 * Only people and organizations are in spheres.
 *
 * Everything else reaches its sphere through an organization: an asset
 * through whoever owns it, a task through its endeavor's organization,
 * and a jot through the organization the Chief files it under. One
 * road to a sphere means a rename, or a change in how two spheres
 * overlap, is made in one place and is true everywhere.
 *
 * So "Sphere it" stores an organization on the jot, not a sphere, and
 * an asset stores no sphere at all.
 */
migrate(
	function (app) {
		const orgs = app.findCollectionByNameOrId('organizations');

		const jots = app.findCollectionByNameOrId('jots');
		if (!jots.fields.getByName('organization')) {
			jots.fields.add(
				new RelationField({
					name: 'organization',
					maxSelect: 1,
					cascadeDelete: false,
					collectionId: orgs.id
				})
			);
		}
		if (jots.fields.getByName('sphere')) jots.fields.removeByName('sphere');
		app.save(jots);

		const assets = app.findCollectionByNameOrId('assets');
		if (assets.fields.getByName('spheres')) {
			assets.fields.removeByName('spheres');
			app.save(assets);
		}
	},
	function (app) {
		const jots = app.findCollectionByNameOrId('jots');
		jots.fields.removeByName('organization');
		app.save(jots);
	}
);
