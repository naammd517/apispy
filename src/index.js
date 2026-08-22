const http = require('node:http');
const { URL } = require('node:url');
const { store } = require('./store.js');
const routes = require('./routes.js');

const PORT = process.env.PORT || 4000;

function send(res, status, body) {
 res.writeHead(status, { 'Content-Type': 'application/json' });
 res.end(JSON.stringify(body));
}

async function handler(req, res) {
 const url = new URL(req.url, 'http://localhost');
 const route = routes.match(req.method, url.pathname);
 if (!route) {
 return send(res, 404, { error: 'not_found', path: url.pathname });
 }
 let body = {};
 if (req.method === 'POST' || req.method === 'PUT') {
 try {
 body = await readBody(req);
 } catch (e) {
 return send(res, 400, { error: 'bad_json' });
 }
 }
 try {
 const result = await route.handler({ query: url.searchParams, body, params: route.params, store });
 send(res, result.status || 200, result.body);
 } catch (err) {
 send(res, err.status || 500, { error: err.message });
 }
}

function readBody(req) {
 return new Promise((resolve, reject) => {
 let raw = '';
 req.on('data', (chunk) => { raw += chunk; });
 req.on('end', () => {
 try { resolve(raw ? JSON.parse(raw) : {}); } catch (e) { reject(e); }
 });
 req.on('error', reject);
 });
}

const server = http.createServer(handler);
server.listen(PORT, () => {
 console.log('ApiSpy listening on :' + PORT);
});

module.exports = { server };