import '../app/scripts/src/main';

describe('languageStorage factory', function () {

    beforeEach(function () {

        this.languageChoices = [
            {
                id: 'en_gb',
                label: 'English'
            },
            {
                id: 'pl',
                label: 'Polski'
            },
            {
                id: 'se',
                label: 'Svensk'
            }
        ];
        angular.mock.module('language-select', ($provide) => {
            $provide.service('languageSelectConfig', () => {
                return {
                    availableLanguages: () => this.languageChoices,
                    defaultLanguage: jasmine.createSpy()
                }
            });
        });

        inject(function (languageStorage, languageSelectConfig, $cookies, $rootScope) {
            this.languageStorage = languageStorage;
            this.languageSelectConfig = languageSelectConfig;
            this.$cookies = $cookies;
            this.$rootScope = $rootScope;
        });

        spyOn(this.$rootScope, '$broadcast');
    });

    describe('getLanguageChoices method', function () {

        it('should return the language choices from the config', function () {
            const choices = this.languageStorage.getLanguageChoices();
            expect(choices).toBe(this.languageChoices);
        });
        
    });

    describe('getLanguageChoice method', function () {

        it('should return a normalised language choice', function () {
            const expectedResult = this.languageChoices[0];
            expect(this.languageStorage.getLanguageChoice('en_gb')).toBe(expectedResult);
            expect(this.languageStorage.getLanguageChoice('en-gb')).toBe(expectedResult);
            expect(this.languageStorage.getLanguageChoice('en-GB')).toBe(expectedResult);
        });

        it('should have a default of the current selected language', function () {
            expect(this.languageStorage.getLanguageChoice()).not.toBe(this.languageChoices[1]);
            this.languageStorage.set('pl');
            expect(this.languageStorage.getLanguageChoice()).toBe(this.languageChoices[1]);
        });
        
    });

    describe('get method', function () {

        it('should return the current selected language', function () {
            expect(this.languageStorage.get()).not.toBe('se');
            this.languageStorage.set('se');
            expect(this.languageStorage.get()).toBe('se');
        });
        
    });

    describe('set method', function () {
        
        it('should set the cookie', function () {
            expect(this.$cookies.get(this.languageStorage.getCookieSingature())).not.toBe('de');
            this.languageStorage.set('de');
            expect(this.$cookies.get(this.languageStorage.getCookieSingature())).toBe('de');
        });

        it('should emit an event', function () {
            expect(this.$rootScope.$broadcast).not.toHaveBeenCalled();
            this.languageStorage.set('es');
            expect(this.$rootScope.$broadcast).toHaveBeenCalledWith(this.languageStorage.getEventSignature(), 'es');
        });

    });

});

describe('setup phase', function () {

    beforeEach(function () {
        document.cookie = 'selectedLanguage=pl';
            
        this.languageChoices = [
            {
                id: 'en_gb',
                label: 'English'
            },
            {
                id: 'pl',
                label: 'Polski'
            },
            {
                id: 'se',
                label: 'Svensk'
            }
        ];
        angular.mock.module('language-select', ($provide) => {
            $provide.service('languageSelectConfig', () => {
                return {
                    availableLanguages: () => this.languageChoices,
                    defaultLanguage: jasmine.createSpy()
                }
            });
        });

            
        inject(function (languageStorage, languageSelectConfig, $cookies, $rootScope) {
            this.languageStorage = languageStorage;
            this.languageSelectConfig = languageSelectConfig;
            this.$cookies = $cookies;
            this.$rootScope = $rootScope;
        });
    });
    
    describe('initially', function () {

        it('should set the default language from the cookie', function () {
            expect(this.languageStorage.get()).toBe('pl');
        });
    });

});

fdescribe('when there is no cookie', function () {

    document.cookie = 'selectedLanguage=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    beforeEach(function () {
        
        this.languageChoices = [
            {
                id: 'en_us',
                label: 'English'
            },
            {
                id: 'pl',
                label: 'Polski'
            }
        ];
        angular.mock.module('language-select', ($provide) => {
            $provide.service('languageSelectConfig', () => {
                return {
                    availableLanguages: () => this.languageChoices,
                    defaultLanguage: jasmine.createSpy()
                }
            });
        });

            
        inject(function (languageStorage, languageSelectConfig, $cookies, $rootScope) {
            this.languageStorage = languageStorage;
            this.languageSelectConfig = languageSelectConfig;
            this.$cookies = $cookies;
            this.$rootScope = $rootScope;
        });
    });

    it('should use the browser language', function () {

        expect(this.languageStorage.get()).toBe('en_us');
    });

});

