// PocketBase runs these in its own JS runtime, where `migrate`,
// `Collection`, `Record` and `app` are globals. They are not Node modules.

/**
 * Focus: assets in Now, Soon, Later and Done, the work that builds them,
 * and a "Build" endeavor for every sphere (Robert, 19 Nov 2026).
 *
 * Assets get the same four states as tasks. Now is the focus, Soon is
 * next, Later is on the back burner, and Done is an asset no longer
 * held — let go, sold, given away — kept as a record. An asset already
 * let go becomes Done; every other becomes Now, so nothing drops out of
 * sight on the day this applies.
 *
 * One money account in each person's book is fixed: every account has
 * one, most likely a bank, a mattress if that is the truth. It can be
 * renamed and moved between Now, Soon and Later, but not deleted, let go,
 * moved out of Money, or unfixed. One per person, held by a unique index
 * the same way the one "you" organization is. The app makes it, or fixes
 * the oldest existing account, the first time the book is read.
 *
 * A task may name the asset it works on, a rough effort (Small, Medium,
 * Large) and a gain in dollars. That is what ranks the quick wins and
 * the most gain for the effort. Naming an asset does not change how a
 * task reaches a sphere; that is still through its endeavor.
 *
 * When a sphere is made, so is an endeavor called "Build" and its name,
 * belonging to the Chief's own organization. An endeavor's spheres are
 * its organization's, so every "Build" endeavor would show in every
 * sphere the Chief's organization is in. `sphere` records the one sphere
 * an endeavor builds; when it is set, the endeavor is in that sphere
 * alone. Each sphere already made gets its "Build" endeavor here.
 */
migrate(
	function (app) {
		const assets = app.findCollectionByNameOrId('assets');
		if (!assets.fields.getByName('state')) {
			assets.fields.add(
				new SelectField({ name: 'state', maxSelect: 1, values: ['Now', 'Soon', 'Later', 'Done'] })
			);
		}
		if (!assets.fields.getByName('fixed')) {
			assets.fields.add(new BoolField({ name: 'fixed' }));
		}
		assets.addIndex('idx_assets_owner_fixed', true, 'owner', 'fixed = 1');
		assets.deleteRule = 'owner = @request.auth.id && fixed = false';
		assets.updateRule =
			'owner = @request.auth.id && (fixed = false || (' +
			'@request.body.fixed:isset = false && ' +
			'@request.body.category:isset = false && ' +
			'@request.body.let_go:isset = false && ' +
			'@request.body.archived:isset = false && ' +
			"@request.body.state != 'Done'))";
		app.save(assets);

		for (const r of app.findAllRecords('assets')) {
			if (r.getString('state')) continue;
			r.set('state', r.getString('let_go') ? 'Done' : 'Now');
			app.save(r);
		}

		const tasks = app.findCollectionByNameOrId('tasks');
		if (!tasks.fields.getByName('asset')) {
			tasks.fields.add(
				new RelationField({
					name: 'asset',
					maxSelect: 1,
					cascadeDelete: false,
					collectionId: assets.id
				})
			);
		}
		if (!tasks.fields.getByName('effort')) {
			tasks.fields.add(
				new SelectField({ name: 'effort', maxSelect: 1, values: ['Small', 'Medium', 'Large'] })
			);
		}
		if (!tasks.fields.getByName('gain')) {
			// Whole cents, as everywhere else (decision 13).
			tasks.fields.add(new NumberField({ name: 'gain', onlyInt: true, min: 0 }));
		}
		if (!tasks.fields.getByName('currency')) {
			tasks.fields.add(new TextField({ name: 'currency', max: 3 }));
		}
		app.save(tasks);

		const spheres = app.findCollectionByNameOrId('spheres');
		const endeavors = app.findCollectionByNameOrId('endeavors');
		if (!endeavors.fields.getByName('sphere')) {
			endeavors.fields.add(
				new RelationField({
					name: 'sphere',
					maxSelect: 1,
					cascadeDelete: false,
					collectionId: spheres.id
				})
			);
		}
		app.save(endeavors);

		for (const s of app.findAllRecords('spheres')) {
			if (s.getBool('retired')) continue;
			const owner = s.getString('owner');
			let self = null;
			try {
				self = app.findFirstRecordByFilter('organizations', 'owner = {:o} && is_self = true', {
					o: owner
				});
			} catch {
				// No "you" yet: the app makes it, and the endeavor with the next sphere.
				continue;
			}
			try {
				app.findFirstRecordByFilter('endeavors', 'sphere = {:s}', { s: s.id });
				continue;
			} catch {
				/* none builds it yet */
			}
			const e = new Record(endeavors);
			e.set('name', 'Build ' + s.getString('name'));
			e.set('organization', self.id);
			e.set('stage', 'Active');
			e.set('sphere', s.id);
			e.set('owner', owner);
			app.save(e);
		}
	},
	function (app) {
		const assets = app.findCollectionByNameOrId('assets');
		assets.deleteRule = 'owner = @request.auth.id';
		assets.updateRule = 'owner = @request.auth.id';
		assets.removeIndex('idx_assets_owner_fixed');
		assets.fields.removeByName('state');
		assets.fields.removeByName('fixed');
		app.save(assets);

		const tasks = app.findCollectionByNameOrId('tasks');
		for (const name of ['asset', 'effort', 'gain', 'currency']) tasks.fields.removeByName(name);
		app.save(tasks);

		// The "Build" endeavors stay, as ordinary endeavors of the Chief's own organization.
		const endeavors = app.findCollectionByNameOrId('endeavors');
		endeavors.fields.removeByName('sphere');
		app.save(endeavors);
	}
);
