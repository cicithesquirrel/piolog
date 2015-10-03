"use strict";

var fs = require('fs');
var fsRead = require('./readLineByLine');
var matchers = require('./matchers');
var log4js = require('log4js');
var program = require('commander');
var model = require('./model');
var beautifier = require('js-beautify');

program.version('1.0.0')
    .usage('[options] <pio log file>')
    .option('-o, --out <file>', 'Output to file instead of stdout')
    .option('-b, --beautify', 'Beautify output')
    .parse(process.argv);

var logger = log4js.getLogger();

//logger.debug(program.beautify);
//logger.debug(program.out);

var inputFileName = program.args[0];

var game = model.newGame();

function onLine(line) {

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

function onEnd() {

    game.updateScoreOfLastTurn();

    var lastTurn = game.getLastTurn(),
        outFd, text = JSON.stringify(game);

    if (program.beautify) {
        text = beautifier.js_beautify(text);
    }

    if (!program.out) {
        console.log(text);
    } else {
        outFd = fs.openSync(program.out, 'w');
        fs.writeSync(outFd, text);
        fs.close(outFd);
    }
}

fsRead.readLineByLine(inputFileName, onLine, onEnd);