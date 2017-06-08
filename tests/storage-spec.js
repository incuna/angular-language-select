import '../app/scripts/src/main';

describe('windowReload', function () {

    beforeEach(function () {

        angular.mock.module('language-select.storage-service');

        this.$windowMock = {
            location: jasmine.createSpyObj('location', [
                'reload',
            ]),
        };
        this.languageSelectConfigMock = jasmine.createSpyObj('languageSelectConfig', ['reloadOnChange']);
        angular.mock.module({
            $window: this.$windowMock,
            languageSelectConfig: this.languageSelectConfigMock,
        });

        inject(function (windowReload) {
            this.windowReload = windowReload;
        });
    });

    it('should reload based on languageSelectConfig.reloadOnChange()', function () {
        expect(this.$windowMock.location.reload).not.toHaveBeenCalled();

        this.languageSelectConfigMock.reloadOnChange.and.returnValue(false);
        this.windowReload();
        expect(this.$windowMock.location.reload).not.toHaveBeenCalled();

        this.languageSelectConfigMock.reloadOnChange.and.returnValue(true);
        this.windowReload();
        expect(this.$windowMock.location.reload).toHaveBeenCalled();
    });

});

describe('languageStorage factory', function () {

    beforeEach(function () {

        this.setupModule = function () {
            this.mockLanguageId = 'se';
            this.windowReload = jasmine.createSpy('windowReload');

            angular.mock.module('language-select.storage-service');

            angular.mock.module({
                languageSelectConfig: {
                    availableLanguages: () => this.languageChoices,
                    defaultLanguageId: () => this.mockLanguageId,
                },
                windowReload: this.windowReload,
            });

            inject(function (languageStorage, cookieHandler, $rootScope) {
                this.languageStorage = languageStorage;
                this.cookieHandler = cookieHandler;
                this.$rootScope = $rootScope;
            });

            spyOn(this.cookieHandler, 'get');
            spyOn(this.cookieHandler, 'put');
            this.resetCookieHandlerToSource = function () {
                this.cookieHandler.get.and.stub();
                this.cookieHandler.put.and.stub();
            };
        };

    });

    afterEach(function () {
        document.cookie = 'selectedLanguage=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    });

    describe('methods', function () {

        beforeEach(function () {

            this.languageChoices = [
                {
                    id: 'en_gb',
                    label: 'English',
                },
                {
                    id: 'pl',
                    label: 'Polski',
                },
                {
                    id: 'se',
                    label: 'Svensk',
                },
            ];
            this.setupModule();

            spyOn(this.$rootScope, '$broadcast');
        });

        describe('getLanguageChoices method', function () {

            it('should return the language choices from the config', function () {
                const choices = this.languageStorage.getLanguageChoices();
                expect(choices).toEqual(this.languageChoices);
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
                this.languageStorage.set('pl');
                expect(this.languageStorage.get()).not.toBe('se');
                this.languageStorage.set('se');
                expect(this.languageStorage.get()).toBe('se');
            });

        });

        describe('set method', function () {

            it('should set the cookie', function () {
                expect(this.cookieHandler.put).not.toHaveBeenCalled();
                this.languageStorage.set('de');
                expect(this.cookieHandler.put).toHaveBeenCalledWith('selectedLanguage', 'de');
            });

            it('should emit an event', function () {
                expect(this.$rootScope.$broadcast).not.toHaveBeenCalled();
                this.languageStorage.set('es');
                expect(this.$rootScope.$broadcast).toHaveBeenCalledWith(this.languageStorage.getEventSignature(), 'es');
            });

        });

    });

    describe('initially', function () {

        beforeEach(function () {
            document.cookie = 'selectedLanguage=pl';

            this.languageChoices = [
                {
                    id: 'en_gb',
                    label: 'English',
                },
                {
                    id: 'pl',
                    label: 'Polski',
                },
                {
                    id: 'se',
                    label: 'Svensk',
                },
            ];

            this.setupModule();
            this.resetCookieHandlerToSource();
        });

        it('should set the default language from the cookie', function () {
            // This test won't pass in angular < 1.4 due to how $browser (a private service)
            //  is mocked so it doesn't read actual cookies from the document
            if (angular.version.minor < 4) {
                pending();
            }
            expect(this.languageStorage.get()).toBe('pl');
        });

        it('should not reload the browser', function () {
            if (angular.version.minor < 4) {
                pending();
            }
            expect(this.windowReload).not.toHaveBeenCalled();
        });

    });

    describe('when there is no cookie', function () {

        beforeEach(function () {
            this.originalBrowserLanguage = window.navigator.language;
            Object.defineProperty(window.navigator, 'language', {value: 'en-US', configurable: true});

            // The tested language needs not to be the first one so we are actually testing
            //  that it is chosen and not that it is used as the default fallback choice
            this.languageChoices = [
                {
                    id: 'pl',
                    label: 'Polski',
                },
                {
                    id: 'en',
                    label: 'English',
                },
            ];
            this.setupModule();
        });

        afterEach(function () {
            Object.defineProperty(window.navigator, 'language', {value: this.originalBrowserLanguage, configurable: true});
        });

        it('should use the browser language without the culture if it is in the choices', function () {
            expect(this.languageStorage.get()).toBe('en');
        });

        it('should set the cookie stripping the culture', function () {
            if (angular.version.minor < 4) {
                pending();
            }
            expect(document.cookie).toBe('selectedLanguage=en');
        });

        it('should reload the browser', function () {
            expect(this.windowReload).toHaveBeenCalled();
        });

    });

    describe('when no languages match the available languages', function () {

        beforeEach(function () {
            document.cookie = 'selectedLanguage=pl';

            this.languageChoices = [
                {
                    id: 'se',
                    label: 'Svensk',
                },
            ];

            this.setupModule();
        });

        it('should use the default language', function () {
            expect(this.languageStorage.get()).toBe('se');
        });

    });

});
