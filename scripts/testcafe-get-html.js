/**
 * Take a screenshot of a chosen page at 10 of the most common desktop and mobile resolutions.
 * 
 * To add additional resolutions, simply append a list of two elements to the `resolutions` variable.
 * Each element must be a two-element array of [width, height] in pixels.
 * To overwrite the list entirely, add a "resolutions" property to `../config.js`. 
 */
import { Selector, ClientFunction } from 'testcafe';
const fs = require('fs');
const getMetadata = require('./testcafe-get-metadata');

const getHTMLFromClient = ClientFunction(() => {
    const html = document.querySelector('html').outerHTML; // innerHTML is more standardized, but I think this should be fine as long as we only try this in FF or Chrome
    return html;
})

async function getHTML(t) {
    // define names for saved files
    const [browserName, prettyUrl] = getMetadata(t);

    // get HTML
    // TODO: don't need to do this for every browser...
    const html = await getHTMLFromClient();
    fs.writeFile(`html/${prettyUrl}.html`, html, err => {
        if (err) console.error(err);
    });
}

export default getHTML;