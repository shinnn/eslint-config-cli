'use strict';

const {types: {isUint8Array}, promisify} = require('util');
const {unlink} = require('fs');

const PATH_TYPES = '(<string|Buffer|Uint8Array|URL>)';
const ARGLEN_ERROR = `Expected 1 argument ${PATH_TYPES}`;
const ERROR = `Expected a path of a file or symbolic link ${PATH_TYPES}`;
const promisifiedUnlink = promisify(unlink);

module.exports = async function rmf(...args) {
	const argLen = args.length;

	if (argLen === 0) {
		const error = new RangeError(`${ARGLEN_ERROR}, but got no arguments.`);
		error.code = 'ERR_MISSING_ARGS';

		throw error;
	}

	if (argLen !== 1) {
		const error = new RangeError(`${ARGLEN_ERROR}, but got ${argLen} arguments.`);
		error.code = 'ERR_TOO_MANY_ARGS';

		throw error;
	}

	const [path] = args;

	if (path === '') {
		throw new Error(`${ERROR}, but got '' (empty string).`);
	}

	if (path.length === 0) {
		if (Buffer.isBuffer(path)) {
			throw new Error(`${ERROR}, but got an empty Buffer.`);
		}

		if (isUint8Array(path)) {
			throw new Error(`${ERROR}, but got an empty Uint8Array.`);
		}
	}

	try {
		await promisifiedUnlink(path);
	} catch (err) {
		if (err.code === 'ENOENT') {
			return false;
		}

		throw err;
	}

	return true;
};
