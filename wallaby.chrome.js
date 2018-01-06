'use strict';
const wallabyWebpack = require('wallaby-webpack');
const {DefinePlugin, LoaderOptionsPlugin} = require('webpack');
const cssnext = require('postcss-cssnext');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// Headless Chrome tests
module.exports = wallaby => ({
	debug: true,
	testFramework: 'jasmine',
	files: [
		{pattern: 'src/**/*.ts', load: false},
		'!src/**/*.spec.ts',
		'!src/**/*.spec.chrome.ts',
		{pattern: 'src/**/*.css', load: false, instrument: false},
		{pattern: 'src/**/*.jpg', load: false, instrument: false},
		{pattern: 'src/**/*.png', load: false, instrument: false},
		{pattern: 'src/**/*.gif', load: false, instrument: false},
		{pattern: 'src/**/*.svg', load: false, instrument: false},
		{pattern: 'src/**/package.json', load: false, instrument: false},
		{pattern: 'src/**/fixtures/*.*', load: false, instrument: false}
	],
	tests: [
		{pattern: 'src/**/*.spec.chrome.ts', load: false}
	],
	env: {
		kind: 'chrome'
	},
	preprocessors: {
		'**/package.json': file => file.content.replace('.ts', '.js')
	},
	postprocessor: wallabyWebpack({
		plugins: [
			new DefinePlugin({
				'process.env.NODE_ENV': '"development"'
			}),
			new LoaderOptionsPlugin({
				options: {
					context: __dirname
				}
			}),
			new ExtractTextPlugin('[name].css')
		],
		module: {
			rules: [
				{
					test: /\.css$/,
					use: ExtractTextPlugin.extract({
						fallback: 'style-loader',
						use: [
							{
								loader: 'css-loader',
								options: {
									modules: true
								}
							},
							{
								loader: 'postcss-loader',
								options: {
									plugins: [
										cssnext()
									]
								}
							}
						]
					})
				},
				{
					test: /\.(jpg|png|gif|svg)$/,
					use: {
						loader: 'url-loader',
						options: {
							limit: 5000,
							name: 'assets/[name].[ext]'
						}
					}
				}
			]
		}
	}),
	setup: () => {
		window.__moduleBundler.loadTests(); // eslint-disable-line no-underscore-dangle
	}
});
