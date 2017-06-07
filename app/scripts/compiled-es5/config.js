'use strict';

var _libraries = require('./libraries');

var _module = _libraries.angular.module('language-select.config', []);

_module.provider('languageSelectConfig', function () {
    var _availableLanguages = [{
        id: 'en',
        label: 'English'
    }];
    var _defaultLanguageId = null;
    var _reloadOnChange = true;

    return {
        $get: function $get() {
            return {
                availableLanguages: function availableLanguages() {
                    return _availableLanguages;
                },
                defaultLanguageId: function defaultLanguageId() {
                    return _defaultLanguageId || _availableLanguages[0].id;
                },
                reloadOnChange: function reloadOnChange() {
                    return _reloadOnChange;
                }
            };
        },
        setAvailableLanguages: function setAvailableLanguages(value) {
            _availableLanguages = value;
        },
        setDefaultLanguage: function setDefaultLanguage(value) {
            _defaultLanguageId = value;
        },
        setReloadOnChange: function setReloadOnChange(value) {
            if (value === false || value === null || value === 0) {
                _reloadOnChange = false;
            }
        }
    };
});
