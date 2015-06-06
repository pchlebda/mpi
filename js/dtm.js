/**
 * Created by Szymon on 22.05.15.
 *
 * parameters:
 * parameters.states - States array, e.g. [0,1,2]
 * parameters.inputAlphabet - Input alphabet, e.g. ['a', 'b']
 * parameters.tapeAlphabet - Tape alphabet (extends input alphabet), e.g. ['_']
 * parameters.initState - Initial state, e.g. 0
 * parameters.finiteStates - Accepting states, e.g. [1, 2]
 * parameters.transitions - Transition function e.g.
 *   [
 *    {
 *        condition: {state: 0, symbol: '0'},
 *        action: {state: 1, symbol: '1', move: 'R'}
 *    },
 *    {
 *        condition: {state: 0, symbol: '1'},
 *        action: {state: 1, symbol: '0', move: 'L}
 *    }
 *   ]
 */
function DeterministicTuringMachine(parameters, tapeLength, inputWord) {

    var transitions = parameters.transitions;
    var finiteStates = parameters.finiteStates;
    var blank = '_';
    var currentState = parameters.initState;
    var tape = new Array(tapeLength);
    // initial head position is set to tapeLength/2
    var head = tapeLength / 2;

    var read = function () {
        return tape[head];
    };
    var write = function (value) {
        return tape[head] = value;
    };
    var move = function (direction) {
        switch (direction) {
            case 'L':
                head -= 1;
                break;
            case 'R':
                head += 1;
                break;
            case '_':
                break;
            default:
                throw new Error('Unsupported move ' + direction);
        }
    };
    var setCurrentState = function (newState) {
        currentState = newState;
    };

    var getAction = function (condition) {
        for (var i = 0; i < transitions.length; ++i) {
            var tmp = transitions[i].condition;
            if (tmp.state == condition.state && tmp.symbol == condition.symbol) {
                return transitions[i].action;
            }
        }
        return null;
    };

    (function () {
        // TODO validation input word with input alphabet
        var i = 0;
        if (inputWord.length > tapeLength / 2) {
            throw new Error('Too short tape');
        }
        for (; i < tapeLength / 2; ++i) {
            tape[i] = blank;
        }
        for (var j = 0; j < inputWord.length; ++i, ++j) {
            tape[i] = inputWord[j];
        }
        for (; i < tapeLength; ++i) {
            tape[i] = blank;
        }
    }());

    return {
        getTape: function () {
            return tape;
        },

        getCurrentState: function () {
            return currentState;
        },

        getHeadPosition: function () {
            return head;
        },

        nextStep: function () {
            var action = getAction({state: currentState, symbol: read()});
            if (action == null) {
                alert("Brak zdefiniowanej funkcji przejścia dla stanu " + currentState + " i wczytywanego symbolu " + read() + ".");
                throw new Error("Not defined transition");
            }
            write(action.symbol);
            move(action.move);
            setCurrentState(action.state);
        },

        isInFinishState: function () {
            if (finiteStates.indexOf(currentState) != -1) {
                return true;
            }
            return false;
        }
    };

}

/**
 * EXAMPLE
 *
 * var dtmInstance = new DeterministicTuringMachine(
 {
     states: [0,1,2],
     inputAlphabet: ['0', '1'],
     tapeAlphabet: [],
     initState: 0,
     finiteStates: [2],
     transitions: [
         {
             condition: {state: 0, symbol: '0'},
             action: {state: 1, symbol: '1', move: 'R'}
         },
         {
             condition: {state: 0, symbol: '1'},
             action: {state: 1, symbol: '0', move: 'R'}
         },
         {
             condition: {state: 0, symbol: '_'},
             action: {state: 2, symbol: '_', move: '_'}
         },
         {
             condition: {state: 1, symbol: '0'},
             action: {state: 0, symbol: '1', move: 'R'}
         },
         {
             condition: {state: 1, symbol: '1'},
             action: {state: 0, symbol: '0', move: 'R'}
         },
         {
             condition: {state: 1, symbol: '_'},
             action: {state: 2, symbol: '_', move: '_'}
         }
     ]
 }, 20, "01010101");
 *
 * */