import test from 'ava';
import recorder from 'stream-recorder';
import merge from 'merge-stream';
import File from 'vinyl';
import gulp from 'gulp';

import {buildPromise} from './helpers/promise-factory';
import fromPromise from '../';

const recorderOpts = {objectMode: true};
const testfilePath = '/test/file.coffee';
const testfile = new File({
	cwd: '/',
	base: '/test/',
	path: testfilePath,
	contents: new Buffer('answer: 42')
});

test.cb('in duplex mode should insert vinyl file in gulp stream', t => {
	const sut = fromPromise.obj(buildPromise(null, testfile));

	merge(gulp.src(__filename), sut)
		.pipe(recorder(recorderOpts, function (result) {
			const paths = result.map(function (file) {
				return file.path;
			});

			t.same(paths.sort(), [testfilePath, __filename].sort());
			t.end();
		}))
		.resume();
});
