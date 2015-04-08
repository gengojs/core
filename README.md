# gengojs-core

[![Build Status](https://travis-ci.org/iwatakeshi/gengojs-core.svg?branch=master)](https://travis-ci.org/iwatakeshi/gengojs-core)
[![Dependency Status](https://david-dm.org/iwatakeshi/gengojs-core.png)](https://github.com/iwatakeshi/gengojs-core/blob/master/package.json) [![License Status](http://img.shields.io/npm/l/gengojs-core.svg)](https://github.com/iwatakeshi/gengojs-core/blob/master/LICENSE) [![Downloads](http://img.shields.io/npm/dm/gengojs-core.svg)]() [![Version](http://img.shields.io/npm/v/gengojs-core.svg)]()

[![NPM](https://nodei.co/npm/gengojs-core.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/gengojs-core/)


The core of gengo.js that manages i18n and l10n.

##Introduction

gengojs-core is the actual core of the upcoming [gengojs](https://github.com/iwatakeshi/gengojs). It serves to be
a server agnostic middleware supporting the popular servers such as Express, 
Koa, and Hapi, and even more with ease. It is also modulartastic, and easy
to debug.

To get started, there are three things to know about how the core works:

* Initialize
* Ship
* Parse

**Initialize** is the starting point of the core. It handles the initialization of
plugins, options, and also the backends. The reason the backend is initialized first is
because of the possible use of asynchronous programming needs. Note that if you are to
create a plugin for the backend, you will need to load every locale into memory so that
the parser can readily use the data (or contribute your knowledge to improve the core).

**Ship** is a function that applies the API to requests and also to the view
of whatever the response supplies. It begins by getting the locale from the client,
letting the router know about the current path, applying the locale to the localisation
plugin, and finally assigning the API such as `__` or `__l` (can be changed) to the objects
that are provided by the request and response or even to themselves.

**Parse** is the final step in the core. It is called only when the API are called such as
`__('Hello')`. In this step, the parser plugin must return the i18ned string.

**So...** you may be wondering why is the core a seperate module from the rest? The reason is
because having the core on its own allows you developers to create awesome plugins. I personally
feel as if i18n modules are a bit limited in what it can do and myself as well. 

Anyways, one thing to note is that this module should not be used on its own. The actual i18n library is
[gengojs](https://github.com/iwatakeshi/gengojs). If you want to extend the core to support
server x, then here is where you want to do that but if you want to create the wrapper for server x,
then the gengojs is where you would do that.

##Getting Started

**How gengo works** is similar to how Hapi works in terms of creating plugins and how Grunt works
in terms of options (but I hope you guys can improve option distribution to specific plugins).

To create plugins, the one thing to keep in mind is core's `this` context. When a plugin is initialized,
the core calls the plugin as it binds its context to that plugin. There are different ways to handle the
context so see **Creating Plugins**. Another thing to keep in mind is *dependencies*. Dependencies are really
internal API. For example, the parser plugin needs to know about the data. Therefore it is dependent on the
backend and is expecting the backend to supply an internal API to retrive the locale/data. The following shows
the type of plugins that are available for you to create and their dependencies:

####Type of Plugins and its Dependencies

* Backend (Storage)
	* None
* Header (Header parsing)
	* None 
* Router (Path or Subdomain parsing for data transitions in views)
	* None
* Localize (Localisation)
	* `this.header.detectLocale()` or `this.header.getLocale()` from Header
* Handler (Applys the API/ to the objects)
	* `this.api` from API
* API (The definition of the API such as `__` and `__l`)
	* `this.header.detectLocale()` or `this.header.getLocale()` from Header
	* `this.localize()` from Localize
* Parser (i18ns the string)
	* `this.header.detectLocale` or `this.header.getLocale` from Header
	* `this.backend.find()` from Backend
	* `this.router.route()` from Router (See gengojs-default-router for example ...when I finish the plugin)

If you noticed, you can pretty much change anything you like. It's designed that way so that if there was something I implemented that you didn't like, you can just create your own plugin for that part (or contribute to the original plugin and PR it). 

Now to make the internal API work, you would need to expose the internal API at the end of your
plugins. The following shows which API needs to attach to the context:

####Internal API to Expose By Plugin

* Backends
	* `this.backend = [your backend plugin instance]`
		* Returns a class
* Header
	* `this.header = [...]`
		* Returns a class
* Router
	* `this.router = [...]`
		* Returns a class
* Localize
	* `this.localize = [...]`
		* Returns a class
* Handler
	* this.handler = object
    * Returns the applied object
* API
	* `this.api = [...]`
		* Returns an object literal with keys of `i18n` and `l10n`

To see how that works see **Creating Plugins**

##Creating Plugins

**Creating plugins** is quite similar, if not, the same as creating plugins for Hapi. As mentioned above,
the core is really all about context. The following shows you two ways to create your plugin:


###Using the Context Directly

```js
function MyClass (){
   // 'this' is the core's context
   // 'header' is the internal API
   console.log(this.header.getLocale())
   //options is also available 
   console.log(this.options)
   //or you can use the plugin specific options
   console.log(this.plugins._api.options)

   //do other stuff

   //the internal API to expose is set
   this.api = {/*...*/}
}

// Hapi-ish style plugin
module.exports = function() {
  var pkg = require('./package');
 // ! add type
  pkg.type = 'parser';
  return {
  	main:MyClass,
  	package:pkg
  };
};
```

###Using the Context Indirectly

```js
function MyClass (){
   
   //do other stuff
   this.getLocale = function(){
   }
}

function ship(){
	//then internal API to expose
	this.header = new MyClass();
}


// Hapi-ish style plugin
module.exports = function() {
  var pkg = require('./package');
 // ! add type
  pkg.type = 'header';
  return {
  	main:ship,
  	package:pkg
  };
};
```

The type of usage depends on whether the plugin needs to expose an internal API or 
a final result like the `parser` where it returns the i18ned string or like the `api`
where it returns the API object.

As a side note, I would recommend you to start using ES6 for your plugins. Translating the code
to ES5 is very easy if you use [Babel](https://babeljs.io/). The core is also using ES6 and the
upcoming plugins are being written in ES6 as well. An example of creating a plugin in ES6 would
be:

```js
class MyClass{
  constructor(options){
    //...
  }
}

export default () => {
// Using require because
// 'import' variables
// seem to be constant
 var pkg = require('./package');
  return {
    main: function (){
      // Access options
      this.header = new MyClass(this._header.options);
    },
    package:pkg
  }
}
```

Now you may be wondering, *Can I release a set of plugins?* The answer to this question is
**YES!** and here are some tips when creating plugins:

* Create them individually
* Export and test them together

I call these sets, *packs* or *gengo-pack*. To create a pack, simply export the individual
*ships* like the following:

```js
module.exports = function(){
  return {
    parser: /*parser ship*/,
    router: /*router ship*/,
    backend: /*backend ship*/,
    api: /*api ship*/,
    header: /*header ship*/,
    localize: /*localize ship*/,
    handler: /*handler ship*/
  }
};
```

or in ES6:

```js
export default () => {
  return {
    parser: /*parser ship*/,
    router: /*router ship*/,
    backend: /*backend ship*/,
    api: /*api ship*/,
    header: /*header ship*/,
    localize: /*localize ship*/,
    handler: /*handler ship*/
  }
}
```

## Options

The core doesn't have the best options system but the official way to access options per plugins is 
by the context as in the example:

```js
// Accessing options in the ship 
// (or some function bound to the context)
 function ship(){
 // _ + type of plugin
  this._header.options
 }
```

A few plugins will have a combination of other plugin's options. For example, a header plugin will need to know about 
the API used such as `__` and `__l` and both options will be combined. Note that there is nothing to be done on your end 
and everything is taken care by the core.

It is also best to expose the new options by doing the following:

```js
function ship(){
  this.header = new MyClass();
  this._header.options = this.header.options;
}

```

It may seem redundant but it brings constistency to the lower level (the core) and across plugins.

##Status

~~As of 3/21/2015, I haven't released any plugins. So you may not be able to test anything or even use it. Hopefully by the end this month or mid next month I will have some plugins released individually. That way, you can test and even see how I have done things and maybe even do something better than I did.~~

Because of the beautiful discovery of ES6, I am rewriting the set of plugins that actually work from ES5 to ES6. So it may take up some time but I will say that an alpha of gengojs (the core and the set of plugins) will be released sometime in late May or late July.

##Contributing

Feel free to contribute. To contribute, see the requirements. If you have any suggestions,
create issues at the core's [GitHub Issues](https://github.com/iwatakeshi/gengojs-core)

* Requirements
	* Grunt
	* [Airbnb Javascript Style](https://github.com/airbnb/javascript#testing)
	* Mocha
	* [semver versioning](http://semver.org/)
	* Fork and Pull
	* Your skills

##Debug

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
* core-handler


##Build

Run `grunt` to build. This will tranlsate the ES6 files to ES5 and will check for syntax issues.

##Tests

Run `npm test`.