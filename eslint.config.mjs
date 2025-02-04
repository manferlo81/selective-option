import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';
import { config, configs as typescriptConfigs } from 'typescript-eslint';

const javascriptPluginConfig = config(
  js.configs.recommended,
  {
    rules: normalizeRules({
      'object-shorthand': 'error',
      'no-useless-rename': 'error',
      'prefer-template': 'error',
      'no-useless-concat': 'error',
    }),
  },
);

const stylisticPluginConfig = config(
  stylistic.configs.customize({
    quotes: 'single',
    indent: 2,
    semi: true,
    arrowParens: true,
    quoteProps: 'as-needed',
    braceStyle: '1tbs',
  }),
  {
    rules: normalizeRules('@stylistic', {
      'linebreak-style': 'unix',
      'no-extra-parens': 'all',
      'no-extra-semi': 'error',
      'padded-blocks': 'off',
    }),
  },
);

const typescriptPluginConfig = config(
  typescriptConfigs.strictTypeChecked,
  typescriptConfigs.stylisticTypeChecked,
  { languageOptions: { parserOptions: { projectService: true, tsconfigRootDir: process.cwd() } } },
  { files: ['**/*.{js,cjs,mjs}'], extends: [typescriptConfigs.disableTypeChecked] },
  {
    rules: normalizeRules('@typescript-eslint', {
      'array-type': {
        default: 'array-simple',
        readonly: 'array-simple',
      },
      'restrict-template-expressions': 'off',
    }),
  },
);

export default config(
  { files: ['**/*.{js,cjs,mjs,ts}'] },
  { ignores: ['dist', 'coverage'] },
  { languageOptions: { globals: { ...globals.node, ...globals.browser } } },
  javascriptPluginConfig,
  stylisticPluginConfig,
  typescriptPluginConfig,
);

function normalizeRuleEntry(entry) {
  if (Array.isArray(entry)) return entry;
  if (['off', 'warn', 'error'].includes(entry)) return entry;
  return ['error', entry];
}

function createEntriesMapper(pluginName) {
  if (!pluginName) {
    return ([ruleName, ruleEntry]) => [ruleName, normalizeRuleEntry(ruleEntry)];
  }
  const pluginPrefix = `${pluginName}/`;
  const normalizeRuleName = (ruleName) => {
    if (ruleName.startsWith(pluginPrefix)) return ruleName;
    return `${pluginPrefix}${ruleName}`;
  };
  return ([ruleName, ruleEntry]) => [normalizeRuleName(ruleName), normalizeRuleEntry(ruleEntry)];
}

function normalizeRules(pluginName, rules) {
  if (!rules && pluginName) return normalizeRules(null, pluginName);
  return Object.fromEntries(
    Object.entries(rules).map(
      createEntriesMapper(pluginName),
    ),
  );
}
