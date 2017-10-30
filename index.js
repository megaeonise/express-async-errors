const Layer = require('express/lib/router/layer');

Object.defineProperty(Layer.prototype, "handle", {
  enumerable: true,
  get: function() { return this.__handle; },
  set: function(fn) {
  
    // Bizarre, but Express checks for 4 args to detect error middleware: https://github.com/expressjs/express/blob/master/lib/router/layer.js
    if (fn.length === 4) {
      fn = wrapErrorMiddleware(fn);
    } else {
      fn = wrap(fn);
    }

    this.__handle = fn;
  }
});

function wrapErrorMiddleware(fn) {
  return (err, req, res, next) => {
    const ret = fn(err, req, res, next);
    
    if (ret && ret.catch) {
      ret.catch(err => next(err));
    }

    return ret;
  }
}

function wrap(fn) {
  return (req, res, next) => {
    const ret = fn(req, res, next);
    
    if (ret && ret.catch) {
      ret.catch(err => {
        next(err);
      });
    }

    return ret;
  }
}
