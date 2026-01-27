import eslintPluginAstro from 'eslint-plugin-astro';

export default [
  {
    ignores: [
      'dist/**',
      'build/**',
      'node_modules/**',
      '.astro/**',
      'functions/**',
      'pnpm-lock.yaml',
      'src/env.d.ts',
    ],
  },
  {
    files: ['**/*.{ts,tsx,js,jsx,mjs}'],
    rules: {},
  },
  ...eslintPluginAstro.configs.recommended,
];
