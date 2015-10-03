"use strict";

var piolog = require('./piolog');
var fs = require('fs');
var program = require('commander');
var beautifier = require('js-beautify');

program.version('1.0.0')
    .usage('[options] <pio log file>')
    .option('-o, --out <file>', 'Output to file instead of stdout')
    .option('-b, --beautify', 'Beautify output')
    .parse(process.argv);

var inputFileName = program.args[0];

function onEnd(game) {

    var text = JSON.stringify(game);

    if (program.beautify) {
        text = beautifier.js_beautify(text);
    }

    if (!program.out) {
        console.log(text);
    } else {
        var outFd = fs.openSync(program.out, 'w');
        fs.writeSync(outFd, text);
        fs.close(outFd);
    }
}

piolog.parse(inputFileName, onEnd);