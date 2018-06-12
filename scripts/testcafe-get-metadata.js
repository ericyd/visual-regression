function getMetadata(t) {
    let browserName, prettyUrl;
    try {
        const browserInfo = t.testRun.browserConnection.browserInfo;
        browserName = browserInfo.providerName === 'locally-installed' ? browserInfo.browserName : browserInfo.providerName;
    } catch (e) {
        browserName = 'unknown_browser';
    }

    try {
        let pageUrl = t.testRun.test.pageUrl;
        // remove http://, trailing slash, and any path delimiters
        prettyUrl = pageUrl.slice(7, pageUrl.length-1).replace(/[\/\?\&\=\.]/g, '-');
    } catch (e) {
        prettyUrl = 'could_not_parse_page_url';
    }

    return [browserName, prettyUrl];
}

module.exports = getMetadata;