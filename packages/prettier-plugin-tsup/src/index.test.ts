import { formatJSON } from "@configs/plugin-json/src/test-utils";

import * as plugin from ".";

describe.each([{ filename: "tsup.config.json", format: formatJSON }])(
  "%p",
  ({ filename, format }) => {
    const { defaultFormat, expectExample, pluginFormat } = format(
      filename,
      plugin
    );

    it("https://paka.dev/npm/tsup@6.5.0/api#b8e1e4d7c1b998d9", () =>
      expectExample({
        name: "",
        entryPoints: [],
        entry: [],
        legacyOutput: false,
        target: "",
        minify: false,
        minifyWhitespace: false,
        minifyIdentifiers: false,
        minifySyntax: false,
        keepNames: false,
        watch: "",
        ignoreWatch: "",
        onSuccess: "",
        jsxFactory: "",
        jsxFragment: "",
        outDir: "",
        outExtension: null,
        format: [],
        globalName: "",
        env: {},
        define: {},
        dts: {
          entry: "",
          resolve: false,
          only: false,
          banner: "",
          footer: "",
          compilerOptions: {},
        },
        sourcemap: false,
        noExternal: [],
        external: [],
        replaceNodeEnv: false,
        splitting: false,
        clean: false,
        esbuildPlugins: [
          {
            name: "",
            setup: "",
          },
        ],
        esbuildOptions: "",
        silent: false,
        skipNodeModulesBundle: false,
        pure: "",
        bundle: false,
        inject: "",
        metafile: false,
        footer: {
          js: "",
          css: "",
        },
        banner: {
          js: "",
          css: "",
        },
        platform: "",
        loader: {},
        config: "",
        tsconfig: "",
        injectStyle: false,
        shims: false,
        plugins: [
          {
            name: "",
            esbuildOptions: "",
            buildStart: "",
            renderChunk: "",
            buildEnd: "",
          },
        ],
        treeshake: {
          annotations: false,
          correctVarValueBeforeDeclaration: false,
          manualPureFunctions: [],
          moduleSideEffects: "",
          preset: "",
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false,
          unknownGlobalSideEffects: false,
        },
        publicDir: "",
      }));

    it("sorts dts.compilerOptions by tsconfig", () =>
      expect(
        pluginFormat({
          dts: { compilerOptions: { composite: false, incremental: false } },
        })
      ).toStrictEqual(
        defaultFormat({
          dts: { compilerOptions: { incremental: false, composite: false } },
        })
      ));

    it("sorts and uniqs some arrays", () =>
      expect(
        pluginFormat({
          entry: ["b", "a", "b"],
          target: ["b", "a", "b"],
          watch: ["b", "a", "b"],
          ignoreWatch: ["b", "a", "b"],
          format: ["b", "a", "b"],
          noExternal: ["b", "a", "b"],
          external: ["b", "a", "b"],
          clean: ["b", "a", "b"],
          pure: ["b", "a", "b"],
          inject: ["b", "a", "b"],
        })
      ).toStrictEqual(
        defaultFormat({
          entry: ["a", "b"],
          target: ["a", "b"],
          watch: ["a", "b"],
          ignoreWatch: ["a", "b"],
          format: ["a", "b"],
          noExternal: ["a", "b"],
          external: ["a", "b"],
          clean: ["a", "b"],
          pure: ["a", "b"],
          inject: ["a", "b"],
        })
      ));
  }
);
