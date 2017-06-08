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
            expect(this.languageSelectConfig.availableLanguages()).toEqual([{id: 'en', label: 'English'}]);
            expect(this.languageSelectConfig.defaultLanguageId()).toBe('en');
        });

        it('should have reloadOnChange true', function () {
            expect(this.languageSelectConfig.reloadOnChange()).toBe(true);
        });

    });

    describe('configuration', function () {

        it('should allow to change the language list', function () {
            const languageList = ['language1', 'language2'];
            this.languageSelectConfigProvider.setAvailableLanguages(languageList);

            expect(this.languageSelectConfig.availableLanguages()).toEqual(languageList);
        });

        it('should allow to change the default language', function () {
            const defaultLanguageId = 'pl';
            this.languageSelectConfigProvider.setDefaultLanguage(defaultLanguageId);

            expect(this.languageSelectConfig.defaultLanguageId()).toEqual(defaultLanguageId);
        });

        it('should allow to change reloadOnChange', function () {
            this.languageSelectConfigProvider.setReloadOnChange(false);
            expect(this.languageSelectConfig.reloadOnChange()).toBe(false);
        });

        describe('reloadOnChange', function () {

            it('should be false when set to false', function () {
                this.languageSelectConfigProvider.setReloadOnChange(false);
                expect(this.languageSelectConfig.reloadOnChange()).toBe(false);
            });

            it('should be true when set to true', function () {
                this.languageSelectConfigProvider.setReloadOnChange(true);
                expect(this.languageSelectConfig.reloadOnChange()).toBe(true);
            });

            it('should error when set to anything else', function () {
                expect(() => {
                    this.languageSelectConfigProvider.setReloadOnChange('');
                }).toThrowError('setReloadOnChange: value must be true or false');
                expect(() => {
                    this.languageSelectConfigProvider.setReloadOnChange('some string');
                }).toThrowError('setReloadOnChange: value must be true or false');
                expect(() => {
                    this.languageSelectConfigProvider.setReloadOnChange({key: 'value'});
                }).toThrowError('setReloadOnChange: value must be true or false');
                expect(() => {
                    this.languageSelectConfigProvider.setReloadOnChange(['value']);
                }).toThrowError('setReloadOnChange: value must be true or false');
            });

        });

    });

});
