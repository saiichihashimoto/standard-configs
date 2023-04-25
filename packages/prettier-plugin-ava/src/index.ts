import { indexOf, nestConfig } from "@standard-configs/config";
import type { Config } from "@standard-configs/config";
import { jsonPlugin } from "@standard-configs/plugin-json";
import { babelConfig } from "@standard-configs/prettier-plugin-babel";

export const avaConfig: Config = {
  operations: [
    {
      path: /^$/,
      sortKeys: [
        indexOf([
          "files",
          "ignoredByWatcher",
          "match",
          "cache",
          "concurrency",
          "workerThreads",
          "failFast",
          "failWithoutAssertions",
          "environmentVariables",
          "tap",
          "verbose",
          "snapshotDir",
          "extensions",
          "require",
          "timeout",
          "nodeArguments",
          "sortTestFiles",
          "utilizeParallelBuilds",
          "nonSemVerExperiments",
        ]),
      ],
    },
    {
      path: /^typescript$/,
      sortKeys: [indexOf(["extensions", "rewritePaths", "compile"])],
    },
    ...nestConfig(/^babel\.testOptions$/, babelConfig),
  ],
};

const avaJSONConfigs = {
  // https://github.com/avajs/ava/issues/520
  "THERE-IS-NO-AVA-JSON-CONFIG": { ...avaConfig, parsers: ["json"] },
};

export const { defaultOptions, languages, options, parsers, printers } =
  jsonPlugin(avaJSONConfigs);
