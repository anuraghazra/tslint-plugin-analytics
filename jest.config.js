'use strict';

// @ts-check
/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  moduleFileExtensions: [
    'ts',
    'tsx',
    'mts',
    'mtsx',
    'cjs',
    'js',
    'jsx',
    'mjs',
    'mjsx',
    'json',
    'node',
  ],
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          target: 'es2019',
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
  },
  workerIdleMemoryLimit: '300MB',
};