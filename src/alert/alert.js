angular.module("ui.bootstrap.alert", [])

.constant('alertConfig', {
  templateUrl: 'template/alert/alert.html'
})

.directive('alert', ['alertConfig', function (alertConfig) {
  return {
    restrict:'EA',
    templateUrl: alertConfig.templateUrl,
    transclude:true,
    replace:true,
    scope: {
      type: '=',
      close: '&'
    },
    link: function(scope, iElement, iAttrs, controller) {
      scope.closeable = "close" in iAttrs;
    }
  };
}]);
