"use strict";

var assert = require('assert');
var model = require('../../src/js/model');

exports.testCloneWithSubobjects = function (test) {

    test.expect(1);

    var o, clone;

    o = {
        someProperty: {},
        otherProperty: {
            anotherProperty: [1, 2, 3]
        }
    };

    clone = model.__clone(o);

    //console.log(JSON.stringify(clone));

    test.ok(clone !== o);

    assert.deepEqual(clone, o);

    test.done();
};

exports.testCloneWithProperties = function (test) {

    test.expect(1);

    var o, clone;

    o = {
        someProperty: "Some Value",
        otherProperty: [1, 2, 3]
    };

    clone = model.__clone(o);

    //console.log(JSON.stringify(clone));

    test.ok(clone !== o);

    assert.deepEqual(clone, o);

    test.done();
};

exports.testCloneWhenEmpty = function (test) {

    test.expect(2);

    var o, clone;

    o = {};
    clone = model.__clone(o);

    assert.deepEqual(clone, o);

    clone.someProperty = "Some Value";

    test.ok(clone !== o);
    test.ok(!o.someProperty, "Property added to clone should not be added to original object");

    test.done();
};

exports.testGetLastTurnNumber = function (test) {

    test.expect(3);

    var game = model.newGame();

    test.ok(game.getLastTurnNumber() === 0, "Was " + game.getLastTurnNumber());

    game.startNextTurn();

    test.ok(game.getLastTurnNumber() === 1, "Was " + game.getLastTurnNumber());

    game.startNextTurn();

    test.ok(game.getLastTurnNumber() === 2, "Was " + game.getLastTurnNumber());

    test.done();
};

exports.testGetScore = function (test) {
    test.expect(6);

    test.ok(1 === model.getScore(1, 0, 0), 'Score for 1 colony must be 1');
    test.ok(2 === model.getScore(2, 0, 0), 'Score for 2 colonies must be 2');

    test.ok(2 === model.getScore(0, 1, 0), 'Score for 1 city must be 2');
    test.ok(4 === model.getScore(0, 2, 0), 'Score for 2 cities must be 4');

    test.ok(2 === model.getScore(0, 0, 1), 'Score for single bonus must be 2');

    test.ok(4 === model.getScore(0, 0, 2), 'Score for both bonuses must be 4');

    test.done();
};

exports.testUpdateScoreOfLastTurn = function (test) {
    test.expect(3);

    var game = model.newGame(),
        turnOfPlayer = game.getLastTurnOfPlayer("Some Player"),
        turn = game.getLastTurn();

    turnOfPlayer.colony = 1;
    turnOfPlayer.city = 2;

    game.updateScoreOfLastTurn();

    test.ok(5 === turnOfPlayer.score, 'Score for 1 colony and 2 cities must be 5');

    turn.strongestKnight = "Some Player";
    turn.longestRoad = "Other Player";

    game.updateScoreOfLastTurn();

    test.ok(7 === turnOfPlayer.score, 'Score for 1 colony and 2 cities and Strongest Knight must be 7');

    turn.longestRoad = "Some Player";

    game.updateScoreOfLastTurn();

    test.ok(9 === turnOfPlayer.score, 'Score for 1 colony and 2 cities and Strongest Knight and Longest Road must be 9');

    test.done();
};