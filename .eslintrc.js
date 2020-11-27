module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "prefer-const": 0,
    "no-var": 0,
    "no-console": 1,
    "@typescript-eslint/no-empty-function": 0,

    //#region TS conflicts
    "no-unused-vars": 0,
    //#endregion

    //#region TS
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-unused-vars": [
      1,
      {
        vars: "all",
        args: "after-used",
        ignoreRestSiblings: true,
        argsIgnorePattern: "^__",
      },
    ],
    //#endregion
  },
};
