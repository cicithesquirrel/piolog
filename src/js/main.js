"use strict";

var piolog = require('./piolog');
var fs = require('fs');
var program = require('commander');
var log4js = require('log4js');
var beautifier = require('js-beautify');
var Buffer = require('buffer').Buffer;

log4js.configure('./log4js-config.json', {});
var logger = log4js.getLogger("piolog.main");

program.version('1.0.0')
    .usage('[options] <pio log file>')
    .option('-o, --out <file>', 'Output to file instead of stdout')
    .option('-b, --beautify', 'Beautify output')
    .parse(process.argv);

// open file
var input = fs.openSync(program.args[0], 'r');

var currentLine = '';

function nextLogFileLine() {

    logger.trace('currentLine: ' + currentLine);

    var retval;

    var indexOfCR = currentLine.indexOf('\n');

    if (indexOfCR < 0) {

        var eof = false;
        var bufferSize = 32;
        var buffer = new Buffer(bufferSize);

        while (indexOfCR < 0 && !eof) {

            var bytesRead = fs.readSync(input, buffer, 0, bufferSize);

            logger.trace('buffer: ' + buffer);

            eof = (bytesRead < bufferSize);

            currentLine = currentLine + buffer.toString();

            indexOfCR = currentLine.indexOf('\n');
        }
    }

    logger.trace('indexOfCR: ' + indexOfCR);

    if (indexOfCR >= 0) {
        retval = currentLine.substring(0, indexOfCR);
        currentLine = currentLine.substring(indexOfCR + 1, currentLine.length);
    } else if (currentLine.trim() !== '') {
        retval = currentLine;
        currentLine = '';
    }

    logger.trace('retval: ' + retval);

    return retval;
}

// parse file
var game = piolog.parse(nextLogFileLine);

// close fine
fs.closeSync(input);

// generate output
var text = JSON.stringify(game);

if (program.beautify) {
    text = beautifier.js_beautify(text);
}

if (!program.out || program.out == 'stdout') {
    console.log(text);
} else {
    var outFd = fs.openSync(program.out, 'w');
    fs.writeSync(outFd, text);
    fs.close(outFd);
}
