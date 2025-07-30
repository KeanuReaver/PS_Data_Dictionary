'use strict';
define([
    'angular',
    'components/shared/index'
], function (angular) {
    return angular.module('ucsdDDModule', ['powerSchoolModule'])
        .constant('dictionary_data', '/admin/queries/getDictionaryData.json');
});