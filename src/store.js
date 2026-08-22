const fs = require('node:fs');
const path = require('node:path');

const FILE = process.env.DATA_FILE || path.join(__dirname, '..', 'data', 'store.json');

class JsonStore {
 constructor(file = FILE) {
 this.file = file;
 this.items = new Map();
 this.#load();
 }

 #load() {
 try {
 if (fs.existsSync(this.file)) {
 const raw = JSON.parse(fs.readFileSync(this.file, 'utf8'));
 for (const [k, v] of Object.entries(raw)) this.items.set(String(k), v);
 }
 } catch (e) {
 console.error('could not load store', e.message);
 }
 }

 #save() {
 fs.mkdirSync(path.dirname(this.file), { recursive: true });
 fs.writeFileSync(this.file, JSON.stringify(Object.fromEntries(this.items), null, 2));
 }

 all() {
 return [...this.items.values()];
 }

 get(id) {
 return this.items.get(String(id)) || null;
 }

 create(data) {
 const id = cryptoRandom();
 const item = { id, ...data, created_at: new Date().toISOString() };
 this.items.set(id, item);
 this.#save();
 return item;
 }

 remove(id) {
 const existed = this.items.delete(String(id));
 if (existed) this.#save();
 return existed;
 }
}

function cryptoRandom() {
 const crypto = require('node:crypto');
 return crypto.randomBytes(6).toString('hex');
}

const store = new JsonStore();

module.exports = { store, JsonStore };