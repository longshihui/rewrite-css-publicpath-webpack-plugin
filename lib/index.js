const PluginName = 'RewriteCssPublicPathWebpackPlugin';

class RewriteCssPublicPathWebpackPlugin {
    constructor(options = {}) {
        this.cssPublicPath = options.publicPath;
    }
    apply(compiler) {
        compiler.hooks.compilation.tap(PluginName, compilation => {
            const cssPublicPath = this.getCssPublicPath(compilation);
            // rewrite async css chunk publicPath
            compilation.mainTemplate.hooks.requireEnsure.tap(PluginName, (source) => {
                if (/mini-css-extract-plugin/.test(source)) {
                    return source.replace(compilation.mainTemplate.requireFn + '.p', `'${cssPublicPath}'`);
                }
            });
            // rewrite emit .html css publicPath
            // The hook from HtmlWebpackPlugin
            if (compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing) {
                compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tap(PluginName, pluginArgs => {
                    const {assets} = pluginArgs;
                    const webpackPublicPath = assets.publicPath;
                    assets.css = assets.css.map(cssPath => {
                        return cssPath.replace(webpackPublicPath, cssPublicPath);
                    });
                })
            }
        })
    }
    getCssPublicPath(compilation) {
        if (this.cssPublicPath && typeof this.cssPublicPath === 'string') {
            return this.cssPublicPath;
        }
        const outputPublicPath = compilation.outputOptions.publicPath;
        return  outputPublicPath ? outputPublicPath : '/'
    }
}

RewriteCssPublicPathWebpackPlugin.PluginName = PluginName;

module.exports = RewriteCssPublicPathWebpackPlugin;
