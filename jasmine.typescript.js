// Typescript compiler for Jasmine CLI in non-Wallaby mode
require('ts-node').register({
	ignore: false,
	compilerOptions: {
		module: 'CommonJS'
	}
});
