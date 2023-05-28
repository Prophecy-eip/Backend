module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir : __dirname, 
    sourceType: "module",
  },
  plugins: ["@typescript-eslint/eslint-plugin"],
  extends: [],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [".eslintrc.js"],
  rules: {
    "eol-last": ["error", "always"],
    "quotes": ["error", "double"],
    "comma-dangle": ["error", "never"],
    "semi": ["error", "always"]
  },
};
