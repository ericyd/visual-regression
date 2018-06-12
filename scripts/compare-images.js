/* ===========================================================
Test runner to perform image comparison on all screenshots captured.
Compared files from config.screenshots.expected to config.screenshots.actual

When TestCafe scripts are run, they should output screenshots to config.screenshots.actual,
or the config object can be updated.
=========================================================== */

const fs          = require('fs');
const path        = require('path');
const assert      = require('assert');
const rimraf      = require('rimraf');
const pixelmatch  = require('pixelmatch');
const PNG         = require('pngjs').PNG;
const addContext  = require('mochawesome/addContext');
const config      = require('../config');
const expectedDir = path.resolve(path.dirname(__dirname), config.screenshots.expected);
const actualDir   = path.resolve(path.dirname(__dirname), config.screenshots.actual);
const resultDir   = path.resolve(path.dirname(__dirname), config.screenshots.diff);
let files;


// remove thumnail dirs, no need to compare. Errors don't matter
try { rimraf.sync(path.resolve(actualDir, 'thumbnails')); } catch (e) {}
try { rimraf.sync(path.resolve(expectedDir, 'thumbnails')); } catch (e) {}


describe('screenshot comparisons', function() {
    if (config.skipScreenshots) {
        console.log('skipping screenshot comparison tests');
        return;
    };

    this.timeout(10000);
    try {
        files = fs.readdirSync(expectedDir);
    } catch (e) {
        throw new Error(`cannot find directory "${expectedDir}"`);
    }
    

    files.forEach(file => {
        const actualFilePath = path.join(actualDir, file);
        const expectedFilePath = path.join(expectedDir, file);
        const resultFilePath = path.join(resultDir, file);

        // define test
        it(`file "${file}"`, function(done) {
            const _this = this;
            // look for file of same name in actualDir
            // if err, fail test and do not continue
            try {
                fs.statSync(actualFilePath);
            } catch (e) {
                assert(false, `file not found: ${actualFilePath}`);
                done();
            }

            /* using pixelmatch */
            compareScreenshots(expectedFilePath, actualFilePath, resultFilePath)
                .then(numDiffPixels => {
                    addContext(_this, `diff file: "${resultFilePath}"`);
                    addContext(_this, `file:///${resultFilePath}`);

                    assert.equal(numDiffPixels, 0, `${file} doesn't match the expected screenshot`);
                    done();
                })
                .catch(done);
        });
    });
});

console.info("Open the results in mochawesome-report when this script complese!");



function compareScreenshots(expectedFilePath, actualFilePath, resultFilePath) {
    return new Promise((resolve, reject) => {
        const img1 = fs.createReadStream(actualFilePath).pipe(new PNG()).on('parsed', doneReading);
        const img2 = fs.createReadStream(expectedFilePath).pipe(new PNG()).on('parsed', doneReading);
  
        let filesRead = 0;
        function doneReading() {
            // Wait until both files are read.
            if (++filesRead < 2) return;

            // Do the visual diff.
            const diff = new PNG({width: img1.width, height: img2.height});
            const numDiffPixels = pixelmatch(
                img1.data, img2.data, diff.data, img1.width, img1.height,
                {threshold: config.screenshots.threshold ? config.screenshots.threshold : 0.1}
            );

            // write output to file
            diff.pack().pipe(fs.createWriteStream(resultFilePath));

            resolve(numDiffPixels);
        }
    });
  }
  