import { flow, reject } from "lodash/fp";
import { z } from "zod";

import { elementsZod, sortAndUniqBy } from "@standard-configs/config";
import type { Config } from "@standard-configs/config";
import { ignorePlugin } from "@standard-configs/plugin-ignore";

const npmIgnoreConfig: Config = {
  parsers: ["sh"],
  operations: [
    {
      path: /^$/,
      overElements: elementsZod(
        z.string(),
        flow(
          sortAndUniqBy(({ value }) => value),
          reject(({ value }) =>
            [
              "._*",
              ".*.swp",
              ".DS_Store",
              ".git",
              ".gitignore",
              ".hg",
              ".lock-wscript",
              ".npmignore",
              ".npmrc",
              ".svn",
              ".wafpickle-*",
              "CHANGELOG",
              "config.gypi",
              "CVS",
              "LICENCE",
              "LICENSE",
              "npm-debug.log",
              "package.json",
              "README",
            ].includes(value)
          ),
          (testing) => testing
        )
      ),
    },
  ],
};

export const npmIgnoreConfigs = {
  ".npmignore": npmIgnoreConfig,
};

export const { defaultOptions, languages, options, parsers, printers } =
  ignorePlugin(npmIgnoreConfigs);
