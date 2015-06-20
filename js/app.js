/**
 * Created by Piotr on 2015-05-22.
 */
angular.module('myApp', []).
    controller('MainController', ['$scope', function ($scope) {

        $scope.step = 0;
        $scope.nextStep = nextStep;
        $scope.startAnimation = startAnimation;
        $scope.pauseAnimation = pauseAnimation;
        $scope.createTuringMachineAddingBinaryOne = createTuringMachineAddingBinaryOne;
        $scope.backToStep = backToStep;

        var machineDef;
        var dtmInstance;
        var interval = 2000;
        var animationActive = false;
        var funcId;

        var getTapeString = function (dtm) {
            var tape = dtm.getTape();
            var headPos = dtm.getHeadPosition();
            var tapeString = "";

            for (var i = 0; i < tape.length; ++i) {
                if (i != headPos) {
                    tapeString = tapeString.concat(tape[i]).concat(" ");
                } else {
                    tapeString = tapeString.concat("[").concat(tape[i]).concat("]");
                }
            }
            return tapeString;
        };


        var getHead = function (dtm) {
            var tape = dtm.getTape();
            var headPos = dtm.getHeadPosition();
            return tape[headPos];
        };

        function getLeftTape(dtm, elementNumber) {
            var leftTape = [];

            var tape = dtm.getTape();
            var headPos = dtm.getHeadPosition();
            var idx = headPos - elementNumber;

            for (idx; idx < 1; ++idx) {
                leftTape.push('#');
            }

            for (idx; idx < headPos; ++idx) {
                leftTape.push(tape[idx]);
            }

            return leftTape;
        }

        function getRightTape(dtm, elementNumber) {
            var rightTape = [];

            var tape = dtm.getTape();
            var headPos = dtm.getHeadPosition();
            var tapeLength = tape.length;
            var addedElements = 0;

            for (var i = headPos + 1; addedElements < elementNumber && i < tapeLength; ++i) {
                rightTape.push(tape[i]);
                ++addedElements;
            }
            for (addedElements; addedElements < elementNumber; ++addedElements) {
                rightTape.push('#');
            }
            return rightTape;
        }

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
                });
                $scope.transition = null;
            } else {
                alert("Wszystkie pola są wymagane.");
            }
        };

        $scope.removeTransition = function (index) {
            machineDef.transitions.splice(index, 1);
        };


        $scope.createDtm = function () {
            $scope.step = 2;
        };

        $scope.runDtm = function (form) {
            if (form.$valid) {
                for (var i = 0; i < $scope.inputWord.length; ++i) {
                    if (machineDef.inputAlphabet.indexOf($scope.inputWord[i]) == -1) {
                        alert("Symbole słowa wejściowego muszą należeć do alfabetu wejściowego.");
                        return;
                    }
                }

                dtmInstance = new DeterministicTuringMachine(machineDef, 100, $scope.inputWord);
                $scope.tape = getTapeString(dtmInstance);
                $scope.currentState = dtmInstance.getCurrentState();
                drawTuringMachine();
                $scope.step = 3;
            }
        };


        function nextStep() {
            if (!dtmInstance.isInFinishState()) {
                dtmInstance.nextStep();
                $scope.tape = getTapeString(dtmInstance);
                $scope.currentState = dtmInstance.getCurrentState();
                drawTuringMachine();
                displayState();
            } else {
                pauseAnimation();
                alert("Maszyna jest w stanie akceptującym");
            }
        }

        function backToStep(index) {
            $scope.step = index;
            clearInterval(funcId);
        }

        function startAnimation() {
            if (!animationActive) {
                funcId = setInterval(nextStep, interval);
                animationActive = true;
            }
        }

        function pauseAnimation() {
            if (animationActive) {
                clearInterval(funcId);
                animationActive = false;
            }
        }

        function drawTuringMachine() {
            var canvas = document.getElementById("turingMachine");
            var ctx = canvas.getContext("2d");
            ctx.font = "20px Georgia";
            var tapeElements = 17;
            var side = 20;

            var leftTape = getLeftTape(dtmInstance, 8);
            var rightTape = getRightTape(dtmInstance, 8);
            var head = getHead(dtmInstance);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawLeftTape(ctx, leftTape);
            drawHeadMachine(ctx, head);
            drawRightTape(ctx, rightTape);
        };

        function drawLeftTape(ctx, leftTape) {
            var tapeElements = 8;
            for (i = 0; i < tapeElements; ++i) {
                drawBlock(ctx, i, leftTape[i]);
            }
        }

        function drawRightTape(ctx, rightTape) {
            var tapeElements = 8;
            var offset = 9;
            for (i = 0; i < tapeElements; ++i) {
                drawBlock(ctx, i + offset, rightTape[i]);
            }
        }

        function drawBlock(ctx, index, text) {
            var side = 20;
            var offset = getOffset(index);
            ctx.strokeStyle = "blue";
            ctx.strokeRect(offset, 10, side, side);
            ctx.fillStyle = 'black';
            ctx.fillText(text, offset + 5, side + 5);
        }

        function drawHeadMachine(ctx, head) {
            drawBlock(ctx, 8, head);
            ctx.fillStyle = "green";
            ctx.beginPath();
            ctx.moveTo(390, 50);
            ctx.lineTo(400, 35);
            ctx.lineTo(410, 50);
            ctx.lineTo(390, 50);
            ctx.closePath();
            ctx.fill();

        };

        function getOffset(index) {
            var side = 20;
            var blockSpace = 20;
            var offset = 70;
            return index * (side + blockSpace) + offset;
        };


        function createTuringMachineAddingBinaryOne() {

            var transitions = new Array();

            transitions.push(createTransition('p', '0', 'p', '0', 'R'));
            transitions.push(createTransition('p', '1', 'p', '1', 'R'));
            transitions.push(createTransition('p', '_', 'q', '_', 'L'));

            transitions.push(createTransition('q', '0', 'r', '1', '_'));
            transitions.push(createTransition('q', '1', 'q', '0', 'L'));
            transitions.push(createTransition('q', '_', 'r', '1', '_'));

            machineDef = {states: ['p', 'q', 'r'], initState: 'p', finiteStates: ['r'],
                inputAlphabet: ['0', '1'], tapeAlphabet: ['0', '1', '.'], transitions: transitions};
            $scope.step = 2;
        }

        function createTransition(conditionState, conditionSymbol, actionState, actionSymbol, move) {
            return {condition: {state: conditionState, symbol: conditionSymbol}, action: {state: actionState, symbol: actionSymbol, move: move}};
        }

        function displayState() {
            document.getElementById("currentStateHeader").innerHTML = "Aktualny stan: " + dtmInstance.getCurrentState();
        }

    }
    ])
;