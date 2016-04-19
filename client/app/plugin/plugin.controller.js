'use strict';


angular.module('meccanoAdminApp')
  .controller('PluginListCtrl', function($scope, Registration, $state, $stateParams, Plugins) {
    console.log("*** PluginListCtrl ***");
    // Initialize variables
    $scope.pageNumber = 1;
    $scope.parametersFilter = $state.params;
    $scope.Plugins = Plugins;

    /** Function to load devices by device service
      * @param parameters {object}
      * @param status
      * @param device
      * @param group
      * @param page
      * @param size
      **/
    function getPlugins (parameters) {
      // Start load gif
      $scope.isLoading = true;
      $scope.Plugins.loadPlugins().get(parameters, function (res) {
        // Total Items to pagination
        $scope.totalItems = res.page.totalElements;
        $scope.Plugins.data = res.data;
        // Stop load gif
        $scope.isLoading = false;
      }, function (err){
        // Erase registeredDevices array if no device was found
        if (err.status === 404) {
          $scope.plugins.data = [];
          $scope.isLoading = false;
        }
      });
    }

    // Load devices by the parameters from url
    getPlugins($state.params);

    /**
      * Show Details in a lateral panel
      * @param plugin {object}
      */
    $scope.showDetails = function(plugin){
      $scope.Plugins.selected = plugin;
      $scope.Plugins.plugins().detail( { plugin: plugin.id }, function (res){
      });
    };

})
.controller('PluginDetailCtrl', function($scope, $http, $state, $stateParams, $rootScope, Devices, $uibModal, Messages,Auth, Modal,alertsPanel) {
  console.log("*** PluginDetailCtrl ***");
  $scope.Plugins = Plugins;
  // Remove plugin
  $scope.destroy = function() {
  $http.delete('api/plugins/' + $scope.plugin.id).then(function() {
      $state.go('plugin.list', $stateParams,{reload: true});
    });
  };
});
