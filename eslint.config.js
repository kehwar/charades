import path from "node:path";
import { fileURLToPath } from "node:url";
import antfu from "@antfu/eslint-config";
import { FlatCompat } from "@eslint/eslintrc";

/**
 * @see https://eslint.org/docs/latest/use/configure/migration-guide#using-eslintrc-configs-in-flat-config
 */
const extend = (() => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const compat = new FlatCompat({
        baseDirectory: __dirname,
    });
    return (configPath) => {
        const configArray = compat.extends(configPath);
        return configArray

        // Only keep the rules
            .filter((config) => config.rules != null);
    };
})();

export default antfu(
    {
        stylistic: {
            indent: 4,
            quotes: "double",
        },
    },

    // Extends
    extend("plugin:tailwindcss/recommended"),
    extend("plugin:lodash/recommended"),
    extend("plugin:promise/recommended"),
    extend("plugin:sonarjs/recommended"),

    // ["*.js", "*.ts", "*.tsx", "*.vue"]
    {
        files: ["**/*.js", "**/*.ts", "**/*.tsx", "**/*.vue"],
        rules: {
            // Eslint
            "arrow-parens": ["error", "always"],
            "camelcase": [
                "error",
                {
                    allow: ["^UNSAFE_", "^U_", "^_", "^__"],
                    ignoreDestructuring: false,
                    ignoreGlobals: true,
                    ignoreImports: false,
                    properties: "never",
                },
            ],
            "no-multi-assign": "error",

            // Lodash
            "lodash/chain-style": ["error", "explicit"],
            "lodash/chaining": ["error", "always", 2],
            "lodash/import-scope": ["error", "full"],
            "lodash/matches-prop-shorthand": ["error", "never"],
            "lodash/prefer-lodash-method": "off",
            "lodash/prefer-lodash-typecheck": "off",
            "lodash/prop-shorthand": ["error", "never"],

            // Import
            "import/newline-after-import": ["error", { considerComments: false } ],
            "import/order": [
                "error",
                {
                    alphabetize: {
                        caseInsensitive: true,
                        order: "asc",
                    },
                    groups: [
                        "builtin",
                        "external",
                        "internal",
                        "unknown",
                        "parent",
                        "index",
                        "sibling",
                        "object",
                        "type",
                    ],
                },
            ],

            // Sonar
            "sonarjs/prefer-immediate-return": "off",
            "sonarjs/prefer-single-boolean-return": "off",

            // Style
            "style/array-bracket-newline": ["error", { multiline: true } ],
            "style/array-bracket-spacing": [
                "error",
                "never",
                { arraysInArrays: true, objectsInArrays: true, singleValue: false },
            ],
            "style/array-element-newline": ["error", "consistent"],
            "style/func-call-spacing": "error",
            "style/indent": [
                "error",
                4,
                {
                    ArrayExpression: 1,
                    CallExpression: { arguments: 1 },
                    FunctionDeclaration: { body: 1, parameters: 1 },
                    FunctionExpression: { body: 1, parameters: 1 },
                    ImportDeclaration: 1,
                    MemberExpression: 1,
                    ObjectExpression: 1,
                    SwitchCase: 1,
                    VariableDeclarator: 1,
                    flatTernaryExpressions: false,
                    ignoreComments: false,
                    ignoredNodes: [
                        "TemplateLiteral *",
                        "JSXElement",
                        "JSXElement > *",
                        "JSXAttribute",
                        "JSXIdentifier",
                        "JSXNamespacedName",
                        "JSXMemberExpression",
                        "JSXSpreadAttribute",
                        "JSXExpressionContainer",
                        "JSXOpeningElement",
                        "JSXClosingElement",
                        "JSXFragment",
                        "JSXOpeningFragment",
                        "JSXClosingFragment",
                        "JSXText",
                        "JSXEmptyExpression",
                        "JSXSpreadChild",
                        "TSTypeParameterInstantiation",
                        "FunctionExpression > .params[decorators.length > 0]",
                        "FunctionExpression > .params > :matches(Decorator, :not(:first-child))",
                        "ClassBody.body > PropertyDefinition[decorators.length > 0] > .key",
                    ],
                    offsetTernaryExpressions: false,
                    outerIIFEBody: 1,
                },
            ],
            "style/lines-around-comment": [
                "error",
                {
                    afterBlockComment: false,
                    beforeBlockComment: true,

                    afterLineComment: false,
                    beforeLineComment: true,

                    allowArrayStart: true,
                    allowBlockStart: true,
                    allowClassStart: true,
                    allowEnumStart: true,
                    allowInterfaceStart: true,
                    allowModuleStart: true,
                    allowObjectStart: true,
                    allowTypeStart: true,
                    applyDefaultIgnorePatterns: true,
                    ignorePattern: "^\\s*@.*$",
                },
            ],
            "style/quotes": ["error", "double", { allowTemplateLiterals: true, avoidEscape: true } ],
            "style/semi": ["error", "always"],

            // Tailwind
            "tailwindcss/no-custom-classname": [
                "warn",
                {
                    // Don't read any css files to improve performance
                    cssFiles: [],

                    // Add exception for primevue classes
                    whitelist: ["pi", "pi-.+", "p-.+", "i-.+"],
                },
            ],

            // Typescript
            "ts/ban-ts-comment": [
                "error",
                {
                    "ts-expect-error": false,
                },
            ],
            "ts/consistent-type-definitions": "off",
            "ts/no-redeclare": "off",
            "ts/no-use-before-define": "off",

            // Unicorn
            "unicorn/better-regex": ["error", { sortCharacterClasses: false } ],
            "unicorn/catch-error-name": "error",
            "unicorn/consistent-destructuring": "error",
            "unicorn/consistent-function-scoping": "error",
            "unicorn/explicit-length-check": "error",
            "unicorn/filename-case": ["error", { case: "kebabCase" } ],
            "unicorn/new-for-builtins": "error",
            "unicorn/no-array-callback-reference": "error",
            "unicorn/no-array-push-push": "error",
            "unicorn/no-array-reduce": "error",
            "unicorn/no-await-expression-member": "error",
            "unicorn/no-empty-file": "error",
            "unicorn/no-lonely-if": "error",
            "unicorn/no-useless-fallback-in-spread": "error",
            "unicorn/no-useless-undefined": "error",
            "unicorn/numeric-separators-style": "error",
            "unicorn/prefer-date-now": "error",
            "unicorn/prefer-module": "error",
            "unicorn/prefer-optional-catch-binding": "error",
            "unicorn/prefer-set-has": "error",
            "unicorn/prefer-string-slice": "error",
            "unicorn/prefer-ternary": "error",
            "unicorn/switch-case-braces": ["error", "always"],

            // Vue
            "vue/attributes-order": [
                "error",
                {
                    alphabetical: true,
                    order: [
                        "DEFINITION",
                        "LIST_RENDERING",
                        "CONDITIONALS",
                        "RENDER_MODIFIERS",
                        "GLOBAL",
                        ["UNIQUE", "SLOT"],
                        "TWO_WAY_BINDING",
                        "OTHER_DIRECTIVES",
                        "OTHER_ATTR",
                        "EVENTS",
                        "CONTENT",
                    ],
                },
            ],
            "vue/block-lang": ["error", { script: { lang: "ts" } } ],
            "vue/component-api-style": ["error", ["script-setup"] ],
            "vue/component-tags-order": ["error", { order: ["script", "template", "style"] } ],
            "vue/define-emits-declaration": ["error", "type-based"],
            "vue/define-props-declaration": ["error", "type-based"],
        },
    },

    // ["index.ts"]
    {
        files: ["**/index.ts"],
        rules: {
            "import/order": "off",
        },
    },

    // ["*.test.ts"]
    {
        files: ["**/*.test.ts"],
        rules: {
            "no-console": "off",
            "test/consistent-test-it": ["error", { fn: "test" } ],
        },
    },

    // ["*.js"]
    {
        files: ["**/*.js"],
        rules: {
            "unicorn/prefer-module": "off",
        },
    },

    // ["eslint.config.js"]
    {
        files: ["eslint.config.js"],
        rules: {
            "sort-keys": ["error", "asc", { allowLineSeparatedGroups: true } ],
        },
    },
);
