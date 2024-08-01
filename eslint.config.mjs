import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';
import { config, configs as typescriptConfigs } from 'typescript-eslint';

const rule = (options) => ['error', options];

const pluginRules = (pluginName, rules) => Object.keys(rules).reduce((output, ruleName) => {
  const pluginPrefixedRuleName = `${pluginName}/${ruleName}`;
  const ruleEntry = rules[ruleName];
  return { ...output, [pluginPrefixedRuleName]: ruleEntry };
}, {});

const eslintRules = {
  'no-useless-rename': 'error',
  'object-shorthand': 'error',
};

const typescriptRules = pluginRules('@typescript-eslint', {
  'array-type': rule({
    default: 'array-simple',
    readonly: 'array-simple',
  }),
  'restrict-template-expressions': 'off',
});

const stylisticRules = pluginRules('@stylistic', {
  'indent': rule(2),
  'linebreak-style': rule('unix'),
  'quotes': rule('single'),
  'semi': rule('always'),

  'no-multiple-empty-lines': rule({
    max: 1,
    maxBOF: 0,
    maxEOF: 0,
  }),

  'member-delimiter-style': rule({}),
  'arrow-parens': rule('always'),
  'padded-blocks': 'off',
});

const rules = { ...eslintRules, ...typescriptRules, ...stylisticRules };

const typescriptFlatConfig = config(
  ...typescriptConfigs.strictTypeChecked,
  ...typescriptConfigs.stylisticTypeChecked,
  { languageOptions: { parserOptions: { projectService: true, tsconfigRootDir: process.cwd() } } },
  { files: ['**/*.{js,mjs,cjs}'], ...typescriptConfigs.disableTypeChecked },
);

export default config(
  { ignores: ['dist', 'coverage'] },
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  js.configs.recommended,
  ...typescriptFlatConfig,
  stylistic.configs['recommended-flat'],
  { rules },
);
