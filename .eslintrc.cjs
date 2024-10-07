module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'commonjs',
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.cjs.json', './tsconfig.test.json'],
        ecmaFeatures: {
            impliedStrict: true
        }
    },
    plugins: ['@typescript-eslint'],
    extends: ['plugin:prettier/recommended', 'plugin:@typescript-eslint/recommended'],
    ignorePatterns: ['dist', '*.cjs', '*.js'],
    rules: {
        strict: 0,
        semi: ['error', 'always'],
        quotes: ['error', 'single', {allowTemplateLiterals: true}],
        indent: [
            'error',
            2,
            {
                SwitchCase: 1,
                flatTernaryExpressions: false,
                ignoredNodes: [
                    'PropertyDefinition[decorators]',
                    'TSUnionType',
                    'FunctionExpression[params]:has(Identifier[decorators])',
                ],
            },
        ],
        '@typescript-eslint/ban-ts-comment': [
            'error',
            {
                'ts-expect-error': 'allow-with-description',
                minimumDescriptionLength: 1,
            },
        ],
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/explicit-module-boundary-types': 'error',
        '@typescript-eslint/no-non-null-assertion': 'error',
        '@typescript-eslint/no-unused-vars': ['error', {ignoreRestSiblings: true}],
        '@typescript-eslint/consistent-type-imports': 'warn',
        'no-console': 'error',
        '@typescript-eslint/no-misused-promises': [
            2,
            {
                checksVoidReturn: {
                    attributes: false,
                },
            },
        ],
        'max-len': ['error', 120],
        'object-curly-spacing': ['error', 'always'],
        'no-tabs': 0,
        'implicit-arrow-linebreak': 0,
        'import/prefer-default-export': 0,
        'import/no-unresolved': 0,
        'no-mixed-spaces-and-tabs': 0,
        'import/order': 0,
        'no-return-assign': 0,
        'no-continue': 0,
        'no-underscore-dangle': 0,
        'consistent-return': 0,
        'object-curly-newline': 0,
        'no-param-reassign': 0,
        'no-loop-func': 0,
        'arrow-parens': 0,
        'no-confusing-arrow': 0,
        'global-require': 0,
        'no-restricted-exports': 0,
        'comma-dangle': 0,
        'import/no-extraneous-dependencies': 0,
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/no-empty-interface': 0,
    },
};
