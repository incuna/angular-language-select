angular.module('-language-select.templates', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/language-select/language-options.html',
    "<div class=select-wrapper><select ng-model=selector.selectedLanguage ng-change=selector.changeLanguage() ng-options=\"language.id as language.label for language in selector.languageChoices\"></select></div>"
  );


  $templateCache.put('templates/language-select/language-switch.html',
    "<div class=language-switch><svg class=\"inline-svg earth\"><use xlink:href=#svg-earth></use></svg><div class=language-switch-inner language-selector></div><svg class=\"inline-svg arrow-down\"><use xlink:href=#svg-arrow-down></use></svg></div>"
  );

}]);
