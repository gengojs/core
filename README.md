# gengojs-core

[![Build Status](https://travis-ci.org/iwatakeshi/gengojs-core.svg?branch=master)](https://travis-ci.org/iwatakeshi/gengojs-core)
[![Dependency Status](https://david-dm.org/iwatakeshi/gengojs-core.png)](https://github.com/iwatakeshi/gengojs-core/blob/master/package.json) [![License Status](http://img.shields.io/npm/l/gengojs-core.svg)](https://github.com/iwatakeshi/gengojs-core/blob/master/LICENSE) [![Downloads](http://img.shields.io/npm/dm/gengojs-core.svg)](https://nodei.co/npm/gengojs-core/) 
[![Version](http://img.shields.io/npm/v/gengojs-core.svg)](https://nodei.co/npm/gengojs-core/)

[![NPM](https://nodei.co/npm/gengojs-core.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/gengojs-core/)


The core of gengo.js that manages i18n and l10n.

## Introduction

**gengojs-core** is the actual core of the upcoming [gengo.js](https://github.com/iwatakeshi/gengojs). It serves to be
a server agnostic middle-ware supporting the popular servers such as Express, 
Koa, Hapi, and even more with ease. It is also modular-tastic, and easy
to debug.

To get started, there are three things to know about how the core works:

* Initialize
* Ship
* Parse

**Initialize** is the starting point of the core. It handles the initialization of the
plugin's stack, options, and also the back-end. The reason the back-end is initialized first is
because of the possible use of asynchronous programming needs. Note that if you are to
create a plugin for the back-end, you will need to load every locale into memory so that
the parser can readily use the data.

**Ship** is a function that applies the API to requests and also to the view. 
It begins by getting the locale from the client, letting the router know about 
the current path, applying the locale to the localization plugin, and finally 
assigning the API such as `__` or `__l` (can be changed) to the objects
that are provided by the request and response..

**Parse** is the final step in the core. It is called only when the API are called such as
`__('Hello')`. In this step, the parser plugin must return the i18ned string.

**So...** you may be wondering why is the core a separate module from the rest? The reason is
because having the core on its own allows you developers to create awesome plugins. I personally
feel as if i18n modules are a bit limited in what it can do and myself as well. 

Anyways, one thing to note is that this module should not be used on its own. The actual i18n library is
[gengo.js](https://github.com/iwatakeshi/gengojs). If you want to extend the core to support
server x, then here is where you want to do that but if you want to create the wrapper for server x,
then gengo.js is where you would do that.

## Getting Started

**How gengo.js works** is similar to how Hapi works in terms of creating plugins and how Grunt works
in terms of options.

To create plugins, the one thing to keep in mind is core's `this` context. When a plugin is initialized,
the core calls the plugin as it binds its context to that plugin (see **Creating Plugins**). Another thing to keep in mind is *dependencies*. Dependencies are really
internal API. For example, the parser plugin needs to know about the data. Therefore it is dependent on the
back-end and is expecting the back-end to supply an internal API to retrieve the locale/data. The following shows
the type of plugins that are available for you to create and their dependencies:

#### Type of Plugins and its Dependencies

* Back-end (Storage)
	* None
* Header (Header parsing)
	* None 
* Router (Path or Sub-domain parsing for data transitions in views)
	* None
* Localize (Localization)
	* `this.header.getLocale()` from Header class
* ~~Handler (Applies the API to the objects)~~ (Deprecated: Handler is now part of API)
* API (Applies the API (such as `__` and `__l`) to the objects)
	* `this.header.detectLocale()` from Header class
  * `this.header.getLocale()` from Header class
  * `this.header.setLocale()` from Header class
  * `this.localize` from Localize class
* Parser (i18ns the string)
	* `this.header.getLocale()` from Header class
	* `this.backend.find()` from Back-end class
	* `this.router.toArray()` from Router class
  * `this.router.toDot()` from Router class
  * `this.router.isEnabled()` from Router class

If you noticed, you can pretty much change anything you like. It's designed that way so that if there was something I implemented that you didn't like, you can just create your own plugin for that part or contribute to the default plugins and PR it. 

Now to make the internal API work, you would need to expose the internal API at the end of your
plugins. The following shows which API needs to attach to the context:

#### Internal API to Expose By Plugin

* Back-ends
	* `this.backend = [your back-end plugin instance]`
		* Returns class class instance
* Header
	* `this.header = [...]`
		* Returns class class instance
* Router
	* `this.router = [...]`
		* Returns class class instance
* Localize
	* `this.localize = [...]`
		* Returns class class instance
* ~~Handler~~ (Deprecated: Handler is now part of API)
* API
	* `this.api = [...]`
		* Returns an class instance

For example plugins, see:

* [gengojs-default-api](https://github.com/iwatakeshi/gengojs-default-api)
* [gengojs-default-backend](https://github.com/iwatakeshi/gengojs-default-backend)
* [gengojs-default-header](https://github.com/iwatakeshi/gengojs-default-header)
* [gengojs-default-localize](https://github.com/iwatakeshi/gengojs-default-localize)
* [gengojs-default-parser](https://github.com/iwatakeshi/gengojs-default-parser)
* [gengojs-default-router](https://github.com/iwatakeshi/gengojs-default-router)


To see how it works see **Creating Plugins**.

## Creating Plugins

**Creating plugins** is quite similar, if not, the same as creating plugins for Hapi. As mentioned above,
the core is really all about context. The following shows you the recommended way to create your plugins:

### ES5

```js
function MyHeaderClass (options){
   
   // Set
   this.getLocale = function(){
    // ...
   }
}

// Hapi-ish style plugin
module.exports = function() {
  var pkg = require('./package');
  // ! add type
  pkg.type = 'header';
  return {
  	main: function ship(){
      // Pass options and expose internal API
      this.header = new MyHeaderClass(this.options.header);
    },
  	package: pkg,
    // Provide option defaults
    defaults: require('./defaults.json')
  };
};
```

### ES6

```js
class MyHeaderClass {
  constructor(options){
    // ...
  }
  // Set
  getLocale(){
    // ...
  }
}

export default () => {
// Using require because
// 'import' variables
// seem to be constant
 var pkg = require('./package');
  return {
  // Arrow functions do not work 
  // because the context belongs
  // to something else so use traditional
  // functions
    main: function ship(){
      // Pass options and expose internal API
      this.header = new MyHeaderClass(this.options.header);
    },
    package: pkg,
    // Provide option defaults
    defaults: require('./defaults.json')
  };
};
```
**Notes**: 

* You may have noticed that defaults are provided in the example. Defaults are required (See **Options**). If you
do not have any defaults, then you can just pass `{}`, and the core will not complain.

* Keep in mind that you are limited to one plugin per type. This was done to prevent problems that may arise 
when dealing with the core's context.

## Exporting Multiple Plugins

Now you may be wondering, *Can I release a set of plugins?* The answer is
**YES!**. I call these sets, *packs* or *gengo-pack*. To create a pack, simply export the individual
*ships* like the following:

### ES5

```js
module.exports = function(){
  return {
    parser: /*parser ship*/,
    router: /*router ship*/,
    backend: /*backend ship*/,
    api: /*api ship*/,
    header: /*header ship*/,
    localize: /*localize ship*/
  }
};
```

### ES6

```js
export default () => {
  return {
    parser: /*parser ship*/,
    router: /*router ship*/,
    backend: /*backend ship*/,
    api: /*api ship*/,
    header: /*header ship*/,
    localize: /*localize ship*/
  }
}
```

## Options

The core doesn't have the best options system but the official way to access options per plugin is 
by the context as in the example:

```js
function ship(){
  // To access the options,
  // simply use: this.options[type]:
  console.log(this.options.parser);
}
```
In general, you can access any other plugin's options through the same syntax as in the example, but 
make sure to provide the defaults when you create your plugins. The core will apply them to the options
as soon as it loads the plugin into the stack.

## Status

Because of the beautiful discovery of ES6, I am rewriting the set of plugins that actually work from ES5 to ES6. So it may take up some time but I will say that an alpha of gengo.js (the core and the set of plugins) will be released sometime in late May or late July.

## Contributing

Feel free to contribute. To contribute, see the requirements. If you have any suggestions,
create issues at the core's [GitHub Issues](https://github.com/iwatakeshi/gengojs-core)

* Requirements
	* Grunt
	* [Airbnb Javascript Style](https://github.com/airbnb/javascript)
	* Mocha
	* [semver versioning](http://semver.org/)
	* Fork and Pull
	* Your skills

## Debug

The core uses [debug](https://github.com/visionmedia/debug) to output debugging statements. To debug,
simply set the type of debug in the shell:

Unix:

```bash
$ DEBUG=core
```

Windows

```bash
$ SET DEBUG=core
```

Here are the available types:

* core
* core-plugins
* core-parser
* core-router
* core-backend
* core-header
* core-api
* core-localize


##Build

Run `grunt` to build. This will translate the ES6 files to ES5 and will check for syntax issues.

##Tests

Run `npm test`.