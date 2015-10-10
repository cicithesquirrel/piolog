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

    describe('Statistics', function () {

        it('Number of turns at start', function () {

            var game = model.newGame();
            var stats = model.computeStats(game);

            test.number(stats.numberOfTurns).is(0);
        });

        it('Number of turns at turn #3', function () {

            var game = model.newGame();
            game.startNextTurn();
            game.startNextTurn();
            game.startNextTurn();

            var stats = model.computeStats(game);

            test.number(stats.numberOfTurns).is(3);
        });

        it('Dice stats at start', function () {

            var game = model.newGame();

            var stats = model.computeStats(game);

            test.number(stats.dice.totalNumber).is(0);
            test.array(stats.dice.byScore).is([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        });

        it('Dice stats at after a few turns', function () {

            var game = model.newGame();
            game.startNextTurn();
            game.getLastTurnOfPlayer("Player 1").dice = 3;
            game.getLastTurnOfPlayer("Player 2").dice = 2;
            game.getLastTurnOfPlayer("Player 3").dice = 8;
            game.getLastTurnOfPlayer("Player 4").dice = 2;
            game.startNextTurn();
            game.getLastTurnOfPlayer("Player 1").dice = 7;
            game.getLastTurnOfPlayer("Player 2").dice = 2;
            game.getLastTurnOfPlayer("Player 3").dice = 12;
            game.getLastTurnOfPlayer("Player 4").dice = 8;

            var stats = model.computeStats(game);

            test.number(stats.dice.totalNumber).is(8);
            test.array(stats.dice.byScore).is([3, 1, 0, 0, 0, 1, 2, 0, 0, 0, 1]);
        });

        it('Dice stats by player at after a few turns', function () {

            var game = model.newGame();
            game.playerOrder = ["Player 1", "Player 2", "Player 3", "Player 4"];
            game.startNextTurn();
            game.getLastTurnOfPlayer("Player 1").dice = 3;
            game.getLastTurnOfPlayer("Player 2").dice = 2;
            game.getLastTurnOfPlayer("Player 3").dice = 2;
            game.getLastTurnOfPlayer("Player 4").dice = 2;
            game.startNextTurn();
            game.getLastTurnOfPlayer("Player 1").dice = 3;
            game.getLastTurnOfPlayer("Player 2").dice = 2;
            game.getLastTurnOfPlayer("Player 3").dice = 7;
            game.getLastTurnOfPlayer("Player 4").dice = 2;

            var stats = model.__computeDiceByPlayerStats(game);

            test.array(stats[2]).is([{
                name: "Player 1",
                times: 0
            }, {
                name: "Player 2",
                times: 2
            }, {
                name: "Player 3",
                times: 1
            }, {
                name: "Player 4",
                times: 2
            }]);

            test.array(stats[3]).is([{
                name: "Player 1",
                times: 2
            }, {
                name: "Player 2",
                times: 0
            }, {
                name: "Player 3",
                times: 0
            }, {
                name: "Player 4",
                times: 0
            }]);

            test.array(stats[4]).is([{
                name: "Player 1",
                times: 0
            }, {
                name: "Player 2",
                times: 0
            }, {
                name: "Player 3",
                times: 0
            }, {
                name: "Player 4",
                times: 0
            }]);

            test.array(stats[7]).is([{
                name: "Player 1",
                times: 0
            }, {
                name: "Player 2",
                times: 0
            }, {
                name: "Player 3",
                times: 1
            }, {
                name: "Player 4",
                times: 0
            }]);
        });

    });


});
