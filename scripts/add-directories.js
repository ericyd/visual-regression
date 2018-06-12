/**
 * Add directories needed for test runs.
 */

const fs = require('fs');
const path = require('path');
const config = require('../config');

const directoriesToAdd = [
    path.dirname(config.screenshots.expected),
    path.dirname(config.screenshots.actual),
    path.dirname(config.screenshots.diff),
    config.screenshots.actual,
    config.screenshots.expected,
    config.screenshots.diff
];

directoriesToAdd.forEach(dir => {
    fs.mkdir(dir, err => {
        if (err && err.message.indexOf('file already exists') === -1) console.error(err);
    });
});