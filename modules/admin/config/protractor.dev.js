const helpers = require('./helpers');
const objectMerge = require('object-merge');
const commonConfig = require('./protractor.common'); // the settings that are common to prod and dev

/**
 * Webpack Plugins
 */
const DefinePlugin = require('webpack/lib/DefinePlugin');

/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'development';

var baseUrl;
if (process.env.TOMCAT_HTTP_PORT) {
    baseUrl = commonConfig.config.baseUrl;
} else {
    baseUrl = process.env.PROTRACTOR_BASE_URL ? process.env.PROTRACTOR_BASE_URL : 'http://localhost:3000';
}

exports.config = objectMerge(commonConfig.config, {
    baseUrl: baseUrl,
    directConnect: true,
    capabilities: {
        'browserName': 'chrome',
        'chromeOptions': {
            'args': ['show-fps-counter=true']
        }
    },

    plugins: [{
        package: 'protractor-screenshoter-plugin',
        screenshotPath: './REPORTS/e2e/' + new Date().toISOString(),
        screenshotOnExpect: 'failure+success',
        screenshotOnSpec: 'none',
        withLogs: 'true',
        writeReportFreq: 'asap',
        imageToAscii: 'failure',
        clearFoldersBeforeTest: true
    }],

    onPrepare: function () {
        browser.ignoreSynchronization = true;

        return global.browser.getProcessedConfig().then(function(config) {
            //it is ok to be empty
        });
    }
});
