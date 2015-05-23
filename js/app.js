/**
 * Created by Piotr on 2015-05-22.
 */
angular.module('myApp', []).
    controller('MainController', ['$scope', function ($scope) {

        $scope.step = 0;

        var machineDef;
        var dtmInstance;

        $scope.stateListener = function (states) {
            if (states != undefined) {
                $scope.states = states.split(/\s*,\s*/);
            }
        };

        $scope.createTuringMachine = function (form, machine) {
            if (form.$valid) {
                machine.states = machine.states.split(/\s*,\s*/);
                machine.inputAlphabet = machine.inputAlphabet.split(/\s*,\s*/);
                if (machine.tapeAlphabet != undefined) {
                    machine.tapeAlphabet = machine.tapeAlphabet.split(/\s*,\s*/);
                    machine.tapeAlphabet = machine.inputAlphabet.concat(machine.tapeAlphabet);
                } else {
                    machine.tapeAlphabet = machine.inputAlphabet;
                }

                machineDef = machine;
                machineDef.transitions = [];

                $scope.step = 1;
                machine.moves = ['L', 'R', '_'];
                $scope.machine = machine;
            }
        };

        $scope.addTransition = function (form, transition) {
            if (form.$valid) {
                machineDef.transitions.push({
                    condition: {state: transition.condState, symbol: transition.condSymbol},
                    action: {
                        state: transition.actionState,
                        symbol: transition.actionSymbol,
                        move: transition.actionMove
                    }
                })
                $scope.transition = null;
            } else {
                alert("Wszystkie pola są wymagane.");
            }
        };

        $scope.createDtm = function () {
                $scope.step = 2;
        };

        $scope.runDtm = function (form) {
            if (form.$valid) {
                for (var i=0; i<$scope.inputWord.length; ++i) {
                    if (machineDef.inputAlphabet.indexOf($scope.inputWord[i]) == -1) {
                        alert("Symbole słowa wejściowego muszą należeć do alfabetu wejściowego.");
                        return;
                    }
                }

                dtmInstance = new DeterministicTuringMachine(machineDef, 100, $scope.inputWord);
                $scope.step = 3;
            }
        };

    }]);