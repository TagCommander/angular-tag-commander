export default ['$scope','$route', 'TagCommander', function homeController($scope, $route, TagCommander) {

  TagCommander.setTcVars({
    env_template: '',
    env_work : "dev",
    env_language : "en",
    user_id : "123",
    user_logged : "false",
    user_age : "30",
    user_newcustomer : "false",
  });
  // note that the env_template was previously set in the setTcVars
  TagCommander.setUrlVars('env_template');
}];
