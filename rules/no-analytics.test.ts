import { RuleTester } from "@typescript-eslint/rule-tester";
import { rule } from "./no-analytics";
import path from "node:path";

const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.eslint.json",
    tsconfigRootDir: path.resolve(__dirname, "fixture"),
  },
});

ruleTester.run("analytics", rule, {
  valid: [
    {
      filename: "example.ts",
      code: `
      import { thisWillBeFine } from "./wrapper";
      thisWillBeFine()
      `,
    },
    {
      filename: "example.ts",
      code: `const a = "test";`,
    },
  ],
  invalid: [
    {
      filename: "example.ts",
      code: `
      import analytics from "./track";
      analytics.track("test");
      `,
      errors: [{ messageId: "analytics" }],
    },
    {
      filename: "example.ts",
      code: `
      import { trackWrapper } from "./wrapper";
      trackWrapper("test");
      `,
      errors: [{ messageId: "analytics" }],
    },
    {
      filename: "example.ts",
      code: `
      import { trackWrapper2 } from "./wrapper";
      trackWrapper2("test");
      `,
      errors: [{ messageId: "analytics" }],
    },
  ],
});
