# angular-tag-commander

This service lets you integrate Tag Commander in your AngularJS applications easily.
- [Official website](https://www.commandersact.com/fr/produits/tagcommander/)

## Features

 - automatic page tracking
 - event catching
 - multiple containers

## Installation and Quick Start
The quick start is designed to give you a simple, working example for the most common usage scenario. There are numerous other ways to configure and use this library as explained in the documentation.

### 1- Installation:
You can install the module from a package manager of your choice directly from the command line

```sh
# Bower
bower install angularjs-tag-commander

# NPM
npm i angularjs-tag-commander
```

Or alternatively, grab the dist/index.es5.min.js and include it in your project

In your application, declare the angularjs-tag-commander module dependency.

```html
<script src="nodes_components/angularjs-tag-commander/dist/index.es5.min.js"></script>
```
or if you are using es6, import it like so
```javascript
import angularJsTagCommander from 'angularjs-tag-commander';
```

### 2- In your application, declare dependency injection:

```javascript
var myApp = angular.module('myModule', ['angularjs-tag-commander']);
```

### 3- add your Tag commander containers and start tracking:

```JavaScript
import angularJsTagCommander from 'angularjs-tag-commander';

var myApp = angular.module('tag-commander-exemple-app', [angularJsTagCommander]);

myApp.config(['TagCommanderProvider', (TagCommanderProvider) => {
    // you need to provide URIS to load containers script.
    // function addContainer (id, uri, node)
    TagCommanderProvider.addContainer('a_name_for_the_container_id', '/the/path/to/tag-commander-container.js', 'head');
    // you can add as many container as you like

    // but you can also remove them
    TagCommanderProvider.removeContainer('my_tag_container_id');

    // you can set debug by setting this to true
    TagCommanderProvider.setDebug(true);

    // you can track the url of your app by setting this
    TagCommanderProvider.trackRoutes(true);

    // you can also set the name of the event witch is triggered the page change,
    // the default is set to '$routeChangeSuccess'
    TagCommanderProvider.setPageEvent('$stateChangeSuccess');
}]);
```

Congratulations! [angularjs-tag-commander](https://github.com/TagCommander/angular-tag-commander) is ready 

## Declaring TagCommander in your Controller
```js
  // As an example, a simple controller to make calls from:
  app.controller('SampleController', function (TagCommander) {
    // Add calls as desired - see below
  });
```

## Set Vars
### In a controller
The `setVar` call allows to set your `tc_vars`.
```js
TagCommander.setTcVars({
    env_template : "shop",
    env_work : "dev",
    env_language : "en",
    user_id : "124",
    user_logged : "true",
    user_age: "32",
    user_newcustomer : "false",
});
// you can also override some varible
if (isNewUser) {
    TagCommander.setTcVars({
        user_newcustomer : "true",
    });
}
// or set/update them individualy
TagCommander.setTcVar('env_template', 'super_shop');

// you can also remove a var
TagCommander.removeTcVars('env_template');
}
```
### As a directive
You can use the directive tcSetVars direcly on any html node
```html
<html-element class="sm-button green-500" tc-set-vars='{"env_language": "fr"}'></html-element>

<!-- other exemples -->
<template class="sm-button green-500" tc-set-vars='{"env_language": $ctrl.default_language}'></template>
<div class="sm-button green-500" tc-set-vars='{"env_language": $scope.default_language}'></div>
```
## Get Var
### In a controller
```js
var myVar = TagCommander.getTcVar('VarKey');
```
## Remove Var
### In a controller
```js
var myVar = TagCommander.removeTcVar('VarKey');
```

## Capture Events
### In a controller
```js
var eventId = '1234';
var data = '{"env_language": $ctrl.default_language}';

TagCommander.captureEvent(eventId, data);
```
### As a directive
```html
<button class="sm-button green-500" tc-event='{eventId: myEventId, data: {"env_language": $scope.default_language}}'> change to default language </button>

```

## How to reload your container
When you update your variable you also need to update your container to propagate the changes
```js
var idc = '1234';
var ids = '1234';
var options = {
    exclusions: [
        "datastorage",
        "deduplication",
        "internalvars",
        "privacy"
    ]
};
TagCommander.reloadContainer(ids, idc, options);
// or you can reload all the containers
TagCommander.reloadAllContainers(options);
```
## Automatic reload of your containers by tracking Routes
### The configuration

you need to set TagCommanderProvider.trackRoutes(true); to true in your app configuration
```js
TagCommanderProvider.trackRoutes(true);
```

then you can configure the your route by using the tcReloadOnly option in your route configuration

```js
export const appRouteProvider = ['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/home', {
        controller: homeComponent,
        tcReloadOnly: {ids :4056, idc: 12} // will only reload the container 4056_12
    })
    .when('/shop', {
        controller: shopComponent,
        tcReloadOnly: [
            {ids: 4056, idc: 12}, 
            {ids: 4056, idc: 11, options: 
                { exclusions: ["datastorage", "deduplication"] } // you can set the options for your container
            }
        ]
    })
    .when('/dashboard', {
        controller: dashboardComponent,
        // if no tcReloadOnly is set it will reload all the containers if the trackRoute is true (in the configuration)
    })
}];  
```
If you don't set the TagCommanderProvider.trackRoutes(true); (or you set it to false) you will have to reload your container manually

```js
// somewhere in your controller
// reload a specifique container
TagCommander.reloadContainer(ids, idc, options);
// or you can reload all the containers
TagCommander.reloadAllContainer(options);
```

## Sample app
To help you with your implementation we provided a sample application. to run it
```bash
cd tag-commander-sample-app
yarn start
```
then go to [http://localhost:8080](http://localhost:8080)


## License

As AngularJS itself, this module is released under the permissive [MIT License](http://revolunet.mit-license.org). Your contributions are always welcome.

## Development

After forking you will need to run the following from a command line to get your environment setup:

1. ```yarn install```

After install you have the following commands available to you from a command line:

1. ```gulp```
