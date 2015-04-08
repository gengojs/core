#Change Log

**0.0.1-beta.1**

* Initial commit

**0.0.1-beta.2**

* Bug fixes
* Converted the entire codebase to ES6
* Added babel to grunt task
* Debug now has a prefix specifically for the core
	* `'core'`
	* `'core-plugify'`
	* `'core-' + [type of plugin]`
* Options are now accessed through `this._ + [type of plugin]` 