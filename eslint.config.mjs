import pluginJs from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';
import { configs as typescriptConfigs } from 'typescript-eslint';

const rule = (options, type = 'error') => [type, options];

const rules = {
  'no-useless-rename': 'error',
  'object-shorthand': 'error',

  '@stylistic/linebreak-style': rule('windows'),
  '@stylistic/indent': rule(2),
  '@stylistic/semi': rule('always'),
  '@stylistic/quotes': rule('single'),
  '@stylistic/comma-dangle': rule('always-multiline'),
  '@stylistic/member-delimiter-style': rule({}),
  '@stylistic/quote-props': rule('as-needed'),
  '@stylistic/arrow-parens': rule('always'),
  '@stylistic/padded-blocks': 'off',

  '@stylistic/no-multiple-empty-lines': rule({
    max: 1,
    maxBOF: 0,
    maxEOF: 0,
  }),

  '@typescript-eslint/array-type': rule({
    default: 'array-simple',
    readonly: 'array-simple',
  }),
};

export default [
  { ignores: ['node_modules', 'dist', 'coverage'] },
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { files: ['**/*.js'], languageOptions: { sourceType: 'script' } },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  stylistic.configs['recommended-flat'],
  pluginJs.configs.recommended,
  ...typescriptConfigs.recommended,
  { rules },
];
