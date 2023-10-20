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
            .filter(config => config.rules != null);
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
            "camelcase": [
                "error",
                {
                    allow: ["^UNSAFE_", "^U_", "^_", "^__"],
                    properties: "never",
                    ignoreGlobals: true,
                    ignoreDestructuring: false,
                    ignoreImports: false,
                },
            ],
            "no-multi-assign": "error",

            // Lodash
            "lodash/prop-shorthand": ["error", "never"],
            "lodash/matches-prop-shorthand": ["error", "never"],
            "lodash/chaining": ["error", "always", 2],
            "lodash/import-scope": ["error", "full"],
            "lodash/prefer-lodash-method": "off",

            // Import
            "import/order": [
                "error",
                {
                    groups: ["builtin", "external", "internal", "unknown", "parent", "index", "sibling", "object", "type"],
                    alphabetize: {
                        order: "asc",
                        caseInsensitive: true,
                    },
                },
            ],

            // Style
            "style/array-bracket-newline": ["error", { multiline: true } ],
            "style/array-bracket-spacing": ["error", "never", { singleValue: false, objectsInArrays: true, arraysInArrays: true } ],
            "style/array-element-newline": ["error", "consistent"],
            "style/lines-around-comment": [
                "error",
                {
                    beforeBlockComment: true,
                    afterBlockComment: false,
                    beforeLineComment: true,
                    afterLineComment: false,
                    allowBlockStart: true,
                    allowObjectStart: true,
                    allowArrayStart: true,
                    allowClassStart: true,
                    allowEnumStart: true,
                    allowInterfaceStart: true,
                    allowModuleStart: true,
                    allowTypeStart: true,
                    applyDefaultIgnorePatterns: true,
                    ignorePattern: "^\\s*@.*$",
                },
            ],
            "style/func-call-spacing": "error",
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

            // Unicorn
            "unicorn/prefer-string-slice": "error",
            "unicorn/prefer-module": "error",
            "unicorn/prefer-date-now": "error",
            "unicorn/numeric-separators-style": "error",
            "unicorn/new-for-builtins": "error",
            "unicorn/consistent-destructuring": "error",
            "unicorn/no-useless-undefined": "error",
            "unicorn/catch-error-name": "error",
            "unicorn/prefer-optional-catch-binding": "error",
            "unicorn/no-array-callback-reference": "error",
            "unicorn/consistent-function-scoping": "error",
            "unicorn/no-empty-file": "error",
            "unicorn/filename-case": ["error", { case: "kebabCase" } ],
            "unicorn/prefer-ternary": "error",
            "unicorn/no-lonely-if": "error",
            "unicorn/switch-case-braces": ["error", "always"],
            "unicorn/no-array-push-push": "error",
            "unicorn/no-array-reduce": "error",
            "unicorn/prefer-set-has": "error",
            "unicorn/explicit-length-check": "error",
            "unicorn/no-useless-fallback-in-spread": "error",
            "unicorn/no-await-expression-member": "error",
            "unicorn/better-regex": ["error", { sortCharacterClasses: false } ],

            // Vue
            "vue/component-tags-order": ["error", { order: ["script", "template", "style"] } ],
            "vue/component-api-style": ["error", ["script-setup"] ],
            "vue/block-lang": ["error", { script: { lang: "ts" } } ],
            "vue/define-props-declaration": ["error", "type-based"],
            "vue/define-emits-declaration": ["error", "type-based"],
            "vue/attributes-order": [
                "error",
                {
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
                    alphabetical: true,
                },
            ],
        },
    },

    // ["index.ts"]
    {
        files: ["**/index.ts"],
        rules: {
            "consistent-default-export-name/default-import-match-filename": "off",
            "import/order": "off",
        },
    },

    // ["*.test.ts"]
    {
        files: ["**/*.test.ts"],
        rules: {
            "no-console": "off",
        },
    },
);
