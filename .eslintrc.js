module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/recommended",
    "@vue/airbnb",
    "@vue/typescript/recommended",

    "@vue/prettier/recommended",
    "@vue/prettier/@typescript-eslint",
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
    // Why the heck is this not default airbnb
    "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
    // Broken with typescript (still)
    "no-unused-vars": "off",
    "no-continue": "off",
    "no-multi-assign": "off",
  },
};
