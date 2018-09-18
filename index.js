'use strict';

const {unlink} = require('fs');

const pify = require('pify');

const ARGLEN_ERROR = 'Expected 1 argument (<string>)';
const ERROR = 'Expected a path of a file or symbolic link (<string>)';
const promisifiedUnlink = pify(unlink);

module.exports = function rmf(...args) {
	const argLen = args.length;

	if (argLen === 0) {
		const error = new RangeError(`${ARGLEN_ERROR}, but got no arguments.`);
		error.code = 'ERR_MISSING_ARGS';

		return Promise.reject(error);
	}

	if (argLen !== 1) {
		const error = new RangeError(`${ARGLEN_ERROR}, but got ${argLen} arguments.`);
		error.code = 'ERR_TOO_MANY_ARGS';

		return Promise.reject(error);
	}

	const [path] = args;

	if (path === '') {
		return Promise.reject(new Error(`${ERROR}, but got '' (empty string).`));
	}

	return promisifiedUnlink(path).then(() => true, err => {
		if (err.code === 'ENOENT') {
			return false;
		}

		throw err;
	});
};
