"use strict";

var test = require('unit.js');
var model = require('../../src/js/model');

describe('"model" tests', function () {

    describe('Clone', function () {

        it('With Sub-objects', function () {

            var o = {
                someProperty: {},
                otherProperty: {
                    anotherProperty: [1, 2, 3]
                }
            };

            var clone = model.__clone(o);

            test.object(clone).isNotIdenticalTo(o);

            test.object(clone).is(o);

        });

        it('With properties', function () {

            var o = {
                someProperty: "Some Value",
                otherProperty: [1, 2, 3]
            };

            var clone = model.__clone(o);

            test.object(clone).isNotIdenticalTo(o);

            test.object(clone).is(o);

        });

        it('Empty', function () {
            var o = {};

            var clone = model.__clone(o);

            test.object(clone).isNotIdenticalTo(o);
            test.object(clone).is(o);

            clone.someProperty = "Some Value";

            test.object(o).hasNotProperty("someProperty");
        });

    });

    describe('Get last turn number', function () {

        it('Initial turn', function () {
            var game = model.newGame();

            test.number(game.getLastTurnNumber()).is(0);

        });

        it('Nth turn', function () {
            var game = model.newGame();
            game.startNextTurn();
            game.startNextTurn();

            test.number(game.getLastTurnNumber()).is(2);
        });


    });

    describe('Score', function () {

        it('For nothing', function () {

            test.number(model.getScore(0, 0, 0)).is(0);
        });

        it('For colonies', function () {

            test.number(model.getScore(1, 0, 0)).is(1);
            test.number(model.getScore(2, 0, 0)).is(2);
        });

        it('For cities', function () {

            test.number(model.getScore(0, 1, 0)).is(2);
            test.number(model.getScore(0, 2, 0)).is(4);
        });

        it('For bonuses', function () {

            test.number(model.getScore(0, 0, 1)).is(2);
            test.number(model.getScore(0, 0, 2)).is(4);
        });
    });

    describe('Update score of turn', function () {

        it('For 1 colony and 2 cities', function () {

            var game = model.newGame();
            var turnOfPlayer = game.getLastTurnOfPlayer("Some Player");
            turnOfPlayer.colony = 1;
            turnOfPlayer.city = 2;

            game.updateScoreOfLastTurn();

            test.number(turnOfPlayer.score).is(5);
        });

        it('With 1 bonus', function () {

            var game = model.newGame();
            var turn = game.getLastTurn();
            var turnOfPlayer = game.getLastTurnOfPlayer("Some Player");
            turn.strongestKnight = "Some Player";
            turn.longestRoad = "Other Player";

            game.updateScoreOfLastTurn();

            test.number(turnOfPlayer.score).is(2);
        });

        it('With 2 bonuses', function () {

            var game = model.newGame();
            var turn = game.getLastTurn();
            var turnOfPlayer = game.getLastTurnOfPlayer("Some Player");
            turn.strongestKnight = "Some Player";
            turn.longestRoad = "Some Player";

            game.updateScoreOfLastTurn();

            test.number(turnOfPlayer.score).is(4);
        });
    });


});
