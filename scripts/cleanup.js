/**
 * Delete screenshots, diffs, and html from prior test run
 */

const rimraf = require('rimraf');
const config = require('../config');

const directoriesToRemove = [
    config.screenshots.actual,
    config.screenshots.diff
]

directoriesToRemove.forEach(dir => {
    rimraf(dir, err => {
        if (err && err.message.indexOf('file not found') !== -1) return;
        if (err) console.error(err);
    });
});
