import '../app/scripts/src/main';

describe('languageSelectConfig', function () {

    beforeEach(function () {
        angular.mock.module('language-select', (languageSelectConfigProvider) => {
            this.languageSelectConfigProvider = languageSelectConfigProvider;
        });

        inject(function (languageSelectConfig) {
            this.languageSelectConfig = languageSelectConfig;
        });
    });

    describe('by default', function () {
        
        it('should have english language set', function () {
            expect(this.languageSelectConfig.defaultLanguage()).toBe('en');
        });

    });

    describe('configuration', function () {

        it('should allow to change the language list', function () {
            const languageList = ['language1', 'language2'];
            this.languageSelectConfigProvider.setAvailableLanguages(languageList);

            expect(this.languageSelectConfig.availableLanguages()).toBe(languageList);
        });

        it('should allow to change the default language', function () {
            const defaultLanguage = 'pl';
            this.languageSelectConfigProvider.setDefaultLanguage(defaultLanguage);

            expect(this.languageSelectConfig.defaultLanguage()).toBe(defaultLanguage);
        });
        
    });
    
});
