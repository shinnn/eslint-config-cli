'use strict';

const {join} = require('path');
const {access, writeFile} = require('fs').promises;

const fileUrl = require('file-url');
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
		await rmf(Buffer.from(join(__dirname, '__this_file_does_not_exist__'))),
		false,
		'should return false when the target does not exist.'
	);

	t.equal(
		(await getError(new URL(fileUrl(join(__filename, 'file'))))).code,
		'ENOTDIR',
		'should throw an error when it tries to remove a directory.'
	);

	t.equal(
		(await getError('')).toString(),
		'Error: Expected a path of a file or symbolic link (<string|Buffer|Uint8Array|URL>), but got \'\' (empty string).',
		'should return false when it takes an empty string.'
	);

	t.equal(
		(await getError(Buffer.alloc(0))).toString(),
		'Error: Expected a path of a file or symbolic link (<string|Buffer|Uint8Array|URL>), but got an empty Buffer.',
		'should return false when it takes an empty Buffer.'
	);

	t.equal(
		(await getError(new Uint8Array())).toString(),
		'Error: Expected a path of a file or symbolic link (<string|Buffer|Uint8Array|URL>), but got an empty Uint8Array.',
		'should return false when it takes an empty Uint8Array.'
	);

	t.equal(
		(await getError(new Int8Array())).code,
		'ERR_INVALID_ARG_TYPE',
		'should return false when it takes an invalid path-type value.'
	);

	t.equal(
		(await getError()).toString(),
		'RangeError: Expected 1 argument (<string|Buffer|Uint8Array|URL>), but got no arguments.',
		'should return false when it takes no arguments.'
	);

	t.equal(
		(await getError('a', 'b')).toString(),
		'RangeError: Expected 1 argument (<string|Buffer|Uint8Array|URL>), but got 2 arguments.',
		'should return false when it takes too many arguments.'
	);

	t.end();
});
