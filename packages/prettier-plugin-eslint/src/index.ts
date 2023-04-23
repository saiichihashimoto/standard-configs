import { flow, map, negate, startsWith, toPairs, uniqBy } from "lodash/fp";
import { z } from "zod";

import {
  type Config,
  type Operation,
  elementsZod,
  indexOf,
  nestConfig,
  sortAndUniqBy,
} from "@configs/config";
import { mergePlugins } from "@configs/plugin";
import { ignorePlugin } from "@configs/plugin-ignore";
import { jsonPlugin } from "@configs/plugin-json";
import { yamlPlugin } from "@configs/plugin-yaml";
import { babelConfig } from "@configs/prettier-plugin-babel";

export const eslintIgnoreConfig: Config = {
  parsers: ["ignore"],
  operations: [
    {
      path: /^$/,
      overElements: elementsZod(
        z.string(),
        sortAndUniqBy(({ value }) => value)
      ),
    },
  ],
};

const configKeys = [
  "plugins",
  "extends",
  "processor",
  "parser",
  "parserOptions",
  "settings",
  "env",
  "globals",
  "rules",
];

const rootConfig: Config = {
  operations: [
    {
      path: /^$/,
      sortKeys: [
        indexOf((unmatched) => [
          "root",
          "noInlineConfig",
          "reportUnusedDisableDirectives",
          "ignorePatterns",
          ...configKeys,
          unmatched,
          "overrides",
        ]),
      ],
    },
    {
      path: /^overrides\[\d+]$/,
      sortKeys: [indexOf(["files", "excludedFiles", ...configKeys])],
    },
    {
      path: /^parserOptions$/,
      sortKeys: [
        indexOf([
          "requireConfigFile",
          "ecmaVersion",
          "sourceType",
          "allowImportExportEverywhere",
          "allowReserved",
          "ecmaFeatures",
          "babelOptions",
        ]),
      ],
    },
    {
      path: /^excludedFiles|files$/,
      overElements: elementsZod(
        z.string(),
        sortAndUniqBy(({ value }) => value)
      ),
    },
    {
      path: /^extends|plugins$/,
      overElements: elementsZod(
        z.string(),
        uniqBy(({ value }) => value)
      ),
    },
    {
      path: /^rules$/,
      sortKeys: [
        (ruleName) => {
          const split = ruleName.split("/");

          return split.length === 1 ? ["", ruleName] : split;
        },
      ],
    },
    {
      path: /^rules\.[^[\]]+(?:\[0])?$/,
      print: (val) =>
        typeof val === "number"
          ? { 0: '"off"', 1: '"warn"', 2: '"error"' }[val]
          : !Number.isNaN(Number(val))
          ? // FIXME using quotes isn't based on the input being a string, it's based on the parser, which we need to identify (somehow)
            { 0: "off", 1: "warn", 2: "error" }[Number(val)]
          : undefined,
    },
    ...flow(
      toPairs<Omit<Operation, "if" | "path">>,
      map(
        ([presetName, config]): Operation => ({
          path: /^rules\.([^[\]]+)\[\d+]$/,
          if: ({ match: [, match] }) => match === presetName,
          ...config,
        })
      )
    )({
      "accessor-pairs": {
        sortKeys: [
          indexOf(["setWithoutGet", "getWithoutSet", "enforceForClassMembers"]),
        ],
      },
      "array-bracket-newline": {
        sortKeys: [indexOf(["multiline", "minItems"])],
      },
      "array-bracket-spacing": {
        sortKeys: [
          indexOf(["singleValue", "objectsInArrays", "arraysInArrays"]),
        ],
      },
      "array-element-newline": {
        sortKeys: [indexOf(["multiline", "minItems"])],
      },
      "camelcase": {
        sortKeys: [
          indexOf([
            "properties",
            "ignoreDestructuring",
            "ignoreImports",
            "ignoreGlobals",
            "allow",
          ]),
        ],
      },
      "capitalized-comments": {
        sortKeys: [indexOf(["ignorePattern", "ignoreInlineComments"])],
      },
      "class-methods-use-this": {
        sortKeys: [indexOf(["exceptMethods", "enforceForClassFields"])],
      },
      "comma-dangle": {
        sortKeys: [
          indexOf(["arrays", "objects", "imports", "exports", "functions"]),
        ],
      },
      "comma-spacing": { sortKeys: [indexOf(["before", "after"])] },
      "generator-star-spacing": {
        sortKeys: [
          indexOf(["before", "after", "named", "anonymous", "method"]),
        ],
      },
      "id-length": {
        sortKeys: [
          indexOf([
            "min",
            "max",
            "properties",
            "exceptions",
            "exceptionPatterns",
          ]),
        ],
      },
      "id-match": {
        sortKeys: [
          indexOf([
            "properties",
            "classFields",
            "onlyDeclarations",
            "ignoreDestructuring",
          ]),
        ],
      },
      "keyword-spacing": {
        sortKeys: [indexOf(["before", "after", "overrides"])],
      },
      "lines-around-comment": {
        sortKeys: [
          indexOf([
            "beforeBlockComment",
            "afterBlockComment",
            "beforeLineComment",
            "afterLineComment",
            "allowBlockStart",
            "allowBlockEnd",
            "allowObjectStart",
            "allowObjectEnd",
            "allowArrayStart",
            "allowArrayEnd",
            "allowClassStart",
            "allowClassEnd",
            "applyDefaultIgnorePatterns",
            "ignorePattern",
            "afterHashbangComment",
          ]),
        ],
      },
      "line-comment-position": {
        sortKeys: [
          indexOf(["position", "ignorePattern", "applyDefaultIgnorePatterns"]),
        ],
      },
      "max-len": {
        sortKeys: [
          indexOf([
            "code",
            "tabWidth",
            "comments",
            "ignorePattern",
            "ignoreComments",
            "ignoreTrailingComments",
            "ignoreUrls",
            "ignoreStrings",
            "ignoreTemplateLiterals",
            "ignoreRegExpLiterals",
          ]),
        ],
      },
      "max-lines-per-function": {
        sortKeys: [indexOf(["max", "skipBlankLines", "skipComments", "IIFEs"])],
      },
      "new-cap": {
        sortKeys: [
          indexOf([
            "newIsCap",
            "capIsNew",
            "newIsCapExceptions",
            "newIsCapExceptionPattern",
            "capIsNewExceptions",
            "capIsNewExceptionPattern",
            "properties",
          ]),
        ],
      },
      "no-extra-parens": {
        sortKeys: [
          indexOf([
            "conditionalAssign",
            "returnAssign",
            "nestedBinaryExpressions",
            "ignoreJSX",
            "enforceForArrowConditionals",
            "enforceForSequenceExpressions",
            "enforceForNewInMemberExpressions",
            "enforceForFunctionPrototypeMethods",
            "allowParensAfterCommentPattern",
          ]),
        ],
      },
      "no-fallthrough": { sortKeys: [indexOf(["commentPattern"])] },
      "no-implicit-coercion": {
        sortKeys: [
          indexOf([
            "boolean",
            "number",
            "string",
            "disallowTemplateShorthand",
            "allow",
          ]),
        ],
      },
      "no-irregular-whitespace": { sortKeys: [indexOf(["skipStrings"])] },
      "no-magic-numbers": {
        sortKeys: [
          indexOf([
            "ignore",
            "ignoreArrayIndexes",
            "ignoreDefaultValues",
            "ignoreClassFieldInitialValues",
            "enforceConst",
            "detectObjects",
          ]),
        ],
      },
      "no-mixed-operators": {
        sortKeys: [indexOf(["groups", "allowSamePrecedence"])],
      },
      "no-multi-spaces": {
        sortKeys: [indexOf(["ignoreEOLComments", "exceptions"])],
      },
      "no-multiple-empty-lines": {
        sortKeys: [indexOf(["max", "maxEOF", "maxBOF"])],
      },
      "no-param-reassign": {
        sortKeys: [
          indexOf([
            "props",
            "ignorePropertyModificationsFor",
            "ignorePropertyModificationsForRegex",
          ]),
        ],
      },
      "no-restricted-imports": {
        sortKeys: [
          indexOf([
            "paths",
            "patterns",
            "name",
            "group",
            "caseSensitive",
            "importNames",
            "message",
          ]),
        ],
      },
      "no-restricted-exports": {
        sortKeys: [
          indexOf(["restrictedNamedExports", "restrictDefaultExports"]),
        ],
      },
      "no-restricted-properties": {
        sortKeys: [indexOf(["object", "property", "message"])],
      },
      "no-restricted-syntax": { sortKeys: [indexOf(["selector", "message"])] },
      "no-shadow": {
        sortKeys: [
          indexOf([
            "builtinGlobals",
            "hoist",
            "allow",
            "ignoreOnInitialization",
          ]),
        ],
      },
      "no-trailing-spaces": {
        sortKeys: [indexOf(["skipBlankLines", "ignoreComments"])],
      },
      "no-underscore-dangle": {
        sortKeys: [
          indexOf([
            "allow",
            "allowAfterThis",
            "allowAfterSuper",
            "allowAfterThisConstructor",
            "enforceInMethodNames",
            "enforceInClassFields",
            "allowInArrayDestructuring",
            "allowInObjectDestructuring",
            "allowFunctionParams",
          ]),
        ],
      },
      "no-unused-expressions": {
        sortKeys: [
          indexOf([
            "allowShortCircuit",
            "allowTernary",
            "allowTaggedTemplates",
            "enforceForJSX",
          ]),
        ],
      },
      "no-unused-vars": { sortKeys: [negate(startsWith("vars"))] },
      "no-use-before-define": {
        sortKeys: [
          indexOf(["functions", "classes", "variables", "allowNamedExports"]),
        ],
      },
      "no-useless-rename": {
        sortKeys: [
          indexOf(["ignoreDestructuring", "ignoreImport", "ignoreExport"]),
        ],
      },
      "no-warning-comments": {
        sortKeys: [indexOf(["terms", "location", "decoration"])],
      },
      "object-curly-newline": {
        sortKeys: [
          indexOf([
            "multiline",
            "minProperties",
            "consistent",
            "ObjectExpression",
            "ObjectPattern",
            "ImportDeclaration",
            "ExportDeclaration",
          ]),
        ],
      },
      "object-shorthand": {
        sortKeys: [
          indexOf([
            "avoidQuotes",
            "ignoreConstructors",
            "methodsIgnorePattern",
            "avoidExplicitReturnArrows",
          ]),
        ],
      },
      "one-var": { sortKeys: [indexOf(["var", "let", "const"])] },
      "padding-line-between-statements": {
        sortKeys: [indexOf(["blankLine", "prev", "next"])],
      },
      "prefer-destructuring": {
        sortKeys: [indexOf(["VariableDeclarator", "AssignmentExpression"])],
      },
      "quote-props": {
        sortKeys: [indexOf(["keywords", "unnecessary", "numbers"])],
      },
      "semi-spacing": { sortKeys: [indexOf(["before", "after"])] },
      "space-before-blocks": {
        sortKeys: [indexOf(["functions", "keywords", "classes"])],
      },
      "space-before-function-paren": {
        sortKeys: [indexOf(["anonymous", "named", "asyncArrow"])],
      },
      "space-unary-ops": {
        sortKeys: [indexOf(["words", "nonwords", "overrides"])],
      },
      "spaced-comment": {
        sortKeys: [indexOf(["line", "block", "markers", "exceptions"])],
      },
      "sort-imports": {
        sortKeys: [
          indexOf([
            "ignoreCase",
            "ignoreDeclarationSort",
            "ignoreMemberSort",
            "memberSyntaxSortOrder",
            "allowSeparatedGroups",
          ]),
        ],
      },
      "sort-keys": {
        sortKeys: [
          indexOf([
            "caseSensitive",
            "minKeys",
            "natural",
            "allowLineSeparatedGroups",
          ]),
        ],
      },
      "use-isnan": {
        sortKeys: [indexOf(["enforceForSwitchCase", "enforceForIndexOf"])],
      },
      "yield-star-spacing": { sortKeys: [indexOf(["before", "after"])] },
      "@typescript-eslint/ban-ts-comment": {
        sortKeys: [
          indexOf([
            "ts-expect-error",
            "ts-ignore",
            "ts-nocheck",
            "ts-check",
            "minimumDescriptionLength",
          ]),
        ],
      },
      "@typescript-eslint/ban-types": {
        sortKeys: [indexOf(["types", "extendDefaults"])],
      },
      "@typescript-eslint/comma-dangle": {
        sortKeys: [
          indexOf(["arrays", "objects", "imports", "exports", "functions"]),
        ],
      },
      "@typescript-eslint/comma-spacing": {
        sortKeys: [indexOf(["before", "after"])],
      },
      "@typescript-eslint/consistent-type-imports": {
        sortKeys: [indexOf(["prefer", "disallowTypeAnnotations", "fixStyle"])],
      },
      "@typescript-eslint/dot-notation": {
        sortKeys: [
          indexOf([
            "allowKeywords",
            "allowPattern",
            "allowPrivateClassPropertyAccess",
            "allowProtectedClassPropertyAccess",
            "allowIndexSignaturePropertyAccess",
          ]),
        ],
      },
      "@typescript-eslint/explicit-function-return-type": {
        sortKeys: [
          indexOf([
            "allowExpressions",
            "allowTypedFunctionExpressions",
            "allowHigherOrderFunctions",
            "allowDirectConstAssertionInArrowFunctions",
            "allowConciseArrowFunctionExpressionsStartingWithVoid",
            "allowFunctionsWithoutTypeParameters",
            "allowedNames",
            "allowIIFEs",
          ]),
        ],
      },
      "@typescript-eslint/explicit-module-boundary-types": {
        sortKeys: [
          indexOf([
            "allowArgumentsExplicitlyTypedAsAny",
            "allowDirectConstAssertionInArrowFunctions",
            "allowedNames",
            "allowHigherOrderFunctions",
            "allowTypedFunctionExpressions",
          ]),
        ],
      },
      "@typescript-eslint/keyword-spacing": {
        sortKeys: [indexOf(["before", "after", "overrides"])],
      },
      "@typescript-eslint/member-delimiter-style": {
        sortKeys: [
          indexOf([
            "multiline",
            "singleline",
            "multilineDetection",
            "overrides",
          ]),
        ],
      },
      "@typescript-eslint/member-ordering": {
        sortKeys: [
          indexOf([
            "default",
            "classes",
            "classExpressions",
            "interfaces",
            "typeLiterals",
          ]),
        ],
      },
      "@typescript-eslint/naming-convention": {
        sortKeys: [
          indexOf([
            "selector",
            "modifiers",
            "types",
            "format",
            "filter",
            "prefix",
            "custom",
            "leadingUnderscore",
            "trailingUnderscore",
          ]),
        ],
      },
      "@typescript-eslint/no-extra-parens": {
        sortKeys: [
          indexOf([
            "conditionalAssign",
            "returnAssign",
            "nestedBinaryExpressions",
            "ignoreJSX",
            "enforceForArrowConditionals",
            "enforceForSequenceExpressions",
            "enforceForNewInMemberExpressions",
            "enforceForFunctionPrototypeMethods",
            "allowParensAfterCommentPattern",
          ]),
        ],
      },
      "@typescript-eslint/no-floating-promises": {
        sortKeys: [indexOf(["ignoreVoid", "ignoreIIFE"])],
      },
      "@typescript-eslint/no-invalid-void-type": {
        sortKeys: [
          indexOf(["allowInGenericTypeArguments", "allowAsThisParameter"]),
        ],
      },
      "@typescript-eslint/no-magic-numbers": {
        sortKeys: [
          indexOf([
            "ignore",
            "ignoreArrayIndexes",
            "ignoreDefaultValues",
            "ignoreClassFieldInitialValues",
            "enforceConst",
            "detectObjects",
          ]),
        ],
      },
      "@typescript-eslint/no-misused-promises": {
        sortKeys: [
          indexOf(["checksConditionals", "checksVoidReturn", "checksSpreads"]),
        ],
      },
      "@typescript-eslint/no-restricted-imports": {
        sortKeys: [
          indexOf([
            "paths",
            "patterns",
            "name",
            "group",
            "caseSensitive",
            "importNames",
            "message",
          ]),
        ],
      },
      "@typescript-eslint/no-shadow": {
        sortKeys: [
          indexOf([
            "builtinGlobals",
            "hoist",
            "allow",
            "ignoreOnInitialization",
            "ignoreTypeValueShadow",
            "ignoreFunctionTypeParameterNameValueShadow",
          ]),
        ],
      },
      "@typescript-eslint/no-type-alias": {
        sortKeys: [
          indexOf([
            "allowAliases",
            "allowCallbacks",
            "allowConditionalTypes",
            "allowConstructors",
            "allowLiterals",
            "allowMappedTypes",
            "allowTupleTypes",
            "allowGenerics",
          ]),
        ],
      },
      "@typescript-eslint/no-unnecessary-boolean-literal-compare": {
        sortKeys: [
          indexOf([
            "allowComparingNullableBooleansToTrue",
            "allowComparingNullableBooleansToFalse",
          ]),
        ],
      },
      "@typescript-eslint/no-unused-expressions": {
        sortKeys: [
          indexOf([
            "allowShortCircuit",
            "allowTernary",
            "allowTaggedTemplates",
            "enforceForJSX",
          ]),
        ],
      },
      "@typescript-eslint/no-unused-vars": {
        sortKeys: [negate(startsWith("vars"))],
      },
      "@typescript-eslint/no-use-before-define": {
        sortKeys: [
          indexOf([
            "functions",
            "classes",
            "variables",
            "allowNamedExports",
            "enums",
            "typedefs",
            "ignoreTypeReferences",
          ]),
        ],
      },
      "@typescript-eslint/padding-line-between-statements": {
        sortKeys: [indexOf(["blankLine", "prev", "next"])],
      },
      "@typescript-eslint/prefer-nullish-coalescing": {
        sortKeys: [
          indexOf([
            "ignoreConditionalTests",
            "ignoreTernaryTests",
            "ignoreMixedLogicalExpressions",
            "allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing",
          ]),
        ],
      },
      "@typescript-eslint/restrict-plus-operands": {
        sortKeys: [indexOf(["checkCompoundAssignments", "allowAny"])],
      },
      "@typescript-eslint/restrict-template-expressions": {
        sortKeys: [
          indexOf([
            "allowNumber",
            "allowBoolean",
            "allowAny",
            "allowNullish",
            "allowRegExp",
          ]),
        ],
      },
      "@typescript-eslint/strict-boolean-expressions": {
        sortKeys: [
          indexOf([
            "allowString",
            "allowNumber",
            "allowNullableObject",
            "allowNullableBoolean",
            "allowNullableString",
            "allowNullableNumber",
            "allowNullableEnum",
            "allowAny",
            "allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing",
          ]),
        ],
      },
      "@typescript-eslint/space-before-blocks": {
        sortKeys: [indexOf(["functions", "keywords", "classes"])],
      },
      "@typescript-eslint/space-before-function-paren": {
        sortKeys: [indexOf(["anonymous", "named", "asyncArrow"])],
      },
      "@typescript-eslint/type-annotation-spacing": {
        sortKeys: [indexOf(["before", "after", "overrides"])],
      },
      "import/max-dependencies": {
        sortKeys: [indexOf(["max", "ignoreTypeImports"])],
      },
      "import/newline-after-import": {
        sortKeys: [indexOf(["count", "considerComments"])],
      },
      "import/no-anonymous-default-export": {
        sortKeys: [
          indexOf([
            "allowArray",
            "allowArrowFunction",
            "allowAnonymousClass",
            "allowAnonymousFunction",
            "allowCallExpression",
            "allowNew",
            "allowLiteral",
            "allowObject",
          ]),
        ],
      },
      "import/no-commonjs": {
        sortKeys: [indexOf(["allowRequire", "allowPrimitiveModules"])],
      },
      "import/no-cycle": {
        sortKeys: [
          indexOf([
            "maxDepth",
            "ignoreExternal",
            "allowUnsafeDynamicCyclicDependency",
          ]),
        ],
      },
      "import/no-extraneous-dependencies": {
        sortKeys: [
          indexOf([
            "devDependencies",
            "optionalDependencies",
            "peerDependencies",
            "bundledDependencies",
            "includeInternal",
            "includeTypes",
            "packageDir",
          ]),
        ],
      },
      "import/no-unresolved": {
        sortKeys: [
          indexOf([
            "commonjs",
            "amd",
            "ignore",
            "caseSensitive",
            "caseSensitiveStrict",
          ]),
        ],
      },
      "import/no-unused-modules": {
        sortKeys: [
          indexOf(["missingExports", "unusedExports", "src", "ignoreExports"]),
        ],
      },
      "import/order": {
        sortKeys: [
          indexOf([
            "groups",
            "newlines-between",
            "pathGroups",
            "distinctGroup",
            "pathGroupsExcludedImportTypes",
            "alphabetize",
            "warnOnUnassignedImports",
          ]),
        ],
      },
      "jest/expect-expect": {
        sortKeys: [
          indexOf(["assertFunctionNames", "additionalTestBlockFunctions"]),
        ],
      },
      "jest/no-large-snapshots": {
        sortKeys: [indexOf(["maxSize", "inlineMaxSize", "allowedSnapshots"])],
      },
      "jest/prefer-expect-assertions": {
        sortKeys: [
          indexOf([
            "onlyFunctionsWithAsyncKeyword",
            "onlyFunctionsWithExpectInLoop",
            "onlyFunctionsWithExpectInCallback",
          ]),
        ],
      },
      "jest/prefer-lowercase-title": {
        sortKeys: [
          indexOf(["ignore", "allowedPrefixes", "ignoreTopLevelDescribe"]),
        ],
      },
      "jest/valid-expect": {
        sortKeys: [
          indexOf(["alwaysAwait", "asyncMatchers", "minArgs", "maxArgs"]),
        ],
      },
      "jest/valid-title": {
        sortKeys: [
          indexOf([
            "ignoreTypeOfDescribeName",
            "disallowedWords",
            "mustNotMatch",
            "mustMatch",
          ]),
        ],
      },
    }),
    // For nested objects
    ...flow(
      toPairs<Omit<Operation, "if" | "path">>,
      map(
        ([presetName, config]): Operation => ({
          path: /^rules\.([^[\]]+)\[\d+]\.[^.]+$/,
          if: ({ match: [, match] }) => match === presetName,
          ...config,
        })
      )
    )({
      "array-element-newline": {
        sortKeys: [indexOf(["multiline", "minItems"])],
      },
      "generator-star-spacing": { sortKeys: [indexOf(["before", "after"])] },
      "object-curly-newline": {
        sortKeys: [indexOf(["multiline", "minProperties", "consistent"])],
      },
      "spaced-comment": {
        sortKeys: [indexOf(["markers", "exceptions", "balanced"])],
      },
    }),
    {
      path: /^rules\.([^[\]]+)\[\d+]\.exceptions$/,
      if: ({ match: [, match] }) => match === "comma-style",
      sortKeys: [
        indexOf([
          "ArrayExpression",
          "ArrayPattern",
          "ArrowFunctionExpression",
          "CallExpression",
          "FunctionDeclaration",
          "FunctionExpression",
          "ImportDeclaration",
          "ObjectExpression",
          "ObjectPattern",
          "VariableDeclaration",
          "NewExpression",
        ]),
      ],
    },
    {
      path: /^rules\.(?:@typescript-eslint\/)?([^[\]]+)\[\d+]\.overrides$/,
      if: ({ match: [, match] }) => match === "keyword-spacing",
      sortKeys: [indexOf(["if", "for", "while", "static", "as"])],
    },
    {
      path: /^rules\.(?:@typescript-eslint\/)?([^[\]]+)\[\d+]\.overrides\.[^.]+$/,
      if: ({ match: [, match] }) => match === "keyword-spacing",
      sortKeys: [indexOf(["before", "after"])],
    },
    {
      path: /^rules\.([^[\]]+)\[\d+]\.exceptions$/,
      if: ({ match: [, match] }) => match === "no-multi-spaces",
      sortKeys: [
        indexOf([
          "Property",
          "BinaryExpression",
          "VariableDeclarator",
          "ImportDeclaration",
        ]),
      ],
    },
    {
      path: /^rules\.([^[\]]+)\[\d+]\.restrictDefaultExports$/,
      if: ({ match: [, match] }) => match === "no-restricted-exports",
      sortKeys: [
        indexOf([
          "direct",
          "named",
          "defaultFrom",
          "namedFrom",
          "namespaceFrom",
        ]),
      ],
    },
    {
      path: /^rules\.(?:@typescript-eslint\/)?([^[\]]+)\[\d+]\.(?:paths|patterns)\[\d+]$/,
      if: ({ match: [, match] }) => match === "no-restricted-imports",
      sortKeys: [
        indexOf([
          "paths",
          "patterns",
          "name",
          "group",
          "caseSensitive",
          "importNames",
          "message",
          "allowTypeImports",
        ]),
      ],
    },
    {
      path: /^rules\.([^[\]]+)\[\d+]\.overrides$/,
      if: ({ match: [, match] }) => match === "space-unary-ops",
      sortKeys: [indexOf(["new", "++"])],
    },
    {
      path: /^rules\.([^[\]]+)\[\d+]\.types\.[^.]+$/,
      if: ({ match: [, match] }) => match === "@typescript-eslint/ban-types",
      sortKeys: [indexOf(["message", "fixWith"])],
    },
    {
      path: /^rules\.([^[\]]+)\[\d+]\.overrides$/,
      if: ({ match: [, match] }) =>
        match === "@typescript-eslint/explicit-member-accessibility",
      sortKeys: [
        indexOf([
          "accessors",
          "constructors",
          "methods",
          "properties",
          "parameterProperties",
        ]),
      ],
    },
    {
      path: /^rules\.([^[\]]+)\[\d+]\.(?:custom|filter)$/,
      if: ({ match: [, match] }) =>
        match === "@typescript-eslint/naming-convention",
      sortKeys: [indexOf(["regex", "match"])],
    },
    {
      path: /^rules\.([^[\]]+)\[\d+]\.overrides$/,
      if: ({ match: [, match] }) =>
        match === "@typescript-eslint/type-annotation-spacing",
      sortKeys: [
        indexOf([
          "colon",
          "arrow",
          "variable",
          "parameter",
          "property",
          "returnType",
        ]),
      ],
    },
    {
      path: /^rules\.([^[\]]+)\[\d+]\.overrides\.[^.]+$/,
      if: ({ match: [, match] }) =>
        match === "@typescript-eslint/type-annotation-spacing",
      sortKeys: [indexOf(["before", "after"])],
    },
    {
      path: /^rules\.([^[\]]+)\[\d+]\.zones\[\d+]$/,
      if: ({ match: [, match] }) => match === "import/no-restricted-paths",
      sortKeys: [indexOf(["target", "from", "except", "message"])],
    },
    {
      path: /^rules\.([^[\]]+)\[\d+]\.alphabetize$/,
      if: ({ match: [, match] }) => match === "import/order",
      sortKeys: [indexOf(["order", "orderImportKind", "caseInsensitive"])],
    },
    {
      path: /^rules\.([^[\]]+)\[\d+]\.pathGroups\[\d+]$/,
      if: ({ match: [, match] }) => match === "import/order",
      sortKeys: [indexOf(["pattern", "patternOptions", "group", "position"])],
    },
    {
      path: /^rules\.([^[\]]+)\[\d+]\.(?:mustMatch|mustNotMatch)$/,
      if: ({ match: [, match] }) => match === "jest/valid-title",
      sortKeys: [indexOf(["describe", "test", "it"])],
    },
    ...nestConfig(/^ignorePatterns$/, eslintIgnoreConfig),
    ...nestConfig(/^parserOptions\.babelOptions$/, babelConfig),
  ],
};

export const eslintConfig: Config = {
  operations: [
    ...nestConfig(/^$/, rootConfig),
    ...nestConfig(/^overrides\[\d+](?:\.overrides\[\d+]\.)*$/, rootConfig),
  ],
};

export const eslintIgnoreConfigs = {
  ".eslintignore": eslintIgnoreConfig,
};

export const eslintJSONConfigs = {
  ".eslintrc.json": eslintConfig,
  ".eslintrc": eslintConfig,
};

export const eslintYAMLConfigs = {
  ".eslintrc.yaml": eslintConfig,
  ".eslintrc.yml": eslintConfig,
};

export const { defaultOptions, languages, options, parsers, printers } =
  mergePlugins(
    ignorePlugin(eslintIgnoreConfigs),
    jsonPlugin(eslintJSONConfigs),
    yamlPlugin(eslintYAMLConfigs)
  );
