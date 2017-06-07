import '../app/scripts/src/main';

describe('languageSelectorController', function () {

    beforeEach(function () {

        angular.mock.module('language-select');

        this.windowReloadMock = jasmine.createSpy('windowReload');
        angular.mock.module({windowReload: this.windowReloadMock});

        inject(function ($controller, $rootScope, languageStorage) {
            this.$controller = $controller;
            this.$scope = $rootScope.$new();
            this.languageStorage = languageStorage;
        });

        this.defaultLanguage = 'en';
        this.choices = [
            {id: 'first', label: 'First choice'},
            {id: 'second', label: 'Second choice'},
        ];

        this.makeCtrl = function () {
            return this.$controller('languageSelectorController', {$scope: this.$scope});
        };
    });

    it('should default to English', function () {
        var ctrl = this.makeCtrl();
        expect(ctrl.selectedLanguageId).toBe('en');
        expect(ctrl.languageChoices).toEqual([{id: 'en', label: 'English'}]);
    });

    it('should have the properties set', function () {
        spyOn(this.languageStorage, 'get').and.returnValue('default');
        spyOn(this.languageStorage, 'getLanguageChoices').and.returnValue(this.choices);
        var ctrl = this.makeCtrl();
        expect(ctrl.selectedLanguageId).toBe('default');
        expect(ctrl.languageChoices).toEqual(this.choices);
    });

    describe('changeLanguage()', function () {

        it('should store the language', function () {
            spyOn(this.languageStorage, 'set');
            var ctrl = this.makeCtrl();
            ctrl.changeLanguage('some-id');
            expect(this.languageStorage.set).toHaveBeenCalledWith('some-id');
        });

        it('should change the language id on the scope', function () {
            var ctrl = this.makeCtrl();
            ctrl.changeLanguage('es');
            expect(ctrl.selectedLanguageId).toBe('es');
        });

        it('should call windowReload', function () {
            var getReloadCalls = () => this.windowReloadMock.calls.count();
            var countBefore = getReloadCalls();

            var ctrl = this.makeCtrl();
            var countAfterCtrlInit = getReloadCalls();
            expect(countAfterCtrlInit).toBe(countBefore);

            ctrl.changeLanguage('foo');
            var countAfterChangeCall = getReloadCalls();
            expect(countAfterChangeCall).toBe(countAfterCtrlInit + 1);
        });

    });

});

