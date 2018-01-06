/* eslint-env node */
'use strict';
const {join} = require('path');
const {DefinePlugin, LoaderOptionsPlugin, optimize} = require('webpack');
const {CheckerPlugin} = require('awesome-typescript-loader');
const cssnext = require('postcss-cssnext');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SriPlugin = require('webpack-subresource-integrity');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const dist = join(__dirname, 'dist');


module.exports = ({minify = false} = {}) => {
	const config = {
		target: 'web',
		devtool: 'source-map',
		entry: './src/extension.ts',
		output: {
			path: dist,
			publicPath: '/',
			crossOriginLoading: 'anonymous',
			filename: minify ? '[name].[hash].js' : '[name].js'
		},
		devServer: {
			port: 8000,
			compress: true,
			contentBase: dist,
			publicPath: '/',
			clientLogLevel: 'none',
			stats: 'errors-only'
		},
		performance: {
			hints: false
		},
		resolve: {
			extensions: ['.ts', '.js']
		},
		//region Plugins
		plugins: [
			new CheckerPlugin(),
			new DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(minify ? 'production' : 'development')
			}),
			new LoaderOptionsPlugin({
				minimize: minify,
				options: {
					context: __dirname
				}
			}),
			new CleanWebpackPlugin(['dist'], {
				root: __dirname,
				verbose: false
			}),
			new SriPlugin({
				hashFuncNames: ['sha256', 'sha384'],
				enabled: minify
			}),
			new ExtractTextPlugin(minify ? '[name].[hash].css' : '[name].css'),
			new HtmlWebpackPlugin({
				hash: true,
				title: 'Extension',
				filename: 'index.html'
			})
		],
		//endregion
		//region Loaders
		module: {
			rules: [
				{
					enforce: 'pre',
					test: /\.js$/,
					use: 'source-map-loader'
				},
				{
					enforce: 'pre',
					test: /\.ts?$/,
					use: 'source-map-loader'
				},
				{
					test: /\.ts$/,
					use: [
						{
							loader: 'awesome-typescript-loader',
							options: {
								transpileOnly: true
							}
						}
					]
				},
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
							name: minify ? 'assets/[name].[hash].[ext]' : 'assets/[name].[ext]'
						}
					}
				}
			]
		}
		//endregion
	};
	//region Minify
	if (minify){
		config.plugins.push(
			new optimize.UglifyJsPlugin({
				sourceMap: 'source-map',
				compress: {
					warnings: false
				},
				output: {
					comments: false
				}
			})
		);
	}
	//endregion
	return config;
};
