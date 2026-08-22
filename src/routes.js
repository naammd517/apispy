const { createReadStream } = require('node:fs');

// Small route table with url parameter support.
function compile(pattern) {
 const parts = pattern.split('/').filter(Boolean);
 const keys = [];
 const regex = parts
 .map((part) => {
 if (part.startsWith(':')) {
 keys.push(part.slice(1));
 return '([^/]+)';
 }
 return part.replace(/[.*+?^${}()|[]\\]/g, '\\$&');
 })
 .join('/');
 return new RegExp('^/' + regex + '/?$');
}

function match(method, pathname) {
 for (const route of routes) {
 if (route.method !== method && route.method !== 'ALL') continue;
 const m = route.regex.exec(pathname);
 if (m) {
 const params = {};
 route.keys.forEach((k, i) => { params[k] = decodeURIComponent(m[i + 1]); });
 return { handler: route.handler, params };
 }
 }
 return null;
}

const routes = [
 {
 method: 'GET', path: '/', keys: [], regex: /^/?$/,
 handler: async () => ({ status: 200, body: { name: 'ApiSpy', version: '1.0.0', status: 'ok' } })
 },
 {
 method: 'GET', path: '/api/items', keys: [], regex: /^/api/items/?$/,
 handler: async ({ store }) => ({ status: 200, body: store.all() })
 },
 {
 method: 'POST', path: '/api/items', keys: [], regex: /^/api/items/?$/,
 handler: async ({ body, store }) => ({ status: 201, body: store.create(body) })
 },
 {
 method: 'GET', path: '/api/items/:id', keys: ['id'], regex: /^/api/items/([^/]+)/?$/,
 handler: async ({ params, store }) => {
 const item = store.get(params.id);
 if (!item) return { status: 404, body: { error: 'not_found' } };
 return { status: 200, body: item };
 }
 },
 {
 method: 'DELETE', path: '/api/items/:id', keys: ['id'], regex: /^/api/items/([^/]+)/?$/,
 handler: async ({ params, store }) => {
 const removed = store.remove(params.id);
 if (!removed) return { status: 404, body: { error: 'not_found' } };
 return { status: 200, body: { removed: true } };
 }
 },
 {
 method: 'GET', path: '/health', keys: [], regex: /^/health/?$/,
 handler: async () => ({ status: 200, body: { healthy: true } })
 }
].map((r) => ({ ...r, regex: compile(r.path), keys: r.path.split('/').filter(p => p.startsWith(':')).map(p => p.slice(1)) }));

module.exports = { match, routes };