'use strict';

import Filter from '../../src/api-query/Filter';
import Search from '../../src/api-query/Search';

describe('Search', function() {
	describe('Search.builder()', function() {
		it('should create Search instance', function() {
			var search = Search.builder();
			assert.ok(search instanceof Search);
		});

		it('should start with an empty body', function() {
			var search = Search.builder();
			assert.deepEqual({}, search.body());
			assert.strictEqual('{}', search.toString());
		});
	});

	describe('cursor', function() {
		it('should be chainnable', function() {
			var search = Search.builder();
			assert.strictEqual(search, search.cursor('foo'));
		});

		it('should set the cursor value', function() {
			var search = Search.builder().cursor('foo');
			assert.strictEqual('{"cursor":"foo"}', search.toString());
		});
	});

	describe('highlight', function() {
		it('should be chainnable', function() {
			var search = Search.builder();
			assert.strictEqual(search, search.highlight('name'));
		});

		it('should add a highlight entry for a field', function() {
			var search = Search.builder().highlight('name');
			assert.strictEqual('{"highlight":{"name":{}}}', search.toString());
		});

		it('should add a highlight entry for a field and size', function() {
			var search = Search.builder().highlight('name', 10);
			assert.strictEqual('{"highlight":{"name":{"size":10}}}', search.toString());
		});

		it('should add a highlight entry for a field, size and count', function() {
			var search = Search.builder().highlight('name', 10, 5);
			assert.strictEqual('{"highlight":{"name":{"size":10,"count":5}}}', search.toString());
		});

		it('should add multiple highlights', function() {
			var search = Search.builder()
				.highlight('address')
				.highlight('name', 10)
				.highlight('lastName', 10, 5);
			var bodyStr = '{"highlight":{"address":{},"name":{"size":10},"lastName":{"size":10,"count":5}}}';
			assert.strictEqual(bodyStr, search.toString());
		});
	});

	describe('postFilter', function() {
		it('should be chainnable', function() {
			var search = Search.builder();
			assert.strictEqual(search, search.postFilter(Filter.gt('age', 12)));
		});

		it('should add an existing filter', function() {
			var search = Search.builder().postFilter(Filter.gt('age', 12));
			var bodyStr = '{"post_filter":[{"age":{"operator":">","value":12}}]}';
			assert.strictEqual(bodyStr, search.toString());
		});

		it('should add filter from text', function() {
			var search = Search.builder().postFilter('foo');
			var bodyStr = '{"post_filter":[{"*":{"operator":"match","value":{"query":"foo"}}}]}';
			assert.strictEqual(bodyStr, search.toString());
		});

		it('should add filter from field and text', function() {
			var search = Search.builder().postFilter('name', 'foo');
			var bodyStr = '{"post_filter":[{"name":{"operator":"match","value":{"query":"foo"}}}]}';
			assert.strictEqual(bodyStr, search.toString());
		});

		it('should add filter from field, operator and text', function() {
			var search = Search.builder().postFilter('age', '<', 12);
			var bodyStr = '{"post_filter":[{"age":{"operator":"<","value":12}}]}';
			assert.strictEqual(bodyStr, search.toString());
		});

		it('should add multiple filters', function() {
			var search = Search.builder()
				.postFilter(Filter.gt('age', 12))
				.postFilter('foo')
				.postFilter('name', 'foo')
				.postFilter('age', '<', 12);

			var bodyStr = '{"post_filter":[' +
				'{"age":{"operator":">","value":12}},' +
				'{"*":{"operator":"match","value":{"query":"foo"}}},' +
				'{"name":{"operator":"match","value":{"query":"foo"}}},' +
				'{"age":{"operator":"<","value":12}}' +
				']}';
			assert.strictEqual(bodyStr, search.toString());
		});
	});

	describe('preFilter', function() {
		it('should be chainnable', function() {
			var search = Search.builder();
			assert.strictEqual(search, search.preFilter(Filter.gt('age', 12)));
		});

		it('should add an existing filter', function() {
			var search = Search.builder().preFilter(Filter.gt('age', 12));
			var bodyStr = '{"pre_filter":[{"age":{"operator":">","value":12}}]}';
			assert.strictEqual(bodyStr, search.toString());
		});

		it('should add filter from text', function() {
			var search = Search.builder().preFilter('foo');
			var bodyStr = '{"pre_filter":[{"*":{"operator":"match","value":{"query":"foo"}}}]}';
			assert.strictEqual(bodyStr, search.toString());
		});

		it('should add filter from field and text', function() {
			var search = Search.builder().preFilter('name', 'foo');
			var bodyStr = '{"pre_filter":[{"name":{"operator":"match","value":{"query":"foo"}}}]}';
			assert.strictEqual(bodyStr, search.toString());
		});

		it('should add filter from field, operator and text', function() {
			var search = Search.builder().preFilter('age', '<', 12);
			var bodyStr = '{"pre_filter":[{"age":{"operator":"<","value":12}}]}';
			assert.strictEqual(bodyStr, search.toString());
		});

		it('should add multiple filters', function() {
			var search = Search.builder()
				.preFilter(Filter.gt('age', 12))
				.preFilter('foo')
				.preFilter('name', 'foo')
				.preFilter('age', '<', 12);

			var bodyStr = '{"pre_filter":[' +
				'{"age":{"operator":">","value":12}},' +
				'{"*":{"operator":"match","value":{"query":"foo"}}},' +
				'{"name":{"operator":"match","value":{"query":"foo"}}},' +
				'{"age":{"operator":"<","value":12}}' +
				']}';
			assert.strictEqual(bodyStr, search.toString());
		});
	});

	describe('query', function() {
		it('should be chainnable', function() {
			var search = Search.builder();
			assert.strictEqual(search, search.query(Filter.gt('age', 12)));
		});

		it('should add an existing filter', function() {
			var search = Search.builder().query(Filter.gt('age', 12));
			var bodyStr = '{"query":[{"age":{"operator":">","value":12}}]}';
			assert.strictEqual(bodyStr, search.toString());
		});

		it('should add filter from text', function() {
			var search = Search.builder().query('foo');
			var bodyStr = '{"query":[{"*":{"operator":"match","value":{"query":"foo"}}}]}';
			assert.strictEqual(bodyStr, search.toString());
		});

		it('should add filter from field and text', function() {
			var search = Search.builder().query('name', 'foo');
			var bodyStr = '{"query":[{"name":{"operator":"match","value":{"query":"foo"}}}]}';
			assert.strictEqual(bodyStr, search.toString());
		});

		it('should add filter from field, operator and text', function() {
			var search = Search.builder().query('age', '<', 12);
			var bodyStr = '{"query":[{"age":{"operator":"<","value":12}}]}';
			assert.strictEqual(bodyStr, search.toString());
		});

		it('should add multiple filters', function() {
			var search = Search.builder()
				.query(Filter.gt('age', 12))
				.query('foo')
				.query('name', 'foo')
				.query('age', '<', 12);

			var bodyStr = '{"query":[' +
				'{"age":{"operator":">","value":12}},' +
				'{"*":{"operator":"match","value":{"query":"foo"}}},' +
				'{"name":{"operator":"match","value":{"query":"foo"}}},' +
				'{"age":{"operator":"<","value":12}}' +
				']}';
			assert.strictEqual(bodyStr, search.toString());
		});
	});
});