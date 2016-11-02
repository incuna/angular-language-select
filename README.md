# angular-language-selector

Angular module for managing language / locale selection.


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


module.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('languageInterceptor');
}]);
```

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
