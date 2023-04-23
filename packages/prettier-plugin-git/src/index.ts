import { z } from "zod";

import { type Config, elementsZod, sortAndUniqBy } from "@configs/config";
import { ignorePlugin } from "@configs/plugin-ignore";

const gitIgnoreConfig: Config = {
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

export const gitIgnoreConfigs = {
  ".gitignore": gitIgnoreConfig,
  "git/exclude": gitIgnoreConfig,
  "git/ignore": gitIgnoreConfig,
};

export const { defaultOptions, languages, options, parsers, printers } =
  ignorePlugin(gitIgnoreConfigs);
