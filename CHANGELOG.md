#Change Log

**0.0.1-beta.1**

* Initial commit

**0.0.1-beta.2**

* Bug fixes

**0.0.1-beta.3**

* Bug fixes
* Converted the entire codebase to ES6
* Added babel to grunt task
* Debug now has a prefix specifically for the core
	* `'core'`
	* `'core-plugify'`
	* `'core-' + [type of plugin]`
* Options are now accessed through `this._ + [type of plugin]` 

**0.0.1-beta.4**

* Bug fixes for debugging.
* Removed source maps

**0.0.1-beta.5**

* Bug fixes for inidivdual plugins not able to be loaded
* Updated readme

**0.0.1-beta.6**

* Options have been reapplied by type after the plugin
sets its options. Therefore, a plugin may call another's options by
`this.options.[type]`