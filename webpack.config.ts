/* eslint-env node */
'use strict';
import {join} from 'path';
import {DefinePlugin, LoaderOptionsPlugin, optimize, Configuration, Plugin, Rule} from 'webpack';
import {CheckerPlugin} from 'awesome-typescript-loader';
const cssnext = require('postcss-cssnext');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SriPlugin = require('webpack-subresource-integrity');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const dist = join(__dirname, 'dist');


export default function(options: {minify?: boolean}): Configuration {
	const {minify} = options;

	//region Plugins
	const plugins: Plugin[] = [
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
	];
	if (minify){
		plugins.push(
			new optimize.UglifyJsPlugin({
				sourceMap: true,
				compress: {
					warnings: false
				}
			})
		);
	}
	//endregion

	//region Loaders
	const rules: Rule[] = [
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
	];
	//endregion

	return {
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
		plugins,
		module: {
			rules
		}
	};
}
