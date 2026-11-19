// PocketBase runs these in its own JS runtime, where `migrate`,
// `Collection` and `app` are globals. They are not Node modules.

/**
 * Claims — what is on file to show an asset is what it is said to be.
 *
 * A claim is not the file. It is a record of what the file proves,
 * where the file is kept, and the file's fingerprint: a SHA-256 hash
 * taken when the claim was made. Wherever the file lives, the
 * fingerprint is what says it is still the same file.
 *
 * `storage` says what kind of place holds it:
 *   server     the file is kept here, in `file`
 *   elsewhere  it is kept somewhere Chief does not hold; `location`
 *              says where (a link, a drive, a person)
 *   paper      it is a physical thing; `location` says where it is
 *   token      room left for an ERC-721 token: `location` would be
 *              the contract and token id. Not offered yet.
 *
 * `checked_on` is the last day the file was compared with its
 * fingerprint and matched — or, for paper, the last day the Chief
 * looked at it. A claim never checked is still a claim; it just has
 * not been checked, and the app says so.
 *
 * Files are protected: they open only for the account that owns the
 * record, with a short-lived token, never by a bare link.
 */
migrate(
	function (app) {
		if (exists(app, 'claims')) return;
		const users = app.findCollectionByNameOrId('users');
		const assets = app.findCollectionByNameOrId('assets');
		const collection = new Collection({
			name: 'claims',
			type: 'base',
			listRule: 'owner = @request.auth.id',
			viewRule: 'owner = @request.auth.id',
			createRule: "@request.auth.id != '' && owner = @request.auth.id",
			updateRule: 'owner = @request.auth.id',
			deleteRule: 'owner = @request.auth.id',
			fields: [
				{
					name: 'asset',
					type: 'relation',
					required: true,
					maxSelect: 1,
					cascadeDelete: true,
					collectionId: assets.id
				},
				{
					name: 'kind',
					type: 'select',
					required: true,
					maxSelect: 1,
					values: [
						'Ownership token',
						'Title / provenance',
						'Agreement',
						'Statement',
						'Storage record',
						'Insurance',
						'Movement authorization'
					]
				},
				{ name: 'title', type: 'text', required: true, presentable: true, max: 160 },
				{ name: 'source', type: 'text', max: 240 },
				{
					name: 'storage',
					type: 'select',
					required: true,
					maxSelect: 1,
					values: ['server', 'elsewhere', 'paper', 'token']
				},
				{ name: 'location', type: 'text', max: 500 },
				{ name: 'file', type: 'file', maxSelect: 1, maxSize: 20971520, protected: true },
				{ name: 'file_name', type: 'text', max: 255 },
				{ name: 'size', type: 'number', onlyInt: true, min: 0 },
				{ name: 'hash', type: 'text', max: 64 },
				{ name: 'checked_on', type: 'date' },
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
			indexes: ['CREATE INDEX idx_claims_asset ON claims (asset)']
		});
		app.save(collection);
	},
	function (app) {
		app.delete(app.findCollectionByNameOrId('claims'));
	}
);

function exists(app, name) {
	try {
		return !!app.findCollectionByNameOrId(name);
	} catch (err) {
		return false;
	}
}
