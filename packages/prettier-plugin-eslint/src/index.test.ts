import { formatIgnore } from "@standard-configs/plugin-ignore/src/test-utils";
import { formatJSON } from "@standard-configs/plugin-json/src/test-utils";
import { formatYAML } from "@standard-configs/plugin-yaml/src/test-utils";

import * as plugin from ".";

describe("eslintrc", () => {
  describe.each([
    { filename: ".eslintrc.json", format: formatJSON },
    { filename: ".eslintrc.yaml", format: formatYAML },
    { filename: ".eslintrc.yml", format: formatYAML },
    { filename: ".eslintrc", format: formatJSON },
  ])("%p", ({ filename, format }) => {
    const { defaultFormat, expectExample, pluginFormat } = format(
      filename,
      plugin
    );

    it("sorts by @saiichihashimoto's preference", () =>
      expect(
        pluginFormat({
          env: {},
          extends: [],
          globals: {},
          ignorePatterns: [],
          overrides: [
            {
              parserOptions: {
                allowReserved: false,
                ecmaFeatures: {
                  globalReturn: false,
                  impliedStrict: false,
                  jsx: false,
                },
                ecmaVersion: "",
                sourceType: "",
              },
            },
          ],
          noInlineConfig: false,
          parser: "",
          parserOptions: {
            allowReserved: false,
            ecmaFeatures: {
              globalReturn: false,
              impliedStrict: false,
              jsx: false,
            },
            ecmaVersion: "",
            sourceType: "",
          },
          plugins: [],
          processor: "",
          reportUnusedDisableDirectives: false,
          root: false,
          rules: {},
          settings: {},
        })
      ).toStrictEqual(
        defaultFormat({
          root: false,
          noInlineConfig: false,
          reportUnusedDisableDirectives: false,
          ignorePatterns: [],
          plugins: [],
          extends: [],
          processor: "",
          parser: "",
          parserOptions: {
            ecmaVersion: "",
            sourceType: "",
            allowReserved: false,
            ecmaFeatures: {
              globalReturn: false,
              impliedStrict: false,
              jsx: false,
            },
          },
          settings: {},
          env: {},
          globals: {},
          rules: {},
          overrides: [
            {
              parserOptions: {
                ecmaVersion: "",
                sourceType: "",
                allowReserved: false,
                ecmaFeatures: {
                  globalReturn: false,
                  impliedStrict: false,
                  jsx: false,
                },
              },
            },
          ],
        })
      ));

    it("sorts overrides", () =>
      expect(
        pluginFormat({
          overrides: [
            {
              env: {},
              excludedFiles: [],
              extends: [],
              files: [],
              globals: {},
              parser: "",
              parserOptions: {},
              plugins: [],
              processor: "",
              rules: {},
              settings: {},
            },
          ],
        })
      ).toStrictEqual(
        defaultFormat({
          overrides: [
            {
              files: [],
              excludedFiles: [],
              plugins: [],
              extends: [],
              processor: "",
              parser: "",
              parserOptions: {},
              settings: {},
              env: {},
              globals: {},
              rules: {},
            },
          ],
        })
      ));

    it("uniqs some arrays", () =>
      expect(
        pluginFormat({
          plugins: ["b", "a", "b"],
          extends: ["b", "a", "b"],
          overrides: [{ plugins: ["b", "a", "b"], extends: ["b", "a", "b"] }],
        })
      ).toStrictEqual(
        defaultFormat({
          plugins: ["b", "a"],
          extends: ["b", "a"],
          overrides: [{ plugins: ["b", "a"], extends: ["b", "a"] }],
        })
      ));

    it("sorts and uniqs some arrays", () =>
      expect(
        pluginFormat({
          overrides: [
            { files: ["b", "a", "b"], excludedFiles: ["b", "a", "b"] },
          ],
        })
      ).toStrictEqual(
        defaultFormat({
          overrides: [{ files: ["a", "b"], excludedFiles: ["a", "b"] }],
        })
      ));

    it("converts number severities to strings", () =>
      expect(
        pluginFormat({
          rules: { a: 0, b: 1, c: 2, d: [0, 0], e: [1, 1], f: [2, 2] },
          overrides: [
            { rules: { a: 0, b: 1, c: 2, d: [0, 0], e: [1, 1], f: [2, 2] } },
          ],
        })
      ).toStrictEqual(
        defaultFormat({
          rules: {
            a: "off",
            b: "warn",
            c: "error",
            d: ["off", 0],
            e: ["warn", 1],
            f: ["error", 2],
          },
          overrides: [
            {
              rules: {
                a: "off",
                b: "warn",
                c: "error",
                d: ["off", 0],
                e: ["warn", 1],
                f: ["error", 2],
              },
            },
          ],
        })
      ));

    it("sorts plugin rules to the bottom", () =>
      expect(
        pluginFormat({
          rules: {
            "c": "off",
            "b/rule": "off",
            "a": "off",
          },
          overrides: [
            {
              rules: {
                "c": "off",
                "b/rule": "off",
                "a": "off",
              },
            },
          ],
        })
      ).toStrictEqual(
        defaultFormat({
          rules: {
            "a": "off",
            "c": "off",
            "b/rule": "off",
          },
          overrides: [
            {
              rules: {
                "a": "off",
                "c": "off",
                "b/rule": "off",
              },
            },
          ],
        })
      ));

    it("https://github.com/babel/babel/tree/main/eslint/babel-eslint-parser#additional-parser-configuration", () =>
      expectExample({
        parser: "@babel/eslint-parser",
        parserOptions: {
          requireConfigFile: false,
          babelOptions: {},
        },
      }));

    it("https://github.com/babel/babel/tree/main/eslint/babel-eslint-parser#additional-parser-configuration 2", () =>
      expectExample({
        parser: "@babel/eslint-parser",
        parserOptions: {
          sourceType: "module",
          allowImportExportEverywhere: false,
          ecmaFeatures: { globalReturn: false },
          babelOptions: {},
        },
      }));

    it("sort parserOptions.babelOptions like a babel config", () =>
      expectExample({
        parserOptions: { babelOptions: { presets: [], plugins: [] } },
      }));

    it("sort ignorePatterns like eslintignore", () =>
      expect(pluginFormat({ ignorePatterns: ["b", "a", "b"] })).toStrictEqual(
        defaultFormat({ ignorePatterns: ["a", "b"] })
      ));
  });

  describe("base rules", () => {
    const { expectExample } = formatJSON("eslintrc.json", plugin);

    it("https://eslint.org/docs/latest/rules/no-fallthrough#options", () =>
      expectExample({
        rules: {
          "no-fallthrough": [
            "error",
            { commentPattern: "", allowEmptyCase: false },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/no-irregular-whitespace#options", () =>
      expectExample({
        rules: {
          "no-irregular-whitespace": [
            "error",
            {
              skipStrings: false,
              skipComments: false,
              skipRegExps: false,
              skipTemplates: false,
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/no-unused-vars#options", () =>
      expectExample({
        rules: {
          "no-unused-vars": [
            "error",
            { vars: "all", args: "after-used", ignoreRestSiblings: false },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/no-use-before-define#options", () =>
      expectExample({
        rules: {
          "no-use-before-define": [
            "error",
            {
              functions: true,
              classes: true,
              variables: true,
              allowNamedExports: false,
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/use-isnan#options", () =>
      expectExample({
        rules: {
          "use-isnan": [
            "error",
            { enforceForSwitchCase: true, enforceForIndexOf: true },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/accessor-pairs#options", () =>
      expectExample({
        rules: {
          "accessor-pairs": [
            "error",
            {
              setWithoutGet: true,
              getWithoutSet: false,
              enforceForClassMembers: false,
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/camelcase#options", () =>
      expectExample({
        rules: {
          camelcase: [
            "error",
            {
              properties: "",
              ignoreDestructuring: false,
              ignoreImports: false,
              ignoreGlobals: false,
              allow: [],
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/capitalized-comments#options", () =>
      expectExample({
        rules: {
          "capitalized-comments": [
            "error",
            "always",
            { ignorePattern: "pragma|ignored", ignoreInlineComments: true },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/class-methods-use-this#options", () =>
      expectExample({
        rules: {
          "class-methods-use-this": [
            "error",
            { exceptMethods: [], enforceForClassFields: false },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/func-name-matching#options", () =>
      expectExample({
        rules: {
          "func-name-matching": [
            "error",
            "always",
            {
              considerPropertyDescriptor: true,
              includeCommonJSModuleExports: true,
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/id-length#options", () =>
      expectExample({
        rules: {
          "id-length": [
            "error",
            {
              min: 0,
              max: 0,
              properties: "",
              exceptions: [],
              exceptionPatterns: [],
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/id-match#options", () =>
      expectExample({
        rules: {
          "id-match": [
            "error",
            "^[a-z]+([A-Z][a-z]+)*$",
            {
              properties: false,
              classFields: false,
              onlyDeclarations: false,
              ignoreDestructuring: false,
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/max-lines-per-function#options", () =>
      expectExample({
        rules: {
          "max-lines-per-function": [
            "error",
            {
              max: 0,
              skipBlankLines: false,
              skipComments: false,
              IIFEs: false,
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/new-cap#options", () =>
      expectExample({
        rules: {
          "new-cap": [
            "error",
            {
              newIsCap: false,
              capIsNew: false,
              newIsCapExceptions: [],
              newIsCapExceptionPattern: "",
              capIsNewExceptions: [],
              capIsNewExceptionPattern: "",
              properties: false,
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/no-implicit-coercion#options", () =>
      expectExample({
        rules: {
          "no-implicit-coercion": [
            "error",
            {
              boolean: false,
              number: false,
              string: false,
              disallowTemplateShorthand: false,
              allow: [],
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/no-magic-numbers#options", () =>
      expectExample({
        rules: {
          "no-magic-numbers": [
            "error",
            {
              ignore: [],
              ignoreArrayIndexes: false,
              ignoreDefaultValues: false,
              ignoreClassFieldInitialValues: false,
              enforceConst: false,
              detectObjects: false,
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/no-mixed-operators#options", () =>
      expectExample({
        rules: {
          "no-mixed-operators": [
            "error",
            {
              groups: [
                ["+", "-", "*", "/", "%", "**"],
                ["&", "|", "^", "~", "<<", ">>", ">>>"],
                ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
                ["&&", "||"],
                ["in", "instanceof"],
              ],
              allowSamePrecedence: true,
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/no-param-reassign#options", () =>
      expectExample({
        rules: {
          "no-param-reassign": [
            "error",
            {
              props: false,
              ignorePropertyModificationsFor: [],
              ignorePropertyModificationsForRegex: [],
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/no-restricted-exports#options", () =>
      expectExample({
        rules: {
          "no-restricted-exports": [
            "error",
            {
              restrictedNamedExports: [],
              restrictDefaultExports: {
                direct: false,
                named: false,
                defaultFrom: false,
                namedFrom: false,
                namespaceFrom: false,
              },
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/no-restricted-imports#options", () =>
      expectExample({
        rules: {
          "no-restricted-imports": [
            "error",
            {
              paths: ["import1", "import2"],
              patterns: ["import1/private/*", "import2/*", "!import2/good"],
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/no-restricted-imports#options custom message", () =>
      expectExample({
        rules: {
          "no-restricted-imports": [
            "error",
            {
              name: "import-foo",
              message: "Please use import-bar instead.",
            },
            {
              name: "import-baz",
              message: "Please use import-quux instead.",
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/no-restricted-imports#options custom message 2", () =>
      expectExample({
        rules: {
          "no-restricted-imports": [
            "error",
            {
              paths: [
                {
                  name: "import-foo",
                  message: "Please use import-bar instead.",
                },
                {
                  name: "import-baz",
                  message: "Please use import-quux instead.",
                },
              ],
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/no-restricted-imports#options importNames", () =>
      expectExample({
        rules: {
          "no-restricted-imports": [
            "error",
            {
              paths: [
                {
                  name: "import-foo",
                  importNames: ["Bar"],
                  message: "Please use Bar from /import-bar/baz/ instead.",
                },
              ],
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/no-restricted-imports#options custom message pattern match", () =>
      expectExample({
        rules: {
          "no-restricted-imports": [
            "error",
            {
              patterns: [
                {
                  group: ["import1/private/*"],
                  message: "usage of import1 private modules not allowed.",
                },
                {
                  group: ["import2/*", "!import2/good"],
                  message:
                    "import2 is deprecated, except the modules in import2/good.",
                },
              ],
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/no-restricted-imports#options case-sensitive", () =>
      expectExample({
        rules: {
          "no-restricted-imports": [
            "error",
            {
              patterns: [
                {
                  group: ["import1/private/prefix[A-Z]*"],
                  caseSensitive: true,
                },
              ],
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/no-restricted-imports#options group importNames", () =>
      expectExample({
        rules: {
          "no-restricted-imports": [
            "error",
            {
              patterns: [
                {
                  group: ["utils/*"],
                  importNames: ["isEmpty"],
                  message: "Use 'isEmpty' from lodash instead.",
                },
              ],
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/no-restricted-properties#options", () =>
      expectExample({
        rules: {
          "no-restricted-properties": [
            "error",
            {
              object: "disallowedObjectName",
              property: "disallowedPropertyName",
            },
            {
              object: "disallowedObjectName",
              property: "anotherDisallowedPropertyName",
              message: "Please use allowedObjectName.allowedPropertyName.",
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/no-restricted-syntax#options", () =>
      expectExample({
        rules: {
          "no-restricted-syntax": [
            "error",
            {
              selector: "FunctionExpression",
              message: "Function expressions are not allowed.",
            },
            {
              selector:
                "CallExpression[callee.name='setTimeout'][arguments.length!=2]",
              message: "setTimeout must always be invoked with two arguments.",
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/no-shadow#options", () =>
      expectExample({
        rules: {
          "no-shadow": [
            "error",
            {
              builtinGlobals: false,
              hoist: "functions",
              allow: [],
              ignoreOnInitialization: false,
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/no-underscore-dangle#options", () =>
      expectExample({
        rules: {
          "no-underscore-dangle": [
            "error",
            {
              allow: [],
              allowAfterThis: false,
              allowAfterSuper: false,
              allowAfterThisConstructor: false,
              enforceInMethodNames: false,
              enforceInClassFields: false,
              allowInArrayDestructuring: true,
              allowInObjectDestructuring: true,
              allowFunctionParams: true,
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/no-unused-expressions#options", () =>
      expectExample({
        rules: {
          "no-unused-expressions": [
            "error",
            {
              allowShortCircuit: false,
              allowTernary: false,
              allowTaggedTemplates: false,
              enforceForJSX: false,
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/no-useless-rename#options", () =>
      expectExample({
        rules: {
          "no-useless-rename": [
            "error",
            {
              ignoreDestructuring: false,
              ignoreImport: false,
              ignoreExport: false,
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/no-warning-comments#options", () =>
      expectExample({
        rules: {
          "no-warning-comments": [
            "error",
            {
              terms: [],
              location: "",
              decoration: [],
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/object-shorthand#options", () =>
      expectExample({
        rules: {
          "object-shorthand": [
            "error",
            "always",
            {
              avoidQuotes: true,
              ignoreConstructors: true,
              methodsIgnorePattern: "",
              avoidExplicitReturnArrows: true,
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/one-var#options", () =>
      expectExample({
        rules: {
          "one-var": [
            "error",
            { initialized: "always", uninitialized: "never" },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/one-var#options alternate", () =>
      expectExample({
        rules: {
          "one-var": [
            "error",
            { initialized: "always", uninitialized: "never" },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/prefer-destructuring#options", () =>
      expectExample({
        rules: {
          "prefer-destructuring": [
            "error",
            {
              array: true,
              object: true,
            },
            {
              enforceForRenamedProperties: false,
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/prefer-destructuring#options alternate", () =>
      expectExample({
        rules: {
          "prefer-destructuring": [
            "error",
            {
              VariableDeclarator: {
                array: false,
                object: true,
              },
              AssignmentExpression: {
                array: true,
                object: true,
              },
            },
            {
              enforceForRenamedProperties: false,
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/quote-props#options", () =>
      expectExample({
        rules: {
          "quote-props": [
            "error",
            "as-needed",
            {
              keywords: true,
              unnecessary: false,
              numbers: true,
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/sort-imports#options", () =>
      expectExample({
        rules: {
          "sort-imports": [
            "error",
            {
              ignoreCase: false,
              ignoreDeclarationSort: false,
              ignoreMemberSort: false,
              memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
              allowSeparatedGroups: false,
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/sort-keys#options", () =>
      expectExample({
        rules: {
          "sort-keys": [
            "error",
            {
              caseSensitive: false,
              minKeys: 0,
              natural: false,
              allowLineSeparatedGroups: false,
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/spaced-comment#options", () =>
      expectExample({
        rules: {
          "spaced-comment": [
            "error",
            "always",
            {
              markers: ["/"],
              exceptions: ["-", "+"],
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/spaced-comment#options alternate", () =>
      expectExample({
        rules: {
          "spaced-comment": [
            "error",
            "always",
            {
              line: {
                markers: ["/"],
                exceptions: ["-", "+"],
              },
              block: {
                markers: ["!"],
                exceptions: ["*"],
                balanced: true,
              },
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/array-bracket-newline#options", () =>
      expectExample({
        rules: {
          "array-bracket-newline": ["error", { multiline: true, minItems: 2 }],
        },
      }));

    it("https://eslint.org/docs/latest/rules/array-bracket-spacing#options", () =>
      expectExample({
        rules: {
          "array-bracket-spacing": [
            "error",
            "never",
            {
              singleValue: true,
              objectsInArrays: true,
              arraysInArrays: true,
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/array-element-newline#options", () =>
      expectExample({
        rules: {
          "array-element-newline": ["error", { multiline: true, minItems: 3 }],
        },
      }));

    it("https://eslint.org/docs/latest/rules/array-element-newline#options alternate", () =>
      expectExample({
        rules: {
          "array-element-newline": [
            "error",
            {
              ArrayExpression: { multiline: true, minItems: 3 },
              ArrayPattern: { multiline: true, minItems: 3 },
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/comma-dangle#options", () =>
      expectExample({
        rules: {
          "comma-dangle": [
            "error",
            {
              arrays: "never",
              objects: "never",
              imports: "never",
              exports: "never",
              functions: "never",
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/comma-spacing#options", () =>
      expectExample({
        rules: { "comma-spacing": ["error", { before: false, after: true }] },
      }));

    it("https://eslint.org/docs/latest/rules/comma-style#options", () =>
      expectExample({
        rules: {
          "comma-style": [
            "error",
            "first",
            {
              exceptions: {
                ArrayExpression: true,
                ArrayPattern: true,
                ArrowFunctionExpression: true,
                CallExpression: true,
                FunctionDeclaration: true,
                FunctionExpression: true,
                ImportDeclaration: true,
                ObjectExpression: true,
                ObjectPattern: true,
                VariableDeclaration: true,
                NewExpression: true,
              },
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/generator-star-spacing#options", () =>
      expectExample({
        rules: {
          "generator-star-spacing": [
            "error",
            {
              before: false,
              after: true,
              named: { before: true, after: true },
              anonymous: { before: true, after: true },
              method: { before: true, after: true },
            },
          ],
        },
      }));

    it.todo("https://eslint.org/docs/latest/rules/indent#options");

    it.todo("https://eslint.org/docs/latest/rules/key-spacing#options");

    it("https://eslint.org/docs/latest/rules/keyword-spacing#options", () =>
      expectExample({
        rules: {
          "keyword-spacing": [
            "error",
            {
              before: false,
              after: false,
              overrides: {
                if: { before: false, after: false },
                for: { before: false, after: false },
                while: { before: false, after: false },
                static: { before: false, after: false },
                as: { before: false, after: false },
              },
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/line-comment-position#options", () =>
      expectExample({
        rules: {
          "line-comment-position": [
            "error",
            {
              position: "above",
              ignorePattern: "",
              applyDefaultIgnorePatterns: false,
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/lines-around-comment#options", () =>
      expectExample({
        rules: {
          "lines-around-comment": [
            "error",
            {
              beforeBlockComment: true,
              afterBlockComment: true,
              beforeLineComment: true,
              afterLineComment: true,
              allowBlockStart: true,
              allowBlockEnd: true,
              allowObjectStart: true,
              allowObjectEnd: true,
              allowArrayStart: true,
              allowArrayEnd: true,
              allowClassStart: true,
              allowClassEnd: true,
              applyDefaultIgnorePatterns: false,
              ignorePattern: "",
              afterHashbangComment: true,
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/max-len#options", () =>
      expectExample({
        rules: {
          "max-len": [
            "error",
            {
              code: 0,
              tabWidth: 0,
              comments: 0,
              ignorePattern: false,
              ignoreComments: true,
              ignoreTrailingComments: true,
              ignoreUrls: true,
              ignoreStrings: true,
              ignoreTemplateLiterals: true,
              ignoreRegExpLiterals: true,
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/no-extra-parens#options", () =>
      expectExample({
        rules: {
          "no-extra-parens": [
            "error",
            "all",
            {
              conditionalAssign: false,
              returnAssign: false,
              nestedBinaryExpressions: false,
              ignoreJSX: "",
              enforceForArrowConditionals: false,
              enforceForSequenceExpressions: false,
              enforceForNewInMemberExpressions: false,
              enforceForFunctionPrototypeMethods: false,
              allowParensAfterCommentPattern: "any-string-pattern",
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/no-multi-spaces#options", () =>
      expectExample({
        rules: {
          "no-multi-spaces": [
            "error",
            {
              ignoreEOLComments: true,
              exceptions: {
                Property: true,
                BinaryExpression: true,
                VariableDeclarator: true,
                ImportDeclaration: true,
              },
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/no-multiple-empty-lines#options", () =>
      expectExample({
        rules: {
          "no-multiple-empty-lines": [
            "error",
            { max: 0, maxEOF: 0, maxBOF: 0 },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/no-trailing-spaces#options", () =>
      expectExample({
        rules: {
          "no-trailing-spaces": [
            "error",
            {
              skipBlankLines: false,
              ignoreComments: false,
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/object-curly-newline#options", () =>
      expectExample({
        rules: {
          "object-curly-newline": [
            "error",
            { multiline: true, minProperties: 3, consistent: false },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/object-curly-newline#options alternate", () =>
      expectExample({
        rules: {
          "object-curly-newline": [
            "error",
            {
              ObjectExpression: {
                multiline: true,
                minProperties: 3,
                consistent: false,
              },
              ObjectPattern: {
                multiline: true,
                minProperties: 3,
                consistent: false,
              },
              ImportDeclaration: {
                multiline: true,
                minProperties: 3,
                consistent: false,
              },
              ExportDeclaration: {
                multiline: true,
                minProperties: 3,
                consistent: false,
              },
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/padding-line-between-statements", () =>
      expectExample({
        rules: {
          "padding-line-between-statements": [
            "error",
            { blankLine: "", prev: "", next: "" },
            { blankLine: "", prev: "", next: "" },
            { blankLine: "", prev: "", next: "" },
            { blankLine: "", prev: "", next: "" },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/semi-spacing#options", () =>
      expectExample({
        rules: { "semi-spacing": ["error", { before: false, after: true }] },
      }));

    it("https://eslint.org/docs/latest/rules/space-before-blocks#options", () =>
      expectExample({
        rules: {
          "space-before-blocks": [
            "error",
            { functions: "never", keywords: "never", classes: "always" },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/space-before-function-paren#options", () =>
      expectExample({
        rules: {
          "space-before-function-paren": [
            "error",
            {
              anonymous: "always",
              named: "always",
              asyncArrow: "always",
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/space-unary-ops#options", () =>
      expectExample({
        rules: {
          "space-unary-ops": [
            "error",
            {
              words: true,
              nonwords: false,
              overrides: {
                "new": false,
                "++": true,
              },
            },
          ],
        },
      }));

    it("https://eslint.org/docs/latest/rules/yield-star-spacing#options", () =>
      expectExample({
        rules: {
          "yield-star-spacing": ["error", { before: true, after: false }],
        },
      }));
  });

  describe("@typescript-eslint/eslint-plugin", () => {
    const { expectExample } = formatJSON("eslintrc.json", plugin);

    it("https://typescript-eslint.io/rules/ban-ts-comment/", () =>
      expectExample({
        rules: {
          "@typescript-eslint/ban-ts-comment": [
            "error",
            {
              "ts-expect-error": "allow-with-description",
              "ts-ignore": true,
              "ts-nocheck": true,
              "ts-check": false,
              "minimumDescriptionLength": 3,
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/ban-types/#options", () =>
      expectExample({
        rules: {
          "@typescript-eslint/ban-types": [
            "error",
            {
              types: {
                // add a custom message to help explain why not to use it
                "Foo": "Don't use Foo because it is unsafe",

                // add a custom message, AND tell the plugin how to fix it
                "OldAPI": {
                  message: "Use NewAPI instead",
                  fixWith: "NewAPI",
                },

                // un-ban a type that's banned by default
                "{}": false,
              },
              extendDefaults: true,
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/consistent-type-imports/", () =>
      expectExample({
        rules: {
          "@typescript-eslint/consistent-type-imports": [
            "error",
            {
              prefer: "type-imports",
              disallowTypeAnnotations: true,
              fixStyle: "separate-type-imports",
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/explicit-function-return-type/", () =>
      expectExample({
        rules: {
          "@typescript-eslint/explicit-function-return-type": [
            "error",
            {
              allowExpressions: false,
              allowTypedFunctionExpressions: true,
              allowHigherOrderFunctions: true,
              allowDirectConstAssertionInArrowFunctions: true,
              allowConciseArrowFunctionExpressionsStartingWithVoid: false,
              allowFunctionsWithoutTypeParameters: false,
              allowedNames: [],
              allowIIFEs: false,
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/explicit-member-accessibility/", () =>
      expectExample({
        rules: {
          "@typescript-eslint/explicit-member-accessibility": [
            "error",
            {
              accessibility: "",
              ignoredMethodNames: [],
              overrides: {
                accessors: "",
                constructors: "",
                methods: "",
                properties: "",
                parameterProperties: "",
              },
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/explicit-module-boundary-types/", () =>
      expectExample({
        rules: {
          "@typescript-eslint/explicit-module-boundary-types": [
            "error",
            {
              allowArgumentsExplicitlyTypedAsAny: false,
              allowDirectConstAssertionInArrowFunctions: true,
              allowedNames: [],
              allowHigherOrderFunctions: true,
              allowTypedFunctionExpressions: true,
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/member-ordering/", () =>
      expectExample({
        rules: {
          "@typescript-eslint/member-ordering": [
            "error",
            {
              default: { memberTypes: [], optionalityOrder: "", order: "" },
              classes: { memberTypes: [], optionalityOrder: "", order: "" },
              classExpressions: {
                memberTypes: [],
                optionalityOrder: "",
                order: "",
              },
              interfaces: { memberTypes: [], optionalityOrder: "", order: "" },
              typeLiterals: {
                memberTypes: [],
                optionalityOrder: "",
                order: "",
              },
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/naming-convention/", () =>
      expectExample({
        rules: {
          "@typescript-eslint/naming-convention": [
            "error",
            {
              selector: "default",
              format: ["camelCase"],
              leadingUnderscore: "allow",
              trailingUnderscore: "allow",
            },

            {
              selector: "variable",
              format: ["camelCase", "UPPER_CASE"],
              leadingUnderscore: "allow",
              trailingUnderscore: "allow",
            },

            {
              selector: "typeLike",
              format: ["PascalCase"],
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/naming-convention/#enforce-that-all-variables-functions-and-properties-follow-are-camelcase", () =>
      expectExample({
        rules: {
          "@typescript-eslint/naming-convention": [
            "error",
            { selector: "variableLike", format: ["camelCase"] },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/naming-convention/#enforce-that-private-members-are-prefixed-with-an-underscore", () =>
      expectExample({
        rules: {
          "@typescript-eslint/naming-convention": [
            "error",
            {
              selector: "memberLike",
              modifiers: ["private"],
              format: ["camelCase"],
              leadingUnderscore: "require",
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/naming-convention/#enforce-that-boolean-variables-are-prefixed-with-an-allowed-verb", () =>
      expectExample({
        rules: {
          "@typescript-eslint/naming-convention": [
            "error",
            {
              selector: "variable",
              types: ["boolean"],
              format: ["PascalCase"],
              prefix: ["is", "should", "has", "can", "did", "will"],
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/naming-convention/#enforce-that-all-variables-are-either-in-camelcase-or-upper_case", () =>
      expectExample({
        rules: {
          "@typescript-eslint/naming-convention": [
            "error",
            {
              selector: "variable",
              format: ["camelCase", "UPPER_CASE"],
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/naming-convention/#enforce-that-all-const-variables-are-in-upper_case", () =>
      expectExample({
        rules: {
          "@typescript-eslint/naming-convention": [
            "error",
            {
              selector: "variable",
              modifiers: ["const"],
              format: ["UPPER_CASE"],
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/naming-convention/#enforce-that-type-parameters-generics-are-prefixed-with-t", () =>
      expectExample({
        rules: {
          "@typescript-eslint/naming-convention": [
            "error",
            {
              selector: "typeParameter",
              format: ["PascalCase"],
              prefix: ["T"],
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/naming-convention/#enforce-that-interface-names-do-not-begin-with-an-i", () =>
      expectExample({
        rules: {
          "@typescript-eslint/naming-convention": [
            "error",
            {
              selector: "interface",
              format: ["PascalCase"],
              custom: {
                regex: "^I[A-Z]",
                match: false,
              },
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/naming-convention/#enforce-that-variable-and-function-names-are-in-camelcase", () =>
      expectExample({
        rules: {
          "@typescript-eslint/naming-convention": [
            "error",
            {
              selector: ["variable", "function"],
              format: ["camelCase"],
              leadingUnderscore: "allow",
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/naming-convention/#ignore-properties-that-require-quotes", () =>
      expectExample({
        rules: {
          "@typescript-eslint/naming-convention": [
            "error",
            {
              selector: [
                "classProperty",
                "objectLiteralProperty",
                "typeProperty",
                "classMethod",
                "objectLiteralMethod",
                "typeMethod",
                "accessor",
                "enumMember",
              ],
              // EDITED modifiers above format
              modifiers: ["requiresQuotes"],
              format: null,
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/naming-convention/#ignore-properties-that-require-quotes 2", () =>
      expectExample({
        rules: {
          "@typescript-eslint/naming-convention": [
            "error",
            {
              selector: "property",
              format: ["strictCamelCase"],
              filter: {
                // you can expand this regex to add more allowed names
                regex: "^(Property-Name-One|Property-Name-Two)$",
                match: false,
              },
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/naming-convention/#ignore-properties-that-require-quotes 3", () =>
      expectExample({
        rules: {
          "@typescript-eslint/naming-convention": [
            "error",
            {
              selector: "property",
              format: ["strictCamelCase"],
              filter: {
                // you can expand this regex as you find more cases that require quoting that you want to allow
                regex: "[- ]",
                match: false,
              },
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/naming-convention/#ignore-destructured-names", () =>
      expectExample({
        rules: {
          "@typescript-eslint/naming-convention": [
            "error",
            {
              selector: "variable",
              modifiers: ["destructured"],
              format: null,
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/naming-convention/#enforce-the-codebase-follows-eslints-camelcase-conventions", () =>
      expectExample({
        rules: {
          "@typescript-eslint/naming-convention": [
            "error",
            {
              selector: "default",
              format: ["camelCase"],
            },

            {
              selector: "variable",
              format: ["camelCase", "UPPER_CASE"],
            },
            {
              selector: "parameter",
              format: ["camelCase"],
              leadingUnderscore: "allow",
            },

            {
              selector: "memberLike",
              modifiers: ["private"],
              format: ["camelCase"],
              leadingUnderscore: "require",
            },

            {
              selector: "typeLike",
              format: ["PascalCase"],
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/no-floating-promises/", () =>
      expectExample({
        rules: {
          "@typescript-eslint/no-floating-promises": [
            "error",
            { ignoreVoid: true, ignoreIIFE: false },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/no-invalid-void-type/", () =>
      expectExample({
        rules: {
          "@typescript-eslint/no-invalid-void-type": [
            "error",
            { allowInGenericTypeArguments: true, allowAsThisParameter: false },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/no-misused-promises/", () =>
      expectExample({
        rules: {
          "@typescript-eslint/no-misused-promises": [
            "error",
            {
              checksConditionals: true,
              checksVoidReturn: {
                arguments: false,
                attributes: false,
                properties: false,
                returns: false,
                variables: false,
              },
              checksSpreads: true,
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/no-type-alias/", () =>
      expectExample({
        rules: {
          "@typescript-eslint/no-type-alias": [
            "error",
            {
              allowAliases: "never",
              allowCallbacks: "never",
              allowConditionalTypes: "never",
              allowConstructors: "never",
              allowLiterals: "never",
              allowMappedTypes: "never",
              allowTupleTypes: "never",
              allowGenerics: "never",
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/no-unnecessary-boolean-literal-compare/", () =>
      expectExample({
        rules: {
          "@typescript-eslint/no-unnecessary-boolean-literal-compare": [
            "error",
            {
              allowComparingNullableBooleansToTrue: true,
              allowComparingNullableBooleansToFalse: true,
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/prefer-nullish-coalescing/", () =>
      expectExample({
        rules: {
          "@typescript-eslint/prefer-nullish-coalescing": [
            "error",
            {
              ignoreConditionalTests: true,
              ignoreTernaryTests: true,
              ignoreMixedLogicalExpressions: true,
              allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing: false,
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/restrict-plus-operands/", () =>
      expectExample({
        rules: {
          "@typescript-eslint/restrict-plus-operands": [
            "error",
            { checkCompoundAssignments: false, allowAny: false },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/restrict-template-expressions/", () =>
      expectExample({
        rules: {
          "@typescript-eslint/restrict-template-expressions": [
            "error",
            {
              allowNumber: false,
              allowBoolean: false,
              allowAny: false,
              allowNullish: false,
              allowRegExp: false,
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/strict-boolean-expressions/", () =>
      expectExample({
        rules: {
          "@typescript-eslint/strict-boolean-expressions": [
            "error",
            {
              allowString: true,
              allowNumber: true,
              allowNullableObject: true,
              allowNullableBoolean: false,
              allowNullableString: false,
              allowNullableNumber: false,
              allowNullableEnum: true,
              allowAny: false,
              allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing: false,
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/dot-notation/", () =>
      expectExample({
        rules: {
          "@typescript-eslint/dot-notation": [
            "error",
            {
              allowKeywords: false,
              allowPattern: false,
              allowPrivateClassPropertyAccess: false,
              allowProtectedClassPropertyAccess: false,
              allowIndexSignaturePropertyAccess: false,
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/no-magic-numbers/", () =>
      expectExample({
        rules: {
          "@typescript-eslint/no-magic-numbers": [
            "error",
            {
              ignore: [],
              ignoreArrayIndexes: false,
              ignoreDefaultValues: false,
              ignoreClassFieldInitialValues: false,
              enforceConst: false,
              detectObjects: false,
              ignoreEnums: false,
              ignoreNumericLiteralTypes: false,
              ignoreReadonlyClassProperties: false,
              ignoreTypeIndexes: false,
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/no-restricted-imports/", () =>
      expectExample({
        rules: {
          "@typescript-eslint/no-restricted-imports": [
            "error",
            {
              paths: ["import1", "import2"],
              patterns: ["import1/private/*", "import2/*", "!import2/good"],
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/no-restricted-imports/ custom message", () =>
      expectExample({
        rules: {
          "@typescript-eslint/no-restricted-imports": [
            "error",
            {
              name: "import-foo",
              message: "Please use import-bar instead.",
            },
            {
              name: "import-baz",
              message: "Please use import-quux instead.",
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/no-restricted-imports/ custom message 2", () =>
      expectExample({
        rules: {
          "@typescript-eslint/no-restricted-imports": [
            "error",
            {
              paths: [
                {
                  name: "import-foo",
                  message: "Please use import-bar instead.",
                  allowTypeImports: true,
                },
                {
                  name: "import-baz",
                  message: "Please use import-quux instead.",
                  allowTypeImports: true,
                },
              ],
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/no-restricted-imports/ importNames", () =>
      expectExample({
        rules: {
          "@typescript-eslint/no-restricted-imports": [
            "error",
            {
              paths: [
                {
                  name: "import-foo",
                  importNames: ["Bar"],
                  message: "Please use Bar from /import-bar/baz/ instead.",
                  allowTypeImports: true,
                },
              ],
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/no-restricted-imports/ custom message pattern match", () =>
      expectExample({
        rules: {
          "@typescript-eslint/no-restricted-imports": [
            "error",
            {
              patterns: [
                {
                  group: ["import1/private/*"],
                  message: "usage of import1 private modules not allowed.",
                  allowTypeImports: true,
                },
                {
                  group: ["import2/*", "!import2/good"],
                  message:
                    "import2 is deprecated, except the modules in import2/good.",
                  allowTypeImports: true,
                },
              ],
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/no-restricted-imports/ case-sensitive", () =>
      expectExample({
        rules: {
          "@typescript-eslint/no-restricted-imports": [
            "error",
            {
              patterns: [
                {
                  group: ["import1/private/prefix[A-Z]*"],
                  caseSensitive: true,
                  allowTypeImports: true,
                },
              ],
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/no-restricted-imports/ group importNames", () =>
      expectExample({
        rules: {
          "@typescript-eslint/no-restricted-imports": [
            "error",
            {
              patterns: [
                {
                  group: ["utils/*"],
                  importNames: ["isEmpty"],
                  message: "Use 'isEmpty' from lodash instead.",
                  allowTypeImports: true,
                },
              ],
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/no-shadow/", () =>
      expectExample({
        rules: {
          "@typescript-eslint/no-shadow": [
            "error",
            {
              builtinGlobals: false,
              hoist: "functions",
              allow: [],
              ignoreOnInitialization: false,
              ignoreTypeValueShadow: true,
              ignoreFunctionTypeParameterNameValueShadow: true,
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/no-unused-expressions/", () =>
      expectExample({
        rules: {
          "@typescript-eslint/no-unused-expressions": [
            "error",
            {
              allowShortCircuit: false,
              allowTernary: false,
              allowTaggedTemplates: false,
              enforceForJSX: false,
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/no-unused-vars/", () =>
      expectExample({
        rules: {
          "@typescript-eslint/no-unused-vars": [
            "error",
            { vars: "all", args: "after-used", ignoreRestSiblings: false },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/no-use-before-define/", () =>
      expectExample({
        rules: {
          "@typescript-eslint/no-use-before-define": [
            "error",
            {
              functions: true,
              classes: true,
              variables: true,
              allowNamedExports: false,
              enums: true,
              typedefs: true,
              ignoreTypeReferences: true,
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/comma-dangle/", () =>
      expectExample({
        rules: {
          "@typescript-eslint/comma-dangle": [
            "error",
            {
              arrays: "never",
              objects: "never",
              imports: "never",
              exports: "never",
              functions: "never",
              enums: "never",
              generics: "never",
              tuples: "never",
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/comma-spacing/", () =>
      expectExample({
        rules: {
          "@typescript-eslint/comma-spacing": [
            "error",
            { before: false, after: true },
          ],
        },
      }));

    it.todo("https://typescript-eslint.io/rules/indent/");

    it.todo("https://typescript-eslint.io/rules/key-spacing/");

    it("https://typescript-eslint.io/rules/keyword-spacing/", () =>
      expectExample({
        rules: {
          "@typescript-eslint/keyword-spacing": [
            "error",
            {
              before: false,
              after: false,
              overrides: {
                if: { before: false, after: false },
                for: { before: false, after: false },
                while: { before: false, after: false },
                static: { before: false, after: false },
                as: { before: false, after: false },
              },
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/member-delimiter-style/", () =>
      expectExample({
        rules: {
          "@typescript-eslint/member-delimiter-style": [
            "error",
            {
              multiline: { delimiter: "semi", requireLast: true },
              singleline: { delimiter: "semi", requireLast: false },
              multilineDetection: "brackets",
              overrides: {
                interface: {
                  multiline: { delimiter: "semi", requireLast: true },
                  singleline: { delimiter: "semi", requireLast: false },
                },
                typeLiteral: {
                  multiline: { delimiter: "semi", requireLast: true },
                  singleline: { delimiter: "semi", requireLast: false },
                },
              },
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/no-extra-parens/", () =>
      expectExample({
        rules: {
          "@typescript-eslint/no-extra-parens": [
            "error",
            {
              conditionalAssign: false,
              returnAssign: false,
              nestedBinaryExpressions: false,
              ignoreJSX: "",
              enforceForArrowConditionals: false,
              enforceForSequenceExpressions: false,
              enforceForNewInMemberExpressions: false,
              enforceForFunctionPrototypeMethods: false,
              allowParensAfterCommentPattern: "any-string-pattern",
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/padding-line-between-statements/", () =>
      expectExample({
        rules: {
          "@typescript-eslint/padding-line-between-statements": [
            "error",
            { blankLine: "", prev: "", next: "" },
            { blankLine: "", prev: "", next: "" },
            { blankLine: "", prev: "", next: "" },
            { blankLine: "", prev: "", next: "" },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/space-before-blocks/", () =>
      expectExample({
        rules: {
          "@typescript-eslint/space-before-blocks": [
            "error",
            { functions: "never", keywords: "never", classes: "always" },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/space-before-function-paren/", () =>
      expectExample({
        rules: {
          "@typescript-eslint/space-before-function-paren": [
            "error",
            {
              anonymous: "always",
              named: "always",
              asyncArrow: "always",
            },
          ],
        },
      }));

    it("https://typescript-eslint.io/rules/type-annotation-spacing/", () =>
      expectExample({
        rules: {
          "@typescript-eslint/type-annotation-spacing": [
            "error",
            {
              before: false,
              after: false,
              overrides: {
                colon: {
                  before: false,
                  after: false,
                },
                arrow: {
                  before: false,
                  after: false,
                },
                variable: {
                  before: false,
                  after: false,
                },
                parameter: {
                  before: false,
                  after: false,
                },
                property: {
                  before: false,
                  after: false,
                },
                returnType: {
                  before: false,
                  after: false,
                },
              },
            },
          ],
        },
      }));
  });

  describe("eslint-plugin-import", () => {
    const { expectExample } = formatJSON("eslintrc.json", plugin);

    it("https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-extraneous-dependencies.md", () =>
      expectExample({
        rules: {
          "import/no-extraneous-dependencies": [
            "error",
            {
              devDependencies: false,
              optionalDependencies: false,
              peerDependencies: false,
              bundledDependencies: false,
              includeInternal: true,
              includeTypes: true,
              packageDir: "./some-dir/",
            },
          ],
        },
      }));

    it("https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-unused-modules.md", () =>
      expectExample({
        rules: {
          "import/no-unused-modules": [
            "error",
            {
              missingExports: false,
              unusedExports: false,
              src: [],
              ignoreExports: [],
            },
          ],
        },
      }));

    it("https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-commonjs.md", () =>
      expectExample({
        rules: {
          "import/no-commonjs": [
            "error",
            { allowRequire: false, allowPrimitiveModules: false },
          ],
        },
      }));

    it("https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-cycle.md", () =>
      expectExample({
        rules: {
          "import/no-cycle": [
            "error",
            {
              maxDepth: 0,
              ignoreExternal: false,
              allowUnsafeDynamicCyclicDependency: false,
            },
          ],
        },
      }));

    it("https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-restricted-paths.md", () =>
      expectExample({
        rules: {
          "import/no-restricted-paths": [
            "error",
            {
              zones: [
                {
                  target: "./tests/files/restricted-paths/server/one",
                  from: "./tests/files/restricted-paths/server",
                  except: ["./one"],
                  message: "",
                },
              ],
            },
          ],
        },
      }));

    it("https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-unresolved.md", () =>
      expectExample({
        rules: {
          "import/no-unresolved": [
            "error",
            {
              commonjs: true,
              amd: true,
              ignore: ["\\.img$"],
              caseSensitive: true,
              caseSensitiveStrict: true,
            },
          ],
        },
      }));

    it("https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/max-dependencies.md", () =>
      expectExample({
        rules: {
          "import/max-dependencies": [
            "error",
            { max: 10, ignoreTypeImports: false },
          ],
        },
      }));

    it("https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/newline-after-import.md", () =>
      expectExample({
        rules: {
          "import/newline-after-import": [
            "error",
            { count: 2, considerComments: false },
          ],
        },
      }));

    it("https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-anonymous-default-export.md", () =>
      expectExample({
        rules: {
          "import/no-anonymous-default-export": [
            "error",
            {
              allowArray: false,
              allowArrowFunction: false,
              allowAnonymousClass: false,
              allowAnonymousFunction: false,
              allowCallExpression: true, // The true value here is for backward compatibility
              allowNew: false,
              allowLiteral: false,
              allowObject: false,
            },
          ],
        },
      }));

    it("https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md", () =>
      expectExample({
        rules: {
          "import/order": [
            "error",
            {
              "groups": [],
              "newlines-between": "always",
              "pathGroups": [
                {
                  pattern: "@app/**",
                  patternOptions: {},
                  group: "external",
                  position: "after",
                },
              ],
              "distinctGroup": false,
              "pathGroupsExcludedImportTypes": ["builtin"],
              "alphabetize": {
                order: "",
                orderImportKind: "",
                caseInsensitive: false,
              },
              "warnOnUnassignedImports": false,
            },
          ],
        },
      }));
  });

  describe("eslint-plugin-jest", () => {
    const { expectExample } = formatJSON("eslintrc.json", plugin);

    it("https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/expect-expect.md#options", () =>
      expectExample({
        rules: {
          "jest/expect-expect": [
            "error",
            {
              assertFunctionNames: ["expect"],
              additionalTestBlockFunctions: [],
            },
          ],
        },
      }));

    it("https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/no-large-snapshots.md#options", () =>
      expectExample({
        rules: {
          "jest/no-large-snapshots": [
            "warn",
            {
              maxSize: 12,
              inlineMaxSize: 6,
              allowedSnapshots: {
                "/path/to/file.js.snap": ["snapshot name 1"],
              },
            },
          ],
        },
      }));

    it("https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/prefer-expect-assertions.md#options", () =>
      expectExample({
        rules: {
          "jest/prefer-expect-assertions": [
            "warn",
            {
              onlyFunctionsWithAsyncKeyword: true,
              onlyFunctionsWithExpectInLoop: true,
              onlyFunctionsWithExpectInCallback: true,
            },
          ],
        },
      }));

    it("https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/prefer-lowercase-title.md#options", () =>
      expectExample({
        rules: {
          "jest/prefer-lowercase-title": [
            "error",
            {
              ignore: ["describe", "test"],
              allowedPrefixes: ["GET"],
              ignoreTopLevelDescribe: true,
            },
          ],
        },
      }));

    it("https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/valid-expect.md#options", () =>
      expectExample({
        rules: {
          "jest/valid-expect": [
            "error",
            {
              alwaysAwait: false,
              asyncMatchers: [],
              minArgs: 0,
              maxArgs: 0,
            },
          ],
        },
      }));

    it("https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/valid-title.md", () =>
      expectExample({
        rules: {
          "jest/valid-title": [
            "error",
            {
              ignoreTypeOfDescribeName: false,
              disallowedWords: [],
              mustNotMatch: {
                describe: "",
                test: "",
                it: "",
              },
              mustMatch: {
                describe: "",
                test: "",
                it: "",
              },
            },
          ],
        },
      }));
  });
});

describe.each([{ filename: ".eslintignore", format: formatIgnore }])(
  "%p",
  ({ filename, format }) => {
    const { defaultFormat, pluginFormat } = format(filename, plugin);

    it("sorts and uniqs", () =>
      expect(pluginFormat(["b", "a", "b"])).toStrictEqual(
        defaultFormat(["a", "b"])
      ));
  }
);
