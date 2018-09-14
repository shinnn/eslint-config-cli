'use strict';

const unlink = require('fs').unlink;

const pify = require('pify');

const ERROR = 'Expected a path of a file or symbolic link (<string>)';
const promisifiedUnlink = pify(unlink);

module.exports = function rmf(path) {
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
