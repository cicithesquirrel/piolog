"use strict";

var assert = require('assert');
var model = require('../../model');
var matchers = require('../../matchers');

exports.testPlayerName = function (test) {

    test.expect(3);

    var game = model.newGame();
    matchers.match("Le joueur 0 s'appelle maintenant Some Player 0.", game);
    matchers.match("Le joueur 2 s'appelle maintenant Some Player 2.", game);

    //console.log(JSON.stringify(game));

    //console.log(game.players['Some Player 0']);

    assert.deepEqual(game.players['Some Player 0'], {});
    assert.deepEqual(game.players['Some Player 1'], undefined);
    assert.deepEqual(game.players['Some Player 2'], {});

    test.ok(game.playerOrder[0] === 'Some Player 0');
    test.ok(game.playerOrder[1] === undefined);
    test.ok(game.playerOrder[2] === 'Some Player 2');

    test.done();
};

exports.testLongestRoad = function (test) {

    test.expect(1);

    var game = model.newGame();
    matchers.match("Some Player a la route la plus longue.", game);

    //console.log(JSON.stringify(game));

    test.ok(game.turns[0].longestRoad === 'Some Player');

    test.done();
};

exports.testStrongestKnight = function (test) {

    test.expect(1);

    var game = model.newGame();
    matchers.match("Some Player détient le chevalier le plus puissant.", game);

    //console.log(JSON.stringify(game));

    test.ok(game.turns[0].strongestKnight === 'Some Player');

    test.done();
};