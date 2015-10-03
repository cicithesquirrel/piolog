"use strict";

var lineByLine = require('./line-by-line');
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

exports.parse = function (pioLogFileName, onEndCallback) {

    var game = model.newGame();

    function onEndOfFile(game)  {
        game.updateScoreOfLastTurn();
        onEndCallback(game);
    }

    lineByLine.read(pioLogFileName, game, onLine, onEndOfFile);
};