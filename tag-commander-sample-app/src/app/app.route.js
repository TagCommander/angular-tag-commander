/**
 * Application route definition.
 */
import homeComponent from './home/home.component';
import shopComponent from './shop/shop.component';
import dashboardComponent from './dashboard/dashboard.component';

export function appRoute ($stateProvider, $urlRouterProvider) {
  'ngInject';

  $stateProvider
    .state('app', {
      url      : '',
      abstract: true,
      component: 'app',
    })
    .state('app.home', {
      url      : '/home',
      component: 'home'
    })
    .state('app.shop', {
      url      : '/shop',
      component: 'shop',
    })
    .state('app.dashboard', {
      url      : '/dashboard',
      component: 'dashboard'
    });

  $urlRouterProvider.otherwise('/home');
}
export const appRouteProvider = ['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
   .when('/home', {
    controller: homeComponent,
    tcReloadOnly: {ids :4056, idc: 12}
  })
  .when('/shop', {
    controller: shopComponent,
    tcReloadOnly: [
      {ids :4056, idc: 12}, 
      {ids :4056, idc: 11, options: {
          exclusions: ["datastorage", "deduplication"]
        }
      }
    ]
  })
  .when('/dashboard', {
    controller: dashboardComponent,
  })
}];
