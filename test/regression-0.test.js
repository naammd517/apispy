const test = require('node:test');
const assert = require('node:assert');
const { CompactHandler } = require('../src/features/feature-compact-0.js');

test('compact regression guard ' + '0', async () => {
 const result = await new CompactHandler({ retries: 1 }).run('sample-0');
 assert.strictEqual(result.ok, true);
});