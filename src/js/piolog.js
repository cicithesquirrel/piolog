"use strict";

var matchers = require('./matchers');
var model = require('./model');

function onLine(game, line) {

    line = line.trim();

    if (line.length === 0) {
        return;
    }
    var hourAndMessage = line.match(/(\d\d:\d\d:\d\d) (.+)$/),
        hour = hourAndMessage[1],
        message = hourAndMessage[2];

    if (!game.startDate) {
        game.startDate = hour;
    }
    game.endDate = hour;

    matchers.match(message, game);
}


exports.parse = function (nextLineFunction) {

    var game = model.newGame();

    var line = nextLineFunction();
    while (line) {

        onLine(game, line);

        line = nextLineFunction();
    }

    game.updateScoreOfLastTurn();

    return game;
};


exports.computeStats = model.computeStats;
