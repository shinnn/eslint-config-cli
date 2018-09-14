'use strict';

var unlink = require('fs').unlink;

var pify = require('pify');

var ERROR = 'Expected a path of a file or symbolic link (<string>)';
var promisifiedUnlink = pify(unlink);

module.exports = function rmf(path) {
	if (path === '') {
		return Promise.reject(new Error(ERROR + ', but got \'\' (empty string).'));
	}

	return promisifiedUnlink(path).then(function cb() {
		return true;
	}, function cbErr(err) {
		if (err.code === 'ENOENT') {
			return false;
		}

		throw err;
	});
};
