const Layer = require('express/lib/router/layer');

const last = arr => arr[arr.length - 1];
const noop = Function.prototype;

function copyFnProps(oldFn, newFn) {
  Object.keys(oldFn).forEach((key) => {
    newFn[key] = oldFn[key];
  });
}

function preserveFnArity(oldFn, newFn) {
  ['name', 'length'].forEach((key) => {
    Object.defineProperty(newFn, key, {
      value: oldFn[key],
      writable: false,
    });
  });
}

function wrap(fn) {
  const newFn = (...args) => {
    const ret = fn.apply(this, args);
    const next = args.length > 2 ? last(args) : noop;
    if (ret && ret.catch) ret.catch(err => next(err));
    return ret;
  };
  copyFnProps(fn, newFn);
  preserveFnArity(fn, newFn);
  return newFn;
}

Object.defineProperty(Layer.prototype, 'handle', {
  enumerable: true,
  get() {
    return this.__handle;
  },
  set(fn) {
    fn = wrap(fn);
    this.__handle = fn;
  },
});
