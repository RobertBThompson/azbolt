// PocketBase runs these in its own JS runtime, where `migrate`,
// `Collection` and `app` are globals. They are not Node modules.

/**
 * How much two spheres overlap: by half, by a quarter, or not at all.
 *
 * A sphere is a focus, not a filter. Looking through one, what belongs
 * to it is at full strength, what belongs to a sphere it overlaps is
 * shown quieter, and what belongs only to spheres it does not overlap
 * is out of view. This is where a Chief says which is which.
 *
 * One record per pair that overlaps; no record means none. `a` is
 * always the lower id of the two, so a pair cannot be stored twice
 * the other way round.
 */
migrate(
	function (app) {
		if (exists(app, 'sphere_overlaps')) return;
		const users = app.findCollectionByNameOrId('users');
		const spheres = app.findCollectionByNameOrId('spheres');
		const end = (name) => ({
			name,
			type: 'relation',
			required: true,
			maxSelect: 1,
			cascadeDelete: true,
			collectionId: spheres.id
		});
		const collection = new Collection({
			name: 'sphere_overlaps',
			type: 'base',
			listRule: 'owner = @request.auth.id',
			viewRule: 'owner = @request.auth.id',
			createRule: "@request.auth.id != '' && owner = @request.auth.id",
			updateRule: 'owner = @request.auth.id',
			deleteRule: 'owner = @request.auth.id',
			fields: [
				end('a'),
				end('b'),
				{ name: 'share', type: 'select', required: true, maxSelect: 1, values: ['25', '50'] },
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
			indexes: ['CREATE UNIQUE INDEX idx_sphere_overlaps_pair ON sphere_overlaps (owner, a, b)']
		});
		app.save(collection);
	},
	function (app) {
		app.delete(app.findCollectionByNameOrId('sphere_overlaps'));
	}
);

function exists(app, name) {
	try {
		return !!app.findCollectionByNameOrId(name);
	} catch (err) {
		return false;
	}
}
