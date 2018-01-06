# Boilerplate: Xsplit Extension

Boilerplate to create custom Extensions for [XSplit Broadcaster](https://www.xsplit.com/#broadcaster)
written in **Typescript** using [Visual Studio Code](https://code.visualstudio.com).

**Important**: until [PR #188](https://github.com/xjsframework/xjs/pull/188) is merged & published,
you have to manually add a line `"types": "src/index.ts"` in the package.json
of module `xjs-framework` for VSCode Intellisense to work.


-------------------------------------------------------------------------------

## Sources

The entry point of the extension is `/src/extension.ts`.

Additional code is stored in **Local Modules** in `/src/node_modules`.
so no configuration is required for custom resolution paths in every tool of your toolchain
because it uses the [native Node resolution model](https://nodejs.org/api/modules.html#modules_all_together).

This way, modules can be referenced with clean paths like `components/MyComponent`
instead of brittle relative paths like `../../../components/MyComponent/MyComponent.ts`.


-------------------------------------------------------------------------------

## Assets

Images referenced in modules get automatically added to the build (jpg, png, gif and svg),
and tiny images are directly embedded as base64 values.

CSS files referenced in modules get aggregated and postprocessed
using [PostCSS Next](http://cssnext.io) to generate a single .css file.

Also, CSS is configured for local class identifiers, so you don't have to worry about choosing class names
that are globally unique because Webpack will generate globally-unique names.


---
### Declare assets for VSCode Intellisense

By default, Typescript doesn't know how to handle stylesheets and images.
Therefore, modules that use assets should have a short .d.ts file that declares what the file contains for Intellisense to work.

MyComponent.css
````css
.class1 {
	color: blue;
}
.class2 {
	color: green;
}
````

MyComponent.d.ts
````ts
declare module '*.css' {
	export const class1: string;
	export const class2: string;
}

declare module '*.jpg' {
	const _: string;
	export = _;
}
````

MyComponent.ts
````ts
/// <reference path="./MyComponent.d.ts" />
import {myclass1, myclass2} from './MyComponent.css';
import * as image from './image.jpg';

// myclass1 is a string
// myclass2 is a string
// image is a string
````

See `/src/node_modules/components/MyComponent` for an example that uses both CSS and images.


-------------------------------------------------------------------------------

## Build the extension

The default **Build Task** for VSCode generates minified files in `/dist`.


-------------------------------------------------------------------------------

## Debug the extension

First, enable **Developer Mode** in XSplit Broadcaster (in `Settings` > `Advanced`).

Then, start `Webpack Dev Server` task in VSCode if it's not already running.

Then load the extension from `http://localhost:8000` in XSplit.

Finally, start **Attach to XSplit** in the **Debug tab** in VSCode.


-------------------------------------------------------------------------------

## Tests

Configured for Jasmine.

If you have [Wallaby for VSCode](https://wallabyjs.com),
you can also get realtime feedback from the tests directly in VSCode.

Tests that don't rely on DOM (or use jsdom) should have the extension `.spec.ts`, and are run in Node.

Tests that require a real DOM should be named `*.chrome.spec.ts` and are run in **Headless Chrome**.
However, Wallaby cannot run both Node and Chrome tests at the same time for now.


-------------------------------------------------------------------------------

## Linting

VSCode is configured for linting Typescript with ESlint using the
[@wildpeaks/typescript](https://www.npmjs.com/package/@wildpeaks/eslint-config-typescript) shared config.


-------------------------------------------------------------------------------

