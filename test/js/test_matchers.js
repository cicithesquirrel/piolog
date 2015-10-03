"use strict";

var test = require('unit.js');
var model = require('../../src/js/model');
var matchers = require('../../src/js/matchers');

describe('"matchers" tests', function () {

    it('Player name', function () {
        var game = model.newGame();
        matchers.match("Le joueur 0 s'appelle maintenant Some Player 0.", game);
        matchers.match("Le joueur 2 s'appelle maintenant Some Player 2.", game);

        test.array(game.playerOrder).is(['Some Player 0', undefined, 'Some Player 2']);
    });

    it('Longest road', function () {
        var game = model.newGame();
        matchers.match("Some Player a la route la plus longue.", game);

        test.string(game.turns[0].longestRoad).is('Some Player');
    });

    it('Strongest knight', function () {
        var game = model.newGame();
        matchers.match("Some Player détient le chevalier le plus puissant.", game);

        test.string(game.turns[0].strongestKnight).is('Some Player');
    });

    it('Set dice', function () {
        var game = model.newGame();
        matchers.match("Some Player a fait 7.", game);
        matchers.match("Other Player a fait 2.", game);

        var turn = game.turns[0];

        test.number(turn['Some Player'].dice).is(7);
        test.number(turn['Other Player'].dice).is(2);
    });
});
