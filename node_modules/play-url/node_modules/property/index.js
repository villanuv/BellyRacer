module.exports = prop;

/**
 * Create and return a new property.
 *
 * @param {Anything} rawValue (optional)
 * @param {Function} getter (optional)
 * @param {Function} setter (optional)
 * @return {AdaProperty}
 */
function prop(rawValue, getter, setter){

  var raw = (function(value){

    return function raw(update){
      if( arguments.length ){
        value = update;
      }

      return value;
    };

  }());

  function proxy(update, options){
    if(arguments.length > 0){
      raw( setter ? setter(update, raw()) : update );
    }

    return getter ? getter(raw()) : raw();
  };

  proxy.extend = function(ext){
    raw = ext(raw);
    return proxy;
  }

  proxy.getter = function(newGetter){
    getter = newGetter;
    return proxy;
  };

  proxy.setter = function(newSetter){
    setter = newSetter;
    return proxy;
  };

  proxy.isAdaProperty = true;
  proxy.raw           = raw;

  raw(setter ? setter(rawValue) : rawValue);

  return proxy;
}
