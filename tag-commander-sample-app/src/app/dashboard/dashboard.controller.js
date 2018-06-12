export default ['$scope', 'TagCommander', function dashboardController($scope, TagCommander) {

  TagCommander.setTcVars({
    env_template : "",
    env_work : "dev",
    env_language : "en",
    user_id : "124",
    user_logged : "false",
    user_age : "23",
    user_newcustomer : "false",
  });
    // note that the env_template was previously set in the setTcVars
  TagCommander.setUrlVars(['env_template', 'env_work']);
}];
