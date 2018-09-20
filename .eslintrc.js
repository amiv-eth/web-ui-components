module.exports = {
  'extends': 'airbnb-base',
  'env': {
    'browser': true,
    'node': true
  },
  'rules': {
    // Adjust the rules to your needs.
    // Complete List: https://eslint.org/docs/rules/
  },
  // Activate the resolver plugin, required to recognize the 'config' resolver
  settings: {
    'import/resolver': {
        webpack: {},
    },
  },
  rules: {
    "no-console": 1,
    "prefer-destructuring": 1,
    "no-underscore-dangle": 0,
    "object-curly-newline": [ "error", {
        ObjectExpression: { multiline: true, consistent: true },
        ObjectPattern: { multiline: true, consistent: true },
        ImportDeclaration: { minProperties: 7, consistent: true },
        ExportDeclaration: { minProperties: 7, consistent: true },
    }],
    "max-len": [ "error", { "code": 100, ignorePattern: ".*<svg.+>" }],
  }
};
