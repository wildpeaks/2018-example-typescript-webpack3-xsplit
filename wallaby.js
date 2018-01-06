'use strict';

// Node tests
module.exports = () => ({
	debug: true,
	testFramework: 'jasmine',
	files: [
		'src/**/*.ts',
		'!src/**/*.spec.ts',
		'!src/**/*.chrome.ts',
		{pattern: 'src/**/package.json', instrument: false, load: false},
		{pattern: 'src/**/fixtures/*.*', instrument: false, load: false}
	],
	tests: [
		'src/**/*.spec.ts'
	],
	env: {
		type: 'node'
	},
	preprocessors: {
		'**/package.json': file => file.content.replace('.ts', '.js')
	}
});
