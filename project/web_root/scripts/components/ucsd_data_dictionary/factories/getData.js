'use strict';
define(require => {
    const module = require('components/ucsd_data_dictionary/module');
    const $j = require('jquery');

    module.factory('getData', ['$http', ($http) => {
        return {
            getAPIData: function(dataSource) {
                return $http(dataSource).then(function successCallback(response) {
                        return response.data;
                    },
                    function errorCallback(response) {
                        console.error('Status Code:', response.status);
                        //alert('API call failed. Check console log for further details: ' + response.data.message);
                        throw response;
                    });
            },
            getTList: function(path) {
                return $j.ajax({
                    'method': 'get',
                    'url': path,
                    'dataType': 'json',
                    success: response => {
                        return response;
                    },
                    error: error => {
                        console.error('Error pulling tlist json:', error);
                        throw error;
                    }
                });
            }
        };
    }]);
});