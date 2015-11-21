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

        var turn = game.turns[0].players;

        test.number(turn['Some Player'].dice).is(7);
        test.number(turn['Other Player'].dice).is(2);
    });

    it('Set winner', function () {
        var game = model.newGame();

        game.getLastTurnOfPlayer("Some Player").city = 2;
        game.getLastTurnOfPlayer("Some Player").colony = 3;
        game.getLastTurnOfPlayer("Other Player").city = 4;
        game.getLastTurnOfPlayer("Other Player").colony = 5;
        game.getLastTurnOfPlayer("Another Player").city = 0;
        game.getLastTurnOfPlayer("Another Player").colony = 1;

        matchers.match("Other Player a gagné la partie avec 11 points de victoire !", game);

        test.object(game.podium).is([{
            name: "Other Player",
            score: 13
        }, {
            name: "Some Player",
            score: 7
        }, {
            name: "Another Player",
            score: 1
        }]);

        test.string(game.winner).is("Other Player");
    });

    it('Add colonies', function () {
        var game = model.newGame();
        matchers.match("Some Player fonde une colonie.", game);

        test.number(game.getLastTurnOfPlayer('Some Player').colony).is(1);

        matchers.match("Some Player fonde une colonie.", game);

        test.number(game.getLastTurnOfPlayer('Some Player').colony).is(2);
    });

    it('Add roads', function () {
        var game = model.newGame();
        matchers.match("Some Player construit une route.", game);

        test.number(game.getLastTurnOfPlayer('Some Player').road).is(1);

        matchers.match("Some Player construit une route.", game);

        test.number(game.getLastTurnOfPlayer('Some Player').road).is(2);
    });

    it('Add cities', function () {
        var game = model.newGame();
        matchers.match("Some Player érige une ville.", game);

        test.number(game.getLastTurnOfPlayer('Some Player').city).is(1);

        matchers.match("Some Player érige une ville.", game);

        test.number(game.getLastTurnOfPlayer('Some Player').city).is(2);
    });

    it('Remove colonies', function () {
        var game = model.newGame();
        game.getLastTurnOfPlayer("Some Player").colony = 2;

        matchers.match("Some Player retire une colonie.", game);

        test.number(game.getLastTurnOfPlayer('Some Player').colony).is(1);
    });

    it('Remove cities', function () {
        var game = model.newGame();
        game.getLastTurnOfPlayer("Some Player").city = 2;
        game.getLastTurnOfPlayer("Some Player").colony = 3;

        matchers.match("Some Player retire une ville.", game);

        test.number(game.getLastTurnOfPlayer('Some Player').city).is(1);
        test.number(game.getLastTurnOfPlayer('Some Player').colony).is(4);
    });

    it('Remove roads', function () {
        var game = model.newGame();
        game.getLastTurnOfPlayer("Some Player").road = 2;

        matchers.match("Some Player retire une route.", game);

        test.number(game.getLastTurnOfPlayer('Some Player').road).is(1);
    });

    it('Start turn', function () {
        var game = model.newGame();
        matchers.match("Début du tour 0 pour Some Player.", game);

        //console.log(JSON.stringify(game));

        test.number(game.turns.length).is(1);

        matchers.match("Début du tour 0 pour Other Player.", game);

        test.number(game.turns.length).is(1);

        matchers.match("Début du tour 1 pour Some Player.", game);

        test.number(game.turns.length).is(2);
    });

    it('Play development card', function () {
        var game = model.newGame();
        matchers.match("Some Player joue la carte de développement Chevalier.", game);
        matchers.match("Some Player joue la carte de développement Marché.", game);
        matchers.match("Some Player joue la carte de développement Chevalier.", game);

        test.number(game.getLastTurnOfPlayer('Some Player').cards.Chevalier).is(2);
        test.number(game.getLastTurnOfPlayer('Some Player').cards.Marché).is(1);
    });
});
