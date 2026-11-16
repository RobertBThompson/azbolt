// PocketBase runs these in its own JS runtime, where `migrate`,
// `Collection` and `app` are globals. They are not Node modules.

/**
 * Money is an asset.
 *
 * A bank account or a wallet is an asset like any other: it has a
 * name, an owner, and a value that is its balance, dated the day it
 * was read. Chief does not keep every transaction — banks and
 * blockchains already do — so the balance is revisited, not added up.
 *
 * What is special is the category. Money is the one asset category
 * every account has and none can delete or rename, because the Money
 * section is built on it. `kind` marks it; ordinary categories leave
 * it empty. The rules below hold that on the server, not only in the
 * app.
 *
 * Cash entries are kept only where they are tied to something held or
 * owed — the car payment, not lunch. `asset` is what an entry is
 * about, and `account` is the money asset it moves through. What is
 * not tied to anything shows only as the change in a balance.
 */
migrate(
	function (app) {
		const categories = app.findCollectionByNameOrId('asset_categories');
		if (!categories.fields.getByName('kind')) {
			categories.fields.add(new TextField({ name: 'kind', max: 20 }));
		}
		// The fixed category cannot be deleted, and its name and kind cannot be changed.
		categories.deleteRule = "owner = @request.auth.id && kind != 'money'";
		categories.updateRule =
			"owner = @request.auth.id && (kind != 'money' || (@request.body.name:isset = false && @request.body.kind:isset = false))";
		app.save(categories);

		const assets = app.findCollectionByNameOrId('assets');
		const cash = app.findCollectionByNameOrId('cash_entries');
		let changed = false;
		for (const name of ['asset', 'account']) {
			if (cash.fields.getByName(name)) continue;
			cash.fields.add(
				new RelationField({
					name,
					maxSelect: 1,
					cascadeDelete: false,
					collectionId: assets.id
				})
			);
			changed = true;
		}
		if (changed) app.save(cash);
	},
	function (app) {
		const categories = app.findCollectionByNameOrId('asset_categories');
		categories.deleteRule = 'owner = @request.auth.id';
		categories.updateRule = 'owner = @request.auth.id';
		categories.fields.removeByName('kind');
		app.save(categories);
		const cash = app.findCollectionByNameOrId('cash_entries');
		for (const name of ['asset', 'account']) cash.fields.removeByName(name);
		app.save(cash);
	}
);
