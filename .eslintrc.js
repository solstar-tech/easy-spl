module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 13,
    sourceType: "module"
  },
  plugins: [
    "@typescript-eslint"
  ],
  rules: {
    "@typescript-eslint/member-delimiter-style": ["error", {
      "multiline": {
        "delimiter": "none",
        "requireLast": false
      },
    }],
    "@typescript-eslint/no-use-before-define": ["off"],
    "@typescript-eslint/semi": ["error", "never"],
    "@typescript-eslint/quotes": ["error", "single", {
      allowTemplateLiterals: true
    }]
  }
}
