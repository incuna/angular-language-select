## 2.2.0

* FEAT: add `setReloadOnChange()` config setting to control the window reloading when the language changes (default: `true`)
* BUGFIX: update `selectedLanguageId` on controller scope when the language is changed

### 2.1.2

* BUGFIX: Chrome doesn't change `navigator.language` when user changes their languages settings. It uses the new `navigator.languages` API.

### 2.1.1

* Reload browser when no cookie is set in order to reload locale files
* Strip culture from `navigator.language` when checking browser language settings

## 2.1.0

* Remove `lodash` dependency

### 2.0.1

* Remove the `files` key from `package.json` so required files are not removed from the package

# 2.0.0

* BREAKING CHANGE: namespace template and directives with `inc-`
* Add `inc-language-links` directive to use links instead of a dropdown

### 1.0.1

* Include source files in `npm` package

# 1.0.0

* Angular `1.2` - `1.5` compatability
* Install with `bower` or `npm`
* Refactor using ES6 features

# 0.0.1

Initial commit
