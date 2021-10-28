import { prerendering } from '$app/env';
import type { Handle } from '@sveltejs/kit';
import { minify, Options as MinifyOptions } from 'html-minifier';

const minificationOptions: MinifyOptions = {
  collapseBooleanAttributes: true,
  collapseWhitespace: true,
  conservativeCollapse: true,
  decodeEntities: true,
  html5: true,
  ignoreCustomComments: [/^#/],
  minifyCSS: true,
  minifyJS: false,
  removeAttributeQuotes: true,
  removeComments: true,
  removeOptionalTags: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  sortAttributes: true,
  sortClassName: true,
};

export const handle: Handle = async function ({ request, resolve }) {
  const response = await resolve(request);

  if (prerendering && response.headers['content-type'] === 'text/html') {
    if (typeof response.body !== 'string') {
      response.body = new TextDecoder('utf-8').decode(response.body);
    }
    response.body = minify(response.body, minificationOptions);
  }

  return response;
};
