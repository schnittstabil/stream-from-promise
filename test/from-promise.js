import test from 'ava';
import recorder from 'stream-recorder';

import {buildPromise} from './helpers/promise-factory';
import fromPromise from '../';

const stringResult = '\uD834\uDF06';

test.cb('should emit string results', t => {
	fromPromise(buildPromise(null, stringResult))
		.pipe(recorder(result => {
			t.same(result.toString(), stringResult);
			t.end();
		}))
		.resume();
});

test.cb('with decodeStrings:false should emit string results', t => {
	fromPromise(buildPromise(null, stringResult), {decodeStrings: false})
		.pipe(recorder(result => {
			t.same(result.toString(), stringResult);
			t.end();
		}))
		.resume();
});

test.cb('should emit errors', t => {
	fromPromise(buildPromise(new Error('test 42'), null))
		.on('error', err => {
			if (err) {
				t.ok((err instanceof Error) && /test 42/.test(err), err);
				t.end();
			}
		})
		.resume();
});

test('should throw errors on non promise', t => {
	const sut = fromPromise(null);
	t.throws(sut.read.bind(sut), /null/);
});

test('constructor should return new instance w/o new', t => {
	const sut = fromPromise(buildPromise());
	t.same(sut instanceof fromPromise, true);
});
