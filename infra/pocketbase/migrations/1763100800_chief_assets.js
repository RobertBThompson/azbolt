// PocketBase runs these in its own JS runtime, where `migrate`,
// `Collection` and `app` are globals. They are not Node modules.

/**
 * Assets — everything that is not a person.
 *
 * An asset holds no value of its own: what it is worth is the latest
 * dated valuation, which is its own collection, so the figure always
 * comes with the day it was true.
 *
 * `units` is how many shares ownership of it is divided into — 10,000
 * unless the Chief says otherwise, so a share to a hundredth of a
 * percent is a whole number.
 *
 * `parent` and `valuation` leave room for a thing made of things. Most
 * assets have no parent and are valued whole: a car is worth what the
 * car is worth. One marked `parts` is worth the sum of the assets that
 * name it as their parent — a collection, or a car being broken up.
 *
 * `let_go` is a date, not a deletion. Something sold or given away
 * keeps its record and its history.
 */
migrate(
	function (app) {
		if (!exists(app, 'assets')) create(app);
		addParent(app);
	},
	function (app) {
		app.delete(app.findCollectionByNameOrId('assets'));
	}
);

/** @param {any} app */
function create(app) {
	const users = app.findCollectionByNameOrId('users');
	const spheres = app.findCollectionByNameOrId('spheres');
	const categories = app.findCollectionByNameOrId('asset_categories');
	const collection = new Collection({
		name: 'assets',
		type: 'base',
		listRule: 'owner = @request.auth.id',
		viewRule: 'owner = @request.auth.id',
		createRule: "@request.auth.id != '' && owner = @request.auth.id",
		updateRule: 'owner = @request.auth.id',
		deleteRule: 'owner = @request.auth.id',
		fields: [
			{ name: 'name', type: 'text', required: true, presentable: true, max: 160 },
			{
				name: 'category',
				type: 'relation',
				maxSelect: 1,
				cascadeDelete: false,
				collectionId: categories.id
			},
			{ name: 'blurb', type: 'text', max: 240 },
			{ name: 'quantity', type: 'number' },
			{ name: 'rights', type: 'text', max: 60 },
			{ name: 'period', type: 'text', max: 120 },
			{ name: 'tangibility', type: 'select', maxSelect: 1, values: ['Tangible', 'Intangible'] },
			{ name: 'liquidity', type: 'select', maxSelect: 1, values: ['Liquid', 'Not liquid'] },
			{ name: 'inventory', type: 'select', maxSelect: 1, values: ['Inventory', 'Not inventory'] },
			{ name: 'storage', type: 'text', max: 240 },
			{ name: 'notes', type: 'text', max: 2000 },
			{ name: 'units', type: 'number', onlyInt: true, min: 1 },
			{ name: 'valuation', type: 'select', maxSelect: 1, values: ['whole', 'parts'] },
			{
				name: 'spheres',
				type: 'relation',
				maxSelect: 20,
				cascadeDelete: false,
				collectionId: spheres.id
			},
			{ name: 'let_go', type: 'date' },
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
		indexes: ['CREATE INDEX idx_assets_owner ON assets (owner)']
	});
	app.save(collection);
}

/**
 * An asset inside another points at this same collection, so the field
 * can only be added once the collection has an id of its own.
 * @param {any} app
 */
function addParent(app) {
	const saved = app.findCollectionByNameOrId('assets');
	if (saved.fields.getByName('parent')) return;
	saved.fields.add(
		new RelationField({
			name: 'parent',
			maxSelect: 1,
			cascadeDelete: false,
			collectionId: saved.id
		})
	);
	app.save(saved);
}

function exists(app, name) {
	try {
		return !!app.findCollectionByNameOrId(name);
	} catch (err) {
		return false;
	}
}
