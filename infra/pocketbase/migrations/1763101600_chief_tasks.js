// PocketBase runs these in its own JS runtime, where `migrate`,
// `Collection` and `app` are globals. They are not Node modules.

/**
 * Tasks — one thing to do.
 *
 * A task goes up to an endeavor and no further: the endeavor's
 * organization is what places it in a sphere. A task with no endeavor
 * is allowed, because writing it down comes first, and it shows under
 * All life until it is given one.
 *
 * `state` is when, in four words: Now, Soon, Later, Done. Waiting is
 * not a fifth state. A task being waited on is still a Now or a Soon;
 * `waiting_on` says on whom or what, and is empty when it is not.
 *
 * `from_jot` keeps the link to the jot a task was made from, so the
 * Chief's own words stay behind the tidy title.
 */
migrate(
	function (app) {
		if (exists(app, 'tasks')) return;
		const users = app.findCollectionByNameOrId('users');
		const endeavors = app.findCollectionByNameOrId('endeavors');
		const jots = app.findCollectionByNameOrId('jots');
		const collection = new Collection({
			name: 'tasks',
			type: 'base',
			listRule: 'owner = @request.auth.id',
			viewRule: 'owner = @request.auth.id',
			createRule: "@request.auth.id != '' && owner = @request.auth.id",
			updateRule: 'owner = @request.auth.id',
			deleteRule: 'owner = @request.auth.id',
			fields: [
				{ name: 'name', type: 'text', required: true, presentable: true, max: 240 },
				{
					name: 'state',
					type: 'select',
					required: true,
					maxSelect: 1,
					values: ['Now', 'Soon', 'Later', 'Done']
				},
				{ name: 'waiting_on', type: 'text', max: 160 },
				{ name: 'due', type: 'date' },
				{ name: 'done_on', type: 'date' },
				{
					name: 'endeavor',
					type: 'relation',
					maxSelect: 1,
					cascadeDelete: false,
					collectionId: endeavors.id
				},
				{
					name: 'from_jot',
					type: 'relation',
					maxSelect: 1,
					cascadeDelete: false,
					collectionId: jots.id
				},
				{ name: 'notes', type: 'text', max: 2000 },
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
			indexes: ['CREATE INDEX idx_tasks_owner_state ON tasks (owner, state)']
		});
		app.save(collection);
	},
	function (app) {
		app.delete(app.findCollectionByNameOrId('tasks'));
	}
);

function exists(app, name) {
	try {
		return !!app.findCollectionByNameOrId(name);
	} catch (err) {
		return false;
	}
}
