import { uniqBy } from "lodash/fp";
import { z } from "zod";

import {
  elementsZod,
  indexOf,
  nestConfig,
  sortAndUniqBy,
} from "@standard-configs/config";
import type { Config } from "@standard-configs/config";
import { jsonPlugin } from "@standard-configs/plugin-json";

export const compilerOptionsConfig: Config = {
  operations: [
    // https://www.typescriptlang.org/tsconfig#compilerOptions
    {
      path: /^$/,
      sortKeys: [
        indexOf([
          // https://www.typescriptlang.org/tsconfig#Projects_6255
          "incremental",
          "composite",
          "tsBuildInfoFile",
          "disableSourceOfProjectReferenceRedirect",
          "disableSolutionSearching",
          "disableReferencedProjectLoad",

          // https://www.typescriptlang.org/tsconfig#Language_and_Environment_6254
          "target",
          "lib",
          "jsx",
          "experimentalDecorators",
          "emitDecoratorMetadata",
          "jsxFactory",
          "jsxFragmentFactory",
          "jsxImportSource",
          "reactNamespace",
          "noLib",
          "useDefineForClassFields",
          "moduleDetection",

          // https://www.typescriptlang.org/tsconfig#Modules_6244
          "module",
          "rootDir",
          "moduleResolution",
          "baseUrl",
          "paths",
          "rootDirs",
          "typeRoots",
          "types",
          "allowUmdGlobalAccess",
          "moduleSuffixes",
          "allowImportingTsExtensions",
          "resolvePackageJsonExports",
          "resolvePackageJsonImports",
          "customConditions",
          "resolveJsonModule",
          "allowArbitraryExtensions",
          "noResolve",

          // https://www.typescriptlang.org/tsconfig#JavaScript_Support_6247
          "allowJs",
          "checkJs",
          "maxNodeModuleJsDepth",

          // https://www.typescriptlang.org/tsconfig#Emit_6246
          "declaration",
          "declarationMap",
          "emitDeclarationOnly",
          "sourceMap",
          "inlineSourceMap",
          "outFile",
          "outDir",
          "removeComments",
          "noEmit",
          "importHelpers",
          "importsNotUsedAsValues",
          "downlevelIteration",
          "sourceRoot",
          "mapRoot",
          "inlineSources",
          "emitBOM",
          "newLine",
          "stripInternal",
          "noEmitHelpers",
          "noEmitOnError",
          "preserveConstEnums",
          "declarationDir",
          "preserveValueImports",

          // https://www.typescriptlang.org/tsconfig#Interop_Constraints_6252
          "isolatedModules",
          "verbatimModuleSyntax",
          "allowSyntheticDefaultImports",
          "esModuleInterop",
          "preserveSymlinks",
          "forceConsistentCasingInFileNames",

          // https://www.typescriptlang.org/tsconfig#Type_Checking_6248
          "strict",
          "noImplicitAny",
          "strictNullChecks",
          "strictFunctionTypes",
          "strictBindCallApply",
          "strictPropertyInitialization",
          "noImplicitThis",
          "useUnknownInCatchVariables",
          "alwaysStrict",
          "noUnusedLocals",
          "noUnusedParameters",
          "exactOptionalPropertyTypes",
          "noImplicitReturns",
          "noFallthroughCasesInSwitch",
          "noUncheckedIndexedAccess",
          "noImplicitOverride",
          "noPropertyAccessFromIndexSignature",
          "allowUnusedLabels",
          "allowUnreachableCode",

          // https://www.typescriptlang.org/tsconfig#Completeness_6257
          "skipDefaultLibCheck",
          "skipLibCheck",

          // https://www.typescriptlang.org/tsconfig#Output_Formatting_6256
          "noErrorTruncation",
          "preserveWatchOutput",
          "pretty",

          // https://www.typescriptlang.org/tsconfig#Editor_Support_6249
          "disableSizeLimit",
          "plugins",

          // https://www.typescriptlang.org/tsconfig#Backwards_Compatibility_6253
          "charset",
          "keyofStringsOnly",
          "noImplicitUseStrict",
          "noStrictGenericChecks",
          "out",
          "suppressExcessPropertyErrors",
          "suppressImplicitAnyIndexErrors",

          // https://www.typescriptlang.org/tsconfig#Compiler_Diagnostics_6251
          "diagnostics",
          "explainFiles",
          "extendedDiagnostics",
          "generateCpuProfile",
          "listEmittedFiles",
          "listFiles",
          "traceResolution",

          // https://www.typescriptlang.org/tsconfig#Watch_and_Build_Modes_6250
          "assumeChangesOnlyAffectDirectDependencies",
        ]),
      ],
    },
    {
      path: /^moduleSuffixes|paths\..+|plugins|rootDirs$/,
      overElements: elementsZod(
        z.string(),
        uniqBy(({ value }) => value)
      ),
    },
    {
      path: /^typeRoots|types$/,
      overElements: elementsZod(
        z.string(),
        sortAndUniqBy(({ value }) => value)
      ),
    },
  ],
};

// https://www.typescriptlang.org/tsconfig
const tsconfigConfig: Config = {
  operations: [
    // https://www.typescriptlang.org/tsconfig#root-fields
    {
      path: /^$/,
      sortKeys: [
        indexOf([
          "extends",
          "compilerOptions",
          "files",
          "include",
          "exclude",
          "references",
          "watchOptions",
          "typeAcquisition",
        ]),
      ],
    },
    // https://www.typescriptlang.org/tsconfig#typeAcquisition
    {
      path: /^typeAcquisition$/,
      sortKeys: [
        indexOf([
          "enable",
          "include",
          "exclude",
          "disableFilenameBasedTypeAcquisition",
        ]),
      ],
    },
    // https://www.typescriptlang.org/tsconfig#watchOptions
    {
      path: /^watchOptions$/,
      sortKeys: [
        indexOf([
          "watchFile",
          "watchDirectory",
          "fallbackPolling",
          "synchronousWatchDirectory",
        ]),
      ],
    },
    {
      path: /^exclude|files|include|watchOptions\.(excludeDirectories|excludeFiles)|typeAcquisition\.(exclude|include)$/,
      overElements: elementsZod(
        z.string(),
        sortAndUniqBy(({ value }) => value)
      ),
    },
    ...nestConfig(/^compilerOptions$/, compilerOptionsConfig),
  ],
};

export const tsconfigJSONConfigs = {
  "jsconfig.json": tsconfigConfig,
  "tsconfig.json": tsconfigConfig,
};

export const { defaultOptions, languages, options, parsers, printers } =
  jsonPlugin(tsconfigJSONConfigs);
