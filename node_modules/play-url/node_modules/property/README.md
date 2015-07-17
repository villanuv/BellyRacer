```js
var prop = require('prop')

var PI = prop(3.14)

PI()
// => 3.14

PI(3.14159)
PI()
// => 3.14159
```

### Install

```bash
$ npm install ada-prop # component install adaio/prop
```

## API

### #extend

```js
var foo = prop(3.14)
  .extend(function(raw){

    return function(newValue){
      if(newValue){
        newValue*=10
        return raw(newValue)
      }

      return raw()
    }

  })

```

### #getter(function)

Sets a getter function for the property.

```js
var foo = prop()
  .getter(function(value){
    return value + '.00$'
  })

foo(314)

foo()
// => 314.00$

foo.raw()
// => 314
```

### #setter

Sets a setter function for the property.

```js
var foo = prop()
  .setter(function(value){
    return value + '.00$'
  })

foo(314)

foo()
// => 314.00$

foo.raw()
// => 314.00$
```

![](https://dl.dropbox.com/s/9q2p5mrqnajys22/npmel.jpg?token_hash=AAHqttN9DiGl63ma8KRw-G0cdalaiMzrvrOPGnOfDslDjw)
