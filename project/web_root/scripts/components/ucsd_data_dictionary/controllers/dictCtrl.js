'use strict';
define(function(require) {
    const module = require('components/ucsd_data_dictionary/module');
    const $j = require('jquery');

    module.controller('DictionaryCtrl', ['$scope', '$timeout', 'getData', 'dictionary_data', 'catFact',
            function($scope, $timeout, getData, dictionary_data, catFact) {
        $scope.dictionaryData = [];
        $scope.selectedCategory = null;
        $scope.selectedTable = null;
        $scope.searchResults = null;
        $scope.searchQuery = '';
        $scope.suggestions  = [];
        $scope.searchResults = {
            tables : [],
            fields : []
        };
        $scope.navStack = [];
        $scope.searchTable = false;

        $scope.dynamicOrderBy = 'field_name';
        $scope.reverseSort = false;
            
        function pushState(type, payload = {}) {
            $scope.navStack.push({ view: type, ...payload });
        }
        
        function findTableByName(tableName) {
            if (!tableName) return null;
            const target = tableName.toUpperCase();
        
            for (const cat of $scope.dictionaryData) {
                const hit = cat.assocTables.find(t => t.table_name.toUpperCase() === target);
                if (hit) return hit;
            }
            return null;
        }

        $scope.setOrderByField = (field) => {
            if ($scope.dynamicOrderBy == field) {
                $scope.reverseSort = !$scope.reverseSort;
            } else {
                $scope.dynamicOrderBy = field;
                $scope.reversSort = false;
            }
        };
        
        $scope.updateSuggestions = function () {
            const q = ($scope.searchQuery || '').toLowerCase();
            if (!q) { $scope.suggestions = []; return; }
        
            const seen = new Set();
        
            const startTables = [], includeTables = [];
            const startFields = [], includeFields = [];
        
            function push(list, label) {
                if (!seen.has(label)) {
                    seen.add(label);
                    list.push(label);
                }
            }
        
            $scope.dictionaryData.forEach(cat => {
                cat.assocTables.forEach(t => {
                    const tLower = t.table_name.toLowerCase();
                    const tLabel = `${t.table_name} (table)`;
        
                    if (tLower.startsWith(q))      push(startTables, tLabel);
                    else if (tLower.includes(q))   push(includeTables, tLabel);
        
                    t.fields.forEach(f => {
                        const fLower = f.field_name.toLowerCase();
                        const fLabel = `${f.field_name} (field)`;
        
                        if (fLower.startsWith(q))    push(startFields, fLabel);
                        else if (fLower.includes(q)) push(includeFields, fLabel);
                    });
                });
            });
        
            $scope.suggestions = []
                .concat(startTables.sort())
                .concat(includeTables.sort())
                .concat(startFields.sort())
                .concat(includeFields.sort())
                .slice(0, 20);
        };
        
        // Check if table was clicked to go directly to table
        $scope.stripContext = function () {    
            $scope.searchTable = $scope.searchQuery.includes('(table)');

            if ($scope.searchQuery) {
                $scope.searchQuery = $scope.searchQuery
                    .replace(/\s+\((?:table|field)\)$/i, '');
            }
        };

        $scope.toggleCategory = function (catName) {
            $scope.selectedCategory = ($scope.selectedCategory === catName) ? null : catName;
            $scope.selectedTable    = null;
            $scope.searchResults    = null;
        };
        
        $scope.selectTable = function (tableName, scrollToNav = false) {
            if ($scope.searchResults && ($scope.searchResults.tables.length || $scope.searchResults.fields.length)) {
                pushState('search', { results: $scope.searchResults });
            } else if ($scope.selectedCategory && !$scope.selectedTable) {
                pushState('category', { category: $scope.selectedCategory });
            } else if ($scope.selectedTable) {
                pushState('table', { table: $scope.selectedTable.table_name });
            }
            
            const tObj = findTableByName(tableName);
            if (!tObj) { console.warn('Table not found:', tableName); return; }
            
        
            $scope.selectedTable    = tObj;
            $scope.searchResults    = null;
            $scope.selectedCategory = tObj.table_cat;
            
            if (scrollToNav) {
                $timeout(() => {
                    const el = document.querySelector('.selected-table');
                    if (el && el.scrollIntoView) {
                        el.scrollIntoView({ block: 'center' });
                    }
                }, 50);
            }
        };
        
        $scope.goBack = function () {
            if (!$scope.navStack.length) return;
        
            const last = $scope.navStack.pop();
        
            $scope.selectedTable = null;
            $scope.searchResults = null;
            $scope.selectedCategory = null;
        
            switch (last.view) {
                case 'search':
                    $scope.searchResults = last.results;
                    break;
                case 'category':
                    $scope.selectedCategory = last.category;
                    break;
                case 'table':
                    const tObj = findTableByName(last.table);
                    if (tObj) {
                        $scope.selectedTable = tObj;
                        $scope.selectedCategory = tObj.table_cat;   
                    }
                    break;
            }
        };
        
        $scope.getSelectedCategoryTables = function () {
            const block = $scope.dictionaryData.find(c => c.category === $scope.selectedCategory);
            return block ? block.assocTables : [];
        };
        
        $scope.performSearch = function () {
            $scope.searchQuery = $scope.searchQuery.replace(/\s+\((table|field)\)$/i, '');
            if ($scope.searchTable) {
                $scope.selectedTable = $scope.searchQuery;
                $scope.selectTable($scope.searchQuery.toUpperCase(), true);
                return;
            }
            const q = ($scope.searchQuery || '').toLowerCase();
            if (!q) { $scope.searchResults = { tables:[], fields:[] }; return; }
        
            const tablesStarts = [];
            const tablesContains = [];
            const fieldMatches = [];
            const seen = new Set();
        
            $scope.dictionaryData.forEach(cat => {
                cat.assocTables.forEach(table => {
                    const tName = table.table_name.toLowerCase();
        
                    if (tName.startsWith(q)) {
                        tablesStarts.push(table);
                        seen.add(table.table_name);
                    } else if (tName.includes(q)) {
                        tablesContains.push(table);
                        seen.add(table.table_name);
                    }
        
                    if (!seen.has(table.table_name) &&
                        table.fields.some(f => f.field_name.toLowerCase().includes(q))) {
                        fieldMatches.push(table);
                    }
                });
            });
        
            tablesStarts.sort((a,b) => a.table_name.localeCompare(b.table_name));
            tablesContains.sort((a,b)=>a.table_name.localeCompare(b.table_name));
            fieldMatches.sort((a,b)=>a.table_name.localeCompare(b.table_name));
        
            $scope.searchResults = {
                tables : [...tablesStarts, ...tablesContains],
                fields : fieldMatches
            };
        
            $scope.selectedCategory = null;
            $scope.selectedTable    = null;
        };

        $j(() => {
            getData.getTList(dictionary_data)
                .then(response => {
                    if (Array.isArray(response)) {
                        const cleaned = response.filter(obj => Object.keys(obj).length !== 0);
                        // console.log(cleaned);
                        $scope.$apply(() => {
                            $scope.dictionaryData = catFact.groupDictionaryData(cleaned);
                            // console.log($scope.dictionaryData);
                        });
                    }
                })
                .catch(error => {
                    console.error('Failed to get dictionary data:', error);
                });
        });
    }]);
});