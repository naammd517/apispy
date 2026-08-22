const { EventEmitter } = require('node:events');

class EventBus extends EventEmitter {
 constructor() {
 super();
 this.setMaxListeners(50);
 }

 onceMany(names, listener) {
 names.forEach((name) => this.once(name, listener));
 }

 emitWith(context, name, payload) {
 return this.emit(name, { ...payload, context, at: new Date().toISOString() });
 }

 spy(name, limit = 100) {
 const events = [];
 const listener = (e) => {
 events.push(e);
 if (events.length > limit) events.shift();
 };
 this.on(name, listener);
 return {
 events,
 stop() {
 this.removeListener(name, listener);
 }
 };
 }
}

const bus = new EventBus();

module.exports = { EventBus, bus };