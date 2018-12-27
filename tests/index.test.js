const webpack = require('webpack');
const utils = require('./utils');
const fs = require('fs');
const path = require('path').posix;
const { JSDOM } = require('jsdom');

function notWarning(stats) {
    expect(stats.compilation.warnings.length).toBe(0);
}

function noErrors(stats) {
    expect(stats.compilation.errors.length).toBe(0);
}

test('当未指定css publicPath时，发布路径为output配置的publicPath', function (done) {
    const options = {
        entry: './src/entry.js',
        outputPath: utils.getOutputPath('./test1'),
        publicPath: '//js.cdn.com/'
    };
    webpack(utils.getWebpackConfig(options), (err, stats) => {
        expect(err).toBeFalsy();
        notWarning(stats);
        noErrors(stats);
        const assets = stats.compilation.assets;
        const htmlNames = Object.keys(assets).filter(fileName => /.html/.test(fileName));
        const allIsCorrect = htmlNames.every(fileName => {
            const htmlAsString = fs.readFileSync(path.resolve(options.outputPath, fileName)).toString();
            const dom = new JSDOM(htmlAsString);
            const linkTags = Array.from(dom.window.document.querySelectorAll('link'));
            return linkTags.every(el => el.href.startsWith(options.publicPath));
        });
        expect(allIsCorrect).toBe(true);
        done();
    });
});

test('生成的html中, link标签的发布路径为css publicPath', function (done) {
    const options = {
        entry: './src/entry.js',
        outputPath: utils.getOutputPath('./test2'),
        publicPath: '//js.cdn.com/',
        cssPublicPath: '//css.cdn.com/'
    };
    webpack(utils.getWebpackConfig(options), (err, stats) => {
        expect(err).toBeFalsy();
        notWarning(stats);
        noErrors(stats);
        const assets = stats.compilation.assets;
        const htmlNames = Object.keys(assets).filter(fileName => /.html/.test(fileName));
        const allIsCorrect = htmlNames.every(fileName => {
            const htmlAsString = fs.readFileSync(path.resolve(options.outputPath, fileName)).toString();
            const dom = new JSDOM(htmlAsString);
            const linkTags = Array.from(dom.window.document.querySelectorAll('link'));
            return linkTags.every(el => el.href.startsWith(options.cssPublicPath));
        });
        expect(allIsCorrect).toBe(true);
        done();
    });
});

test('当包含lazy-load的css文件，加载时使用的publicPath为css publicPath', function (done) {
    const options = {
        entry: './src/async-entry.js',
        outputPath: utils.getOutputPath('./test3'),
        publicPath: '//js.cdn.com/',
        cssPublicPath: '//css.cdn.com/',
        emitSingleRuntime: true
    };
    webpack(utils.getWebpackConfig(options), (err, stats) => {
        expect(err).toBeFalsy();
        noErrors(stats);
        notWarning(stats);
        const runtimeChunkContent = fs.readFileSync(path.resolve(options.outputPath, './runtime.js')).toString();
        expect(runtimeChunkContent.includes(options.cssPublicPath)).toBe(true);
        done();
    });
});
