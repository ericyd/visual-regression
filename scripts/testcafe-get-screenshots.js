/**
 * Take a screenshot of a chosen page at 10 of the most common desktop and mobile resolutions.
 * 
 * To add additional resolutions, simply append a list of two elements to the `resolutions` variable.
 * Each element must be a two-element array of [width, height] in pixels.
 * To overwrite the list entirely, add a "resolutions" property to `../config.js`. 
 */
import { Selector, ClientFunction } from 'testcafe';
const fs = require('fs');
const config = require('../config');
const getMetadata = require('./testcafe-get-metadata');

const scrollDown = ClientFunction((amount) => window.scrollTo(0, (window.scrollY || window.pageYOffset) + (amount || 600)));
const scrollTop = ClientFunction(() => window.scrollTo(0, 0));
const isAtBottom = ClientFunction(() => {
    // credit: https://stackoverflow.com/questions/3898130/check-if-a-user-has-scrolled-to-the-bottom
    const getDocHeight = () => {
        var D = document;
        return Math.max(
            D.body.scrollHeight, D.documentElement.scrollHeight,
            D.body.offsetHeight, D.documentElement.offsetHeight,
            D.body.clientHeight, D.documentElement.clientHeight
        );
    }
    return ( (window.scrollY || window.pageYOffset) + window.innerHeight >= getDocHeight() );
});

async function getScreenshots(t) {
    // define names for saved files
    const [browserName, prettyUrl] = getMetadata(t);

    // construct screenshot name
    const getScreenshotName = (width, height, i) => `${browserName}.${prettyUrl}.${width}x${height}.${i}.png`;

    // define resolutions
    const resolutions = config.resolutions || [
        [1920, 1080],
        [1600, 900],
        [1440, 900],
        [1440, 1024],
        [1366, 768],
        [1280, 1024],
        [1280, 800],
        [1024, 768],
        [768, 1024],
        [320, 480]
    ];

    for (let i = 0; i < resolutions.length; i++) {
        const [width, height] = resolutions[i];
        let count = 0;
        await t
            .resizeWindow(width, height)
            .takeScreenshot(getScreenshotName(width, height, count));

        // Scroll down by one screen-length to get a mid-page screenshot.
        // Repeat until at bottom of document or have taken 10 screenshots
        while ( !(await isAtBottom()) && count < 10) {
            count++;
            await scrollDown(Math.round(height * .75));
            await t.takeScreenshot(getScreenshotName(width, height, count));
        }
        await scrollTop();
    }
}

export default getScreenshots;