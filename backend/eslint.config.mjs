import globals from "globals";
import pluginJs from "@eslint/js";
import pluginJest from "eslint-plugin-jest"

export default [
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  pluginJest.configs["flat/recommended"],
  {
    rules: {
      "no-unused-vars": "warn",
    },
  },
  {
    ignores: ["dist/**"],
  },
];
