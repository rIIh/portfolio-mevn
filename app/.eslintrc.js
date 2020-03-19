module.exports = {
    parserOptions: {
        ecmaVersion: 6,
        sourceType: "module",
        ecmaFeatures: {
            modules: true
        }
    },
    "rules": {
        "object-curly-spacing": ["error", "always"],
        "template-curly-spacing": "error",
        "no-duplicate-imports": "error",
        "no-magic-numbers": [
            "error",
            {
                "ignore": [1, -1, 0, 10, 2, 24, 60, 1000, 400, 401, 404, 3000, 4000, 5000],
                "ignoreArrayIndexes": true,
            }
        ],
        "no-multiple-empty-lines": "error",
        "comma-dangle": ["error", "always-multiline"],
        "curly": "error"
    }
};
