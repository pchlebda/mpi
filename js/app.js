/**
 * Created by Piotr on 2015-05-22.
 */
angular.module('myApp', []).
    controller('MainController', ['$scope', function ($scope) {

        $scope.step = 0;

        $scope.createTuringMachine = function(machine){
            console.log(machine);
            $scope.step = 1;
        };

    }]);