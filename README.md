# angular-language-selector

Angular module for managing language / locale selection.

## Installation

* With `npm`

`npm install angular-language-select`

In your project you can `import 'angular-language-select'` to make the module available to angular.

* With `bower`

`bower install angular-language-select`

Include the `dist/language-select.js` (or `dist/language-select.min.js`) script in your app.

## Configuration

### Set the available and defaultLanguages.

```
const module = angular.module('app', [
    'language-select.config'
]);

module.config([
    'languageSelectConfig'
    function (
        languageSelectConfig
    ) {
        languageSelectConfig.setAvailableLanguages([
            {
                'id': 'en',
                'label': 'English'
            },
            {
                'id': 'pl',
                'label': 'Polski'
            }
        ]);
        languageSelectConfig.setDefaultLanguage('en');
    }
]);
```

### languageInterceptor

The `languageInterceptor` can be used to set the `Accept-Language` to the current language for each http request.

```
const module = angular.module('app', [
    'language-select.language-interceptor'
]);
```

If the module is loaded it will push the interceptor to the `$http.interceptors` automatically.

### language-select:change event.

Set other local services from the language-select:change event.

```
const module = angular.module('app', [
    'language-select.storage-service',
    'project_settings',
    'gettext'
]);

// Set the app language when it is changed
module.run([
    '$rootScope',
    'gettextCatalog',
    'languageStorage',
    function (
        $rootScope,
        gettextCatalog,
        languageStorage
    ) {
        // get the starting/selected app language and set gettext and momentJS to use it
        $rootScope.$on('language-select:change', function (event, selectedLanguage) {
            gettextCatalog.setCurrentLanguage(choice.id);
            moment.locale(choice.id);
        });
    }
]);

```
