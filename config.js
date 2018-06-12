module.exports = {
    // an array of browsers to use for testcafe
    // full options at https://devexpress.github.io/testcafe/documentation/using-testcafe/common-concepts/browsers/browser-support.html#officially-supported-browsers
    // At time of writing, these are acceptable browser options (may depend on system availability)
    // * chromium
    // * chrome
    // * chrome:headless
    // * canary
    // * ie
    // * edge
    // * firefox
    // * firefox:headless
    // * opera
    // * safari
    browsers: ['firefox:headless'],

    // directories to which screenshots will be saved
    screenshots: {
        expected: 'screenshots/expected',
        actual: 'screenshots/actual',
        diff: 'screenshots/result',
        threshold: 0.1
    },

    // specify single page for test
    // singlePage: 'http://www.duckduckgo.com/',

    // definitions for public pages
    public: {
        baseURL: 'https://www.github.com/',

        // path segments to define pages. Will be appended to baseURL
        paths: [
            'ericyd/visual-regression'
        ],

        // true will skip testing for all public pages
        // skip: true
    },

    // definitions for authenticated pages
    auth: {
        baseURL: 'https://github.com/ericyd/',

        // if loginURL is blank, will use baseURL instead
        loginURL: 'https://github.com/login/',

        un: {
            // css selector for username form element
            selector: '#login_field',

            // username to use to log in
            value: 'myusername'
        },
        pw: {
            // css selector for password form element
            selector: '#password',

            // password to use to log in
            value: 'mypassword'
        },

        // path segments to define pages. Will be appended to baseURL
        paths: [
            'visual-regression'
        ],

        // true will skip testing for all auth pages
        skip: true
    },

    // override default screen resolutions for screenshot capture
    // resolutions: [
    //     [1920, 1080],
    //     [1600, 900],
    //     [1440, 900],
    //     [1440, 1024],
    //     [1366, 768],
    //     [1280, 1024],
    //     [1280, 800],
    //     [1024, 768],
    //     [768, 1024],
    //     [320, 480]
    // ],
}