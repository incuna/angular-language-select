import { angular } from 'libraries';

import './selector';
import './switch';
import './interceptor';
import './storage';

angular.module('language-select', [
    'language-select.selector',
    'language-select.switch',
    'language-select.language-interceptor',
    'language-select.storage-service'
]);
