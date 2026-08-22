const { EventEmitter } = require('node:events');

class JobQueue extends EventEmitter {
 constructor({ concurrency = 2 } = {}) {
 super();
 this.concurrency = concurrency;
 this.running = 0;
 this.queue = [];
 this.history = [];
 }

 push(task, { priority = 0 } = {}) {
 const job = { id: crypto.randomUUID(), task, priority, at: Date.now() };
 this.queue.push(job);
 this.queue.sort((a, b) => a.priority - b.priority);
 this.emit('enqueued', job);
 this.#pump();
 return job.id;
 }

 size() {
 return this.queue.length + this.running;
 }

 async #pump() {
 if (this.running >= this.concurrency) return;
 const job = this.queue.shift();
 if (!job) return;
 this.running++;
 const start = Date.now();
 this.emit('started', job);
 try {
 const result = await job.task();
 this.emit('done', { job, result, durationMs: Date.now() - start });
 return result;
 } catch (err) {
 this.emit('failed', { job, error: err, durationMs: Date.now() - start });
 } finally {
 this.running--;
 this.history.push({ id: job.id, at: job.at, durationMs: Date.now() - start });
 this.#pump();
 }
 }

 stats() {
 return { pending: this.queue.length, running: this.running, total: this.history.length };
 }
}

module.exports = { JobQueue };