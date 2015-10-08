"use strict";

var matchers = require('./matchers');
var model = require('./model');
var log4js = require('log4js');
var logger = log4js.getLogger("piolog.parser");

function onLine(game, line, currentLineNumber) {

    line = line.trim();

    if (line.length === 0) {
        return;
    }
    var hourAndMessage = line.match(/(\d\d:\d\d:\d\d) (.+)$/);

    if (hourAndMessage) {
        var hour = hourAndMessage[1];
        var message = hourAndMessage[2];

        if (!game.startDate) {
            game.startDate = hour;
        }
        game.endDate = hour;

        matchers.match(message, game);
    } else {
        logger.warn('Incorrect line #' + currentLineNumber + ' has been ignored');
    }
}


exports.parse = function (nextLineFunction) {

    var game = model.newGame();

    var currentLineNumber = 1;

    var line = nextLineFunction();
    while (line) {

        onLine(game, line, currentLineNumber);

        line = nextLineFunction();

        currentLineNumber = currentLineNumber + 1;
    }

    game.updateScoreOfLastTurn();

    game.stats = model.computeStats(game);

    return game;
};
