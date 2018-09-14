'use strict';

const {join} = require('path');
const {access, writeFile} = require('fs').promises;

const rmf = require('.');
const test = require('tape');

test('rmf()', async t => {
	async function getError(...args) {
		try {
			return await rmf(...args);
		} catch (err) {
			return err;
		}
	}

	const tmp = join(__dirname, 'tmp');

	await writeFile(tmp);

	t.equal(
		await rmf(tmp),
		true,
		'should return true when it successfully remove a file.'
	);

	try {
		await access(tmp);
		t.fail('File still exists.');
	} catch ({code}) {
		t.equal(
			code,
			'ENOENT',
			'should remove a file.'
		);
	}

	t.equal(
		await rmf(join(__dirname, '__this_file_does_not_exist__')),
		false,
		'should return false when the target does not exist.'
	);

	t.equal(
		(await getError(join(__filename, 'file'))).code,
		'ENOTDIR',
		'should return false when it tries to remove a directory.'
	);

	t.equal(
		(await getError('')).toString(),
		'Error: Expected a path of a file or symbolic link (<string>), but got \'\' (empty string).',
		'should return false when it takes an empty path.'
	);

	t.equal(
		(await getError()).toString(),
		'TypeError [ERR_INVALID_ARG_TYPE]: The "path" argument must be one of type string, Buffer, or URL. Received type undefined',
		'should return false when it takes no arguments.'
	);

	t.end();
});
