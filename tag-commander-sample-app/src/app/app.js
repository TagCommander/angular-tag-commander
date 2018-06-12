/* global process */
import angular from 'angular';
import ngAnimate from 'angular-animate';
import ngAria from 'angular-aria';
import ngMessages from 'angular-messages';
import ngSanitize from 'angular-sanitize';
import ngMaterial from 'angular-material';
import ngRoute from 'angular-route';
import uiRouter from 'angular-ui-router';

import '../styles/main.scss';
import 'angular-material/angular-material.css';

import config from 'app.config';

import appConfig from './app.config';
import {appRoute, appRouteProvider} from './app.route';
import appComponent from './app.component';
import homeComponent from './home/home.component';
import shopComponent from './shop/shop.component';
import dashboardComponent from './dashboard/dashboard.component';

import angularJsTagCommander from 'angularjs-tag-commander';

export default angular.module('tag-commander-sample-app', [
  ngAnimate,
  ngAria,
  ngMessages,
  ngSanitize,
  ngMaterial,
  uiRouter,
  ngRoute,
  angularJsTagCommander
])
.config(appConfig)
.config(appRoute)
.config(appRouteProvider)
.config(['TagCommanderProvider', (TagCommanderProvider) => {
  //conf here
  TagCommanderProvider.setDebug(true);
  TagCommanderProvider.setPageEvent('$routeChangeSuccess');

  // setting the tags for the current and prevous URL
  TagCommanderProvider.trackRoutes(true);

  // to set the TagCommander container provide the id
  TagCommanderProvider.addContainer('container_head', '/tag-commander-head.js', 'head');
  TagCommanderProvider.addContainer('container_body', '/tag-commander-body.js', 'body');
}])
.constant('CONFIG', config)
.constant('ENVIRONNEMENT', process.env.ENV_NAME)
.component('app', appComponent)
.component('home', homeComponent)
.component('shop', shopComponent)
.component('dashboard', dashboardComponent)
.run(['TagCommander', function(TagCommander){

}])
.name;
