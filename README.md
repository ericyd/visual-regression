# Visual Regression
Scripts to make visual regression testing easy


## Setup

```bash
git clone https://github.com/ericyd/visual-regression
cd visual-regression
npm install
```

This is more of a boilerplate than a stand-alone module, but with a little configuration it can do a lot of work for you.

If you want to save screenshots, be aware that the `.gitignore` ignores the `screenshots` directory by default



## Usage

Ideally, the only thing you should have to touch is the `config.js` file in the directory root.

After that, you have some scripts to choose from:
* `npm t`: runs all test scripts, see [running tests](#running-tests) for more details
* `npm run cleanup`: deletes any captured screenshots
* `npm run capture`: captures screenshots
* `npm run capture:expected`: captures "expected" screenshots (more details below)
* `npm run compare`: compares images from `config.screenshots.actual` to `config.screenshots.expected` and tests for similarity




## Adding expected images

Run: `npm run capture:expected`

This script will run through all pages in the `config.js` file and save them to `config.screenshots.expected`.

By contrast, the script `npm run capture` will save screenshots to `config.screenshots.actual`.



## Running tests

`npm t`

This will do the following:
1. Delete HTML and screenshots that were saved during the last test run
2. Capture screenshots from the pages specified in `config.js`
3. Compare screenshots in `config.screenshots.actual` to `config.screenshots.expected` and fail any that do not match

When the test script is done, you can view the results by opening the file `mochawesome.html` in the `mochawesome-report` directory.



## Configuration

Most of the manual adjustments should happen in the `config.js` file in the directory root.

These are all the possible options

* **browsers** `<string[]>`

    An array of browsers to use in the tests. [Full options in documentation](https://devexpress.github.io/testcafe/documentation/using-testcafe/common-concepts/browsers/browser-support.html#officially-supported-browsers).

    Note that you can use Chrome and Firefox in headless mode with `chrome:headless` and `firefox:headless`

* **screenshots** `<object>`

    Options for saving and comparing the screenshots

    * **expected** `<string>`

        Directory for expected screenshots - the baseline to compare against

    * **actual** `<string>`

        Directory for actual testrun screenshots

    * **diff** `<string>`

        Directory for resulting diff images

    * **threshold** `<number>` Default: 0.1

        Point at which image diff will fail. Higher threshold results in fewer failures (more pixels must be different in order to fail).

* **singlePage** `<string>` | `<Object>`

    Specify a single page to test. If specified, this will skip all `public` and `auth` pages

    If `singlePage` is public, just provide a `string` identifying the URL.

    If `singlePage` is an authenticated page, provide an `object` with most of the properties from `auth`: `baseURL`, `loginURL`, `un`, `pw` (see below for details)

* **public** `<Object>`

    Define properties for public pages

    Properties:

    * **baseURL** `<string>`

        Path segments will be appended to the `baseURL` to generate the page under test

    * **paths** `<string[]>`

        Path segments to indicate which pages to visit. Include `''` to include the `baseURL`

    * **skip** `<boolean>` Default: `false`

        When true, public pages will not be tested

* **auth** `<Object>`

    Define properties for authenticated pages

    Properties:

    * **baseURL** `<string>`

        Path segments will be appended to the `baseURL` to generate the page under test

    * **loginURL** `<string>`

        Page to visit to log in before navigating to authenticated page. If ommitted, `auth.baseURL` will be used

    * **un** `<Object>`

        Properties for username entry

        * **selector** `<string>`

            CSS selector to indicate the username form element

        * **value** `<string>`

            Username for authentication

    * **pw** `<Object>`

        Properties for password entry

        * **selector** `<string>`

            CSS selector to indicate the password form element

        * **value** `<string>`

            password for authentication

    * **paths** `<string[]>`

        Path segments to indicate which pages to visit. Include `''` to include the `baseURL`

    * **skip** `<boolean>` Default: `false`

        When true, authenticated pages will not be tested

* **resolutions** `<number[][]>`

    An array of two-element arrays defining `[width, height]` of screen resolutions for screenshot capture

    Default:
    ```
    [
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
    ]
    ```


## Dependencies

These scripts contain almost 0% original content.
They make extensive use of the following libraries (also feel free to check out the `package.json`);

* [TestCafe](http://devexpress.github.io/testcafe/): Browser automation, screenshot capture
* [pixelmatch](https://github.com/mapbox/pixelmatch): image diffing (tells if screenshots match);
    * Note: I personally prefer the output diffs from [blink-diff](https://github.com/yahoo/blink-diff) but pixelmatch is about 2-10 times faster so I chose that.
    You can refer to [this commit](https://github.com/ericyd/wcag-visreg/blob/a278c0ccd5928da52d771b0cefda625cba36dd7b/scripts/compare-images.js)
    if you want to see an implementation that uses blink-diff.
* [mocha](https://mochajs.org/): test runner
* [mochawesome](https://github.com/adamgruber/mochawesome): excellent report generator with ability to inline image results
