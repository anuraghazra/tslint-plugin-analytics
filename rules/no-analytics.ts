import * as ts from "typescript";
import { ESLintUtils } from "@typescript-eslint/utils";
import * as tsutils from "ts-api-utils";

import {
  ImportDeclaration,
  Node,
  Project,
} from "ts-morph";
import path from "path";

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://typescript-eslint.io/rules/${name}`
);

function getOutermostScope(scope: Node): Node {
  // walk up until the source file's outer most scope is reached
  while (!scope.getParent()?.isKind(ts.SyntaxKind.SourceFile)) {
    scope = scope.getParent() ?? scope;
  }

  return scope;
}

export const rule = createRule({
  create(context, _) {
    const project = new Project({
      tsConfigFilePath: path.resolve(
        __dirname,
        "fixture",
        "./tsconfig.eslint.json"
      ),
    });

    // 1. Collect all the analytics imports
    const analyticsFileImports: ImportDeclaration[] = [];
    project.getSourceFiles().forEach((sourceFile) => {
      // find source files with "track.ts" import, we pretend that this is the library
      sourceFile.getImportDeclarations().forEach((importDeclaration) => {
        if (importDeclaration.getModuleSpecifierValue() === "./track") {
          analyticsFileImports.push(importDeclaration);
        }
      });
    });

    // 2. Find all the references to the `analytics` object
    const refs = analyticsFileImports[0].getDefaultImport()?.findReferencesAsNodes()!;
    const map = new Map<string, Node>();

    // put the default import also in map
    map.set("track", analyticsFileImports[0].getDefaultImport()!);

    // 3. Find the outermost scope of the references and store them in a map
    refs.forEach((ref) => {
      if (!ref) return;

      // find the outermost scope of the reference
      const scope = getOutermostScope(ref);
      if (scope.isKind(ts.SyntaxKind.VariableStatement)) {
        const fnName = scope.getDeclarations()[0].getName();
        map.set(fnName, scope);
      }
      if (scope.isKind(ts.SyntaxKind.FunctionDeclaration)) {
        const fnName = scope.getName();
        if (!fnName) return;
        map.set(fnName, scope);
      }
    });

    return {
      // 4. Assert call functions against the map
      CallExpression(node) {
        const { callee } = node;
        if (callee.type === 'MemberExpression') {
          const { property } = callee;
          if (property.type === 'Identifier' && map.has(property.name)) {
            return context.report({
              node,
              messageId: "analytics",
            });
          }
        }
        if (callee.type === "Identifier" && map.has(callee.name)) {
          return context.report({
            node,
            messageId: "analytics",
          });
        }
      },
    };
  },
  meta: {
    docs: {
      description: "analytics linter",
    },
    messages: {
      analytics: "Checks if track() is used",
    },
    type: "suggestion",
    schema: [],
  },
  name: "analytics",
  defaultOptions: [],
});
