# rewrite-css-publicpath-webpack-plugin

[![Build Status](https://travis-ci.org/longshihui/rewrite-css-publicpath-webpack-plugin.svg?branch=master)](https://travis-ci.org/longshihui/rewrite-css-publicpath-webpack-plugin)  [![](https://img.shields.io/npm/v/rewrite-css-publicpath-webpack-plugin.svg)](https://www.npmjs.com/package/rewrite-css-publicpath-webpack-plugin)

重写css的发布路径，仅支持**webpack 4**.

[English Doc](./README.md)

## 特性

- 支持重写**mini-css-extract-plugin**分离出的异步css模块, 复写加载时的publicPath
- 支持重写**html-webpack-plugin**生成的html文件中的css link标签加载路径

## 安装

```
yarn add rewrite-css-publicpath-webpack-plugin --dev
```

or

```
npm install --save-dev rewrite-css-publicpath-webpack-plugin
```

## 使用

**webpack.config.js**

```
const RewriteCssPublicPathWebpackPlugin = require('rewrite-css-publicpath-webpack-plugin')

module.exports = {
  // other config
  plugins: [
    new RewriteCssPublicPathWebpackPlugin({
        publicPath: '//css.cdn.com'
    })
  ]
}
```

## 配置项

你可以传递一个配置对象至**rewrite-css-publicpath-webpack-plugin**. 该配置项中允许的值如下表所示

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| publicPath | string | output.publicPath | css publicPath |


