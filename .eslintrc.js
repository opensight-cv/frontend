module.exports = {
  root: true,
  env: {
    node: true,
  },
  plugins: ["prettier"],
  extends: [
    "plugin:vue/recommended",
    "@vue/airbnb",
    "@vue/typescript/recommended",

    "@vue/prettier",
    "@vue/prettier/@typescript-eslint",
    "plugin:prettier/recommended",
  ],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-restricted-syntax": [
      "off",
      {
        selector: "ForOfStatement",
      },
    ],
    // Broken with typescript (still)
    "@typescript-eslint/no-unused-vars": "off",
  },
};
