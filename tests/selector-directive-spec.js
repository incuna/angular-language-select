import '../app/scripts/src/main';

describe('languageSelectorController', function () {

    beforeEach(function () {

        angular.mock.module('language-select');

        const $window = {
            location: {
                reload: 'a',
            },
            navigator: jasmine.createSpy(),
            rawDocument: jasmine.createSpy()()
        };
        angular.mock.module(function($provide) {
            $provide.value('$window', $window);
        });

        inject(function ($controller, $rootScope, languageStorage, $window) {
            this.$scope = $rootScope.$new();
            this.ctrl = $controller('languageSelectorController', this.$scope);
            this.languageStorage = languageStorage;
            this.$window = $window;
        });

        this.defaultLanguage = 'en';
        this.choices = [
            {id: 'en', label: 'English'}
        ];
        spyOn(this.languageStorage, 'get').and.returnValue(this.defaultLanguage);
        spyOn(this.languageStorage, 'getLanguageChoices').and.returnValue(this.choices);
        spyOn(this.languageStorage, 'set');
        this.$window = {
            location: {
                reload: 'a'
            }
        };
        console.log(this.$window.location);
    });

    it('should have the properties set', function () {
        expect(this.ctrl.selectedLanguage).toBe(this.defaultLanguage);
        expect(this.ctrl.languageChoices).toEqual(this.choices);
    });

    describe('changeLanguage method', function () {
        
        fit('should call languageStorage.set', function () {
            expect(this.languageStorage.set).not.toHaveBeenCalled();

            this.ctrl.changeLanguage();

            expect(this.languageStorage.set).toHaveBeenCalledWith(this.ctrl.selectedLanguage);
        });
        
    });
    
});
