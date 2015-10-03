"use strict";

var reporter = require('nodeunit').reporters.default;

process.chdir(__dirname);
reporter.run(['test_matchers.js', 'test_model.js']);