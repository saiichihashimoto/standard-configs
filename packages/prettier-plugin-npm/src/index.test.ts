import { formatIgnore } from "@standard-configs/plugin-ignore/src/test-utils";

import * as plugin from ".";

describe.each([{ filename: ".npmignore", format: formatIgnore }])(
  "%p",
  ({ filename, format }) => {
    const { defaultFormat, pluginFormat } = format(filename, plugin);

    it("sorts and uniqs", () =>
      expect(pluginFormat(["b", "a", "b"])).toStrictEqual(
        defaultFormat(["a", "b"])
      ));

    it("excludes irrelevant paths", () =>
      expect(
        pluginFormat([
          ".*.swp",
          "._*",
          ".DS_Store",
          ".git",
          ".gitignore",
          ".hg",
          ".npmignore",
          ".npmrc",
          ".lock-wscript",
          ".svn",
          ".wafpickle-*",
          "config.gypi",
          "CVS",
          "npm-debug.log",
          "package.json",
          "README",
          "CHANGELOG",
          "LICENSE",
          "LICENCE",
        ])
      ).toStrictEqual(defaultFormat([""])));
  }
);
