/* globals define */
( function (root, factory) {
    'use strict';
    if (typeof module !== 'undefined' && module.exports) {
        if (typeof angular === 'undefined') {
            factory(require('angular'));
        } else {
            factory(angular);
        }
        module.exports = 'angularjs-tag-commander';
    } else if (typeof define === 'function' && define.amd) {
        define(['angular'], factory);
    } else {
        factory(root.angular);
    }
} ( this,
    function (angular, undefined) {
    'use strict';

    angular.module('angularjs-tag-commander', [])
    .directive('tcSetVars', ['TagCommander','$log', function (TagCommander, $log) {
        return {
            restrict: 'A',
            scope: false,
            link: function($scope, element, attrs) {
                $log.debug('Directive Set Vars');

                var exp = attrs.tcSetVars;

                var ctrlRegex = new RegExp(/\$ctrl\.((\w|\.)+)/g);
                var scopeRegex = new RegExp(/\$scope\.((\w|\.)+)/g);

                var ctrlMatchs = exp.match(ctrlRegex);
                var ctrlValues = [];

                var scopeMatchs = exp.match(scopeRegex);
                var scopeValues = [];
                if (!!ctrlMatchs) {
                    for (var i=0; i<ctrlMatchs.length; i++) {
                        ctrlValues[i] = $scope.$eval(ctrlMatchs[i]);
                        exp = exp.replace(ctrlMatchs[i], JSON.stringify(ctrlValues[i]));
                    }
                }

                if (!!scopeMatchs) {
                    for (var i=0; i<scopeMatchs.length; i++) {
                        var sm = scopeMatchs[i].replace('$scope.', '');
                        scopeValues[i] = $scope.$eval(sm);
                        exp = exp.replace(scopeMatchs[i], JSON.stringify(scopeValues[i]));
                    }
                }

                if (exp[0] === '{') {
                    try {
                        var vars = JSON.parse(exp);
                    } catch (error) {
                        $log.error('the argument ' + exp + ' you provided to tc-onclick-set-vars directive is not valid JSON', error);
                    }
                } else {
                    $log.error('the argument ' + exp + ' you provided to tc-onclick-set-vars directive is not in the form of a JSON, you need to provie a key value JSON object');
                }
                TagCommander.setTcVars(vars);
            }
        };
    }])
    .directive('tcEvent', ['TagCommander','$log', function (TagCommander, $log) {
        return {
            restrict: 'A',
            scope: false,
            link: function($scope, element, attrs) {
                $log.debug('Directive Tc Event');

                var exp = attrs.tcEvent;

                var ctrlRegex = new RegExp(/\$ctrl\.((\w|\.)+)/g);
                var scopeRegex = new RegExp(/\$scope\.((\w|\.)+)/g);

                var ctrlMatchs = exp.match(ctrlRegex);
                var ctrlValues = [];

                var scopeMatchs = exp.match(scopeRegex);
                var scopeValues = [];

                if (!!ctrlMatchs) {
                    for (var i=0; i<ctrlMatchs.length; i++) {
                        ctrlValues[i] = $scope.$eval(ctrlMatchs[i]);
                        if (!!ctrlValues[i]) {
                            exp = exp.replace(ctrlMatchs[i], JSON.stringify(ctrlValues[i]));
                        } else {
                            $log.error('the value of ' + ctrlMatchs[i] + ' is undefined! in directive tc-event');
                            return;
                        }
                    }
                }
                if (!!scopeMatchs) {
                    for (var i=0; i<scopeMatchs.length; i++) {
                        var sm = scopeMatchs[i].replace('$scope.', '');
                        scopeValues[i] = $scope.$eval(sm);
                        if (!!scopeValues[i]) {
                            exp = exp.replace(scopeMatchs[i], JSON.stringify(scopeValues[i]));
                        } else {
                            $log.error('the value of ' + scopeMatchs[i] + ' is undefined! in directive tc-event');
                            return;
                        }
                    }
                }
                if (exp[0] === '{') {
                    try {
                        var vars = JSON.parse(exp);
                    } catch (error) {
                        $log.error('the argument ' + exp + ' you provided to tc-event directive is not valid JSON', error);
                    }
                } else {
                    $log.error('the argument ' + exp + ' you provided to tc-event directive is not in the form of a JSON, you need to provie a key value JSON object');
                }
                TagCommander.captureEvent(vars['eventId'], element[0], vars['data']);
            }
        };
    }])
    .provider('TagCommander',  ['$logProvider',function ($logProvider) {

        var self = this,
            trackRoutes = false,
            pageEvent = '$routeChangeSuccess';
        this._tcContainers = [];

        /**
         * the script URI correspond to the tag-commander script URL, it can either be a CDN URL or the path of your script
         * @param {string} id the id the script node will have
         * @param {string} uri the source of the script
         * @param {string} node the node on witch the script will be placed, it can either be head or body
         */
        this.addContainer = function (id, uri, node) {
            this._tcContainers.push({'id': id, 'uri': uri});
            var tagContainer = document.createElement('script');
            tagContainer.setAttribute('type', 'text/javascript');
            tagContainer.setAttribute('src', uri);
            tagContainer.setAttribute('id', id);
            if (typeof node !== 'string') {
                console.warn('you didn\'t specify where you wanted to place the script, it will be placed in the head by default');
                document.querySelector('head').appendChild(tagContainer);
            } else if (node.toLowerCase() === 'head' || node.toLowerCase() === 'body'){
                document.querySelector(node.toLowerCase()).appendChild(tagContainer);
            } else {
                console.warn('you didn\'t correctily specify where you wanted to place the script, it will be placed in the head by default');
                document.querySelector('head').appendChild(tagContainer);
            }
        };

        /**
         * The script URI correspond to the tag-commander script URL, it can either be a CDN URL or the path of your script
         * @param {string} id
         */
        this.removeContainer = function (id) {

          var container = document.getElementById(id);
          var containers = self._tcContainers.slice(0);

          document.querySelector('head').removeChild(container);

          for(var i = 0; i < containers.length; i++){
            if(containers[i].id === id){
              self._tcContainers.splice(i, 1);
            }
          }
        };

        /**
         * with this method you can set the event name corresponding to the URL change
         * @param {string} name of the event you wan to track
         */
        this.setPageEvent = function (name) {
            pageEvent = name;
            return this;
        };
        /**
         * will display the debug messages if true
         * @param {boolean} debug if set to true it will activate the debug msg default is false
         */
        this.setDebug = function (debug) {
            this.debug = debug;
            $logProvider.debugEnabled(debug);
        };

        /**
         * allows the router to be tracked
         * @param {boolean} b will read routes if set to true
         */
        this.trackRoutes = function (b) {
            trackRoutes = !!b;
            return this;
        };

        /**
         * Public Service
         */
        this.$get = [
            '$location',
            '$log',
            '$rootScope',
            '$window',
            '$injector',
            function ($location, $log, $rootScope, $window, $injector) {
                var that = this;

                $log.debug('$get TagCommander PROVIDER');

                var $route = {};
                if (!!trackRoutes) {
                    if (!$injector.has('$route') || !$injector.has('$location')) {
                        $log.warn('$route or $location service is not available. Make sure you have included ng-route in your application dependencies.');
                    } else {
                        $route = $injector.get('$route');
                        $location = $injector.get('$location');
                    }
                }

                /**
                 * set or update the value of the var
                 * @param {string} tcKey
                 * @param {*} tcVar
                 */
                var setTcVar = function (tcKey, tcVar) {
                    if (typeof tcKey === 'string' &&
                        tcVar !== undefined) {
                            $window.tc_vars[tcKey] = tcVar;
                    } else {
                        if (typeof tcKey === 'string') {
                            $log.error('the tag cannot be add as the key is not a string');
                        } else {
                            $log.error('the tagValue is undefined');
                        }
                    }
                };

                /**
                 * set your varibles for the different providers, when called the first time it
                 * instantiate the external varible
                 * @param {object} vars
                 */
                var setTcVars = function (vars) {
                    if (typeof vars === 'object' && $window.tc_vars === undefined) {
                        $window.tc_vars = vars;
                    } else if (typeof vars === 'object') {
                        var listOfVars = Object.keys(vars);
                        for (var i=0; i < listOfVars.length; i++) {
                            this.setTcVar(listOfVars[i], vars[listOfVars[i]]);
                        }
                    } else {
                        $log.error('the vars that you provided are not in the form of an object', vars)
                    }
                    $log.debug('setTcVars', $window.tc_vars);
                };

                /**
                 * get the value of the var
                 * @param {string} tcKey
                 */
                var getTcVar = function (tcKey) {
                    return $window.tc_vars[tcKey] === null ? $window.tc_vars[tcKey] : false;
                };

                /**
                 * removes the var by specifying the key
                 * @param {string} varKey
                 */
                var removeTcVar = function (varKey) {
                    if (typeof $window.tc_vars[varKey] === 'string') {
                        delete $window.tc_vars[varKey];
                    } else {
                        if ($window.tc_vars[varKey] === undefined) {
                            $log.error('the key ' + varKey + ' does not exist and therfore cannot be removed');
                        } else {
                            $log.error('the key is not a string', varKey);
                        }
                    }
                };

                /**
                 * will reload all the containers
                 * @param {object} options can contain some options in a form of an object
                 */
                var reloadAllContainers = function(options) {
                    var options = options || {};
                    $log.debug('Reload all containers ', typeof options === 'object' ? 'with options ' + options : '');
                    $window.tC.container.reload(options);
                };

                /**
                 * will reload a specifique container
                 * @param {string} ids
                 * @param {string} idc
                 * @param {object} options can contain some options in a form of an object
                 */
                var reloadContainer = function(ids, idc, options){
                    if((!ids || !idc) && typeof ids !== 'number' && typeof idc !== 'number') {
                        $log.error('Cannot reload container with no ids or idcs');
                        return false;
                    }
                    var options = options || {};
                    $log.debug('Reload container ids: ' + ids + ' idc: ' + idc, typeof options === 'object' ? 'with options: ' + options : '');
                    $window.tC['container_' + ids + '_' + idc].reload(options);
                };

                /**
                 * will set an TagCommander event
                 * @param {string} eventLabel the name of your event
                 * @param {HTMLElement} element the HTMLelement on witch the event is attached
                 * @param {object} data the data you want to transmit
                 */
                var captureEvent = function(eventLabel, element, data){
                    if (typeof data  === 'object') {
                        $window.tC.event[eventLabel](element, data);
                    }
                };

                if (trackRoutes) {
                    $rootScope.$on(pageEvent, function () {
                        if (!!$route.current.tcReloadOnly) {
                            if (Array.isArray($route.current.tcReloadOnly)) {
                                if (typeof $route.current.tcReloadOnly[0] === 'object') {
                                    $route.current.tcReloadOnly.forEach(function (container) {
                                        reloadContainer(container['ids'], container['idc'], container['options']);
                                    });
                                } else {
                                    $log.error('the parameter tcExclude you providered to the router is not valid');
                                }
                            } else {
                                $log.error('the parameter tcExclude you providered to the router is not valid, you need to provide an array of objects');
                            }
                        } else {
                            reloadAllContainers();
                        }
                    });
                }

                return {
                    tc_vars: $window.tc_vars,
                    pageEvent: pageEvent,
                    setTcVar: setTcVar,
                    setTcVars: setTcVars,
                    getTcVar: getTcVar,
                    addContainer: that.addContainer,
                    removeTcVar: removeTcVar,
                    removeContainer: that.removeContainer,
                    reloadAllContainers: reloadAllContainers,
                    reloadContainer: reloadContainer,
                    captureEvent: captureEvent
                }
            }
        ];
    }]);
    return angular.module('angularjs-tag-commander');
}));
