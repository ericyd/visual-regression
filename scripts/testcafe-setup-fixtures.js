/**
 * Dynamically generate tests and fixtures based on config options
 */
import { Selector }   from 'testcafe';
import getScreenshots from './testcafe-get-screenshots';
import getHTML        from './testcafe-get-html';
import config         from '../config';
const singlePage = config.singlePage && config.singlePage !== '';


// Single Page run
if (singlePage) {
    // special handling for authenticated page
    const requiresAuth = typeof config.singlePage !== 'string';
    let page, loginURL;
    if (requiresAuth) {
        page = config.singlePage.baseURL;
        loginURL = config.singlePage.loginURL && config.singlePage.loginURL !== '' ? config.singlePage.loginURL : config.singlePage.baseURL;
    } else {
        page = config.singlePage;
        loginURL = page;
    }
    
    fixture(`Take screenshots at ${page}`)
        .page(page)
        .beforeEach(async t => {
            if (requiresAuth) {
                await t.navigateTo(loginURL);
                const un = await Selector(config.auth.un.selector);
                const pw = await Selector(config.auth.pw.selector);
    
                await t
                    .typeText(un, config.auth.un.value)
                    .typeText(pw, config.auth.pw.value)
                    .pressKey('enter');
            }
        });
    
    test(`get screenshots at ${page}`, async t => {
        // will already be at page if !requiresAuth
        if (requiresAuth) {
            await t.navigateTo(page);
        }
        await getScreenshots(t);
    });
}


// Run public pages
if (!config.public.skip && !singlePage) {
    fixture(`Take public screenshots`)
        .page(config.public.baseURL);
    
    config.public.paths.forEach(path => {
        const page = `${config.public.baseURL}${path}`;
        test.page(page)(`get screenshots at ${page}`, async t => {
            await getScreenshots(t);
        });
    });
}



// Run authenticated pages
if (!config.auth.skip && !singlePage) {
    config.auth.paths.forEach(path => {
        const page = `${config.auth.baseURL}${path}`;
        const loginURL = config.auth.loginURL && config.auth.loginURL !== '' ? config.auth.loginURL : config.auth.baseURL;
    
        fixture(`Take auth screenshots at ${page}`)
            .page(page)
            .beforeEach(async t => {
                await t.navigateTo(loginURL);
                const un = await Selector(config.auth.un.selector);
                const pw = await Selector(config.auth.pw.selector);
    
                await t
                    .typeText(un, config.auth.un.value)
                    .typeText(pw, config.auth.pw.value)
                    .pressKey('enter');
            });
        
        test(`get screenshots at ${page}`, async t => {
            await t.navigateTo(page);
            await getScreenshots(t);
        });
    });
}