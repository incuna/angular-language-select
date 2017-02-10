import '../app/scripts/src/main';

describe('languageSelectorController', function () {

    beforeEach(function () {

        angular.mock.module('language-select');

        angular.mock.module({windowReload: angular.noop});

        inject(function ($controller, $rootScope, languageStorage) {
            this.$scope = $rootScope.$new();
            this.ctrl = $controller('languageSelectorController', this.$scope);
            this.languageStorage = languageStorage;
        });

        this.defaultLanguage = 'en';
        this.choices = [
            {id: 'en', label: 'English'},
        ];
        spyOn(this.languageStorage, 'get').and.returnValue(this.defaultLanguage);
        spyOn(this.languageStorage, 'getLanguageChoices').and.returnValue(this.choices);
    });

    it('should have the properties set', function () {
        expect(this.ctrl.selectedLanguageId).toBe(this.defaultLanguage);
        expect(this.ctrl.languageChoices).toEqual(this.choices);
    });

});

