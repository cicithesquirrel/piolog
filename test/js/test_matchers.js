"use strict";

var assert = require('assert');
var model = require('../../src/js/model');
var matchers = require('../../src/js/matchers');

exports.testPlayerName = function (test) {

    test.expect(3);

    var game = model.newGame();
    matchers.match("Le joueur 0 s'appelle maintenant Some Player 0.", game);
    matchers.match("Le joueur 2 s'appelle maintenant Some Player 2.", game);

    //console.log(JSON.stringify(game));

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

exports.testAddDice = function (test) {

    test.expect(2);

    var game = model.newGame();

    matchers.match("Some Player a fait 7.", game);
    matchers.match("Other Player a fait 2.", game);

    var turn = game.turns[0];

    //console.log(JSON.stringify(turn));

    test.ok(turn["Some Player"].dice === 7);
    test.ok(turn["Other Player"].dice === 2);

    test.done();
};
