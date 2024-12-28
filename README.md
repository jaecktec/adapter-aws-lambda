# adapter-aws-lambda

## A sveltekit adapter for AWS Lambda
If for some reason you need your sveltekit app to run entirely on AWS Lambda, this adapter is for you.
Example UseCase: You want to run your sveltekit app on AWS Lambda behind an ALB.

If you want to deploy on Lambda + Cloudfront this adapter is not for you, check out [sveltekit-aws-adapter](https://github.com/juspay/sveltekit-aws-adapter).
Running entirely on Lambda is less performant and more expensive than using Cloudfront, but the deployment setup simpler which might be useful for small projects.

## Example Usage with Vite and AWS CDK
```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-aws-lambda';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter()
	}
};

export default config;
```

```javascript
// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import zipPack from "vite-plugin-zip-pack";

export default defineConfig({
	build: {
	},
	plugins: [
		sveltekit(),
		zipPack({
			inDir: 'build',
			outDir: 'build',
			outFileName: 'bundle.zip',
		}),
	]
});
```

```typescript
// cdk.ts
import * as cdk from 'aws-cdk-lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'app-stack');

const fn = new Function(this, 'lambda', {
	handler: 'index.awsHandler',
	runtime: Runtime.NODEJS_22_X,
	memorySize: 256,
	code: Code.fromAsset('./build/bundle.zip'),
})
const fnUrl = fn.addFunctionUrl({
	authType: FunctionUrlAuthType.NONE,
	cors: {
		allowedOrigins: ['*'],
		allowedMethods: [HttpMethod.ALL],
		allowedHeaders: ['*'],
	}
});
```

## Notes
This work is 99% based on [@sveltejs/adapter-node](https://github.com/sveltejs/kit/blob/main/packages/adapter-node/README.md)
and [lambda-request-handler](https://github.com/janaz/lambda-request-handler) - the biggest change is adding a package.json + a lambda entrypoint utilising the request handler

## License

This project is licensed under the MIT License.
