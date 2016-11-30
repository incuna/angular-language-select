angular.module('-inc-language-select.templates', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/inc-language-select/language-links.html',
    "<ul><li ng-repeat=\"language in selector.languageChoices\"><span ng-click=selector.changeLanguage(language.id) ng-class=\"{selected: language.id === selector.selectedLanguageId}\">{{ language.label }}</span></li></ul>"
  );


  $templateCache.put('templates/inc-language-select/language-options.html',
    "<div class=select-wrapper><select ng-model=selector.selectedLanguageId ng-change=selector.changeLanguage() ng-options=\"language.id as language.label for language in selector.languageChoices\"></select></div>"
  );


  $templateCache.put('templates/inc-language-select/language-switch.html',
    "<div class=language-switch><svg class=\"inline-svg earth\"><use xlink:href=#svg-earth></use></svg><div class=language-switch-inner language-selector></div><svg class=\"inline-svg arrow-down\"><use xlink:href=#svg-arrow-down></use></svg></div>"
  );

}]);
