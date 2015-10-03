"use strict";

var fs = require('fs');

exports.readLineByLine = function (fileName, onReadLine, onEndOfFile) {
    var input = fs.createReadStream(fileName),
        remaining = '';

    input.on('data', function (data) {
        remaining += data;
        var index = remaining.indexOf('\n'),
            line;
        while (index > -1) {
            line = remaining.substring(0, index);
            remaining = remaining.substring(index + 1);
            onReadLine(line);
            index = remaining.indexOf('\n');
        }
    });

    input.on('end', function () {
        if (remaining.length > 0) {
            onReadLine(remaining);
        }
        onEndOfFile();
    });
};