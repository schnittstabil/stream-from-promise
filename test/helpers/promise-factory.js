var PinkiePromise = require('pinkie-promise');

exports.buildPromise = function (err, result, timeout) {
	return new PinkiePromise(function (resolve, reject) {
		setTimeout(function () {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		}, timeout || 500);
	});
};
