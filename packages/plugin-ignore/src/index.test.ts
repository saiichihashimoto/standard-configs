import { filter, flow } from "lodash/fp";
import { z } from "zod";

import { elementsZod, sortAndUniqBy } from "@standard-configs/config";

import { ignorePlugin } from ".";
import { formatIgnore } from "./test-utils";

const plugin = ignorePlugin({
  ".knownignore": {
    parsers: ["ignore"],
    operations: [
      {
        path: /^$/,
        overElements: elementsZod(
          z.string(),
          flow(
            filter(({ value }) => value.length > 0),
            sortAndUniqBy(({ value }) => value)
          )
        ),
      },
    ],
  },
});

describe.each([{ filename: ".unknownignore", format: formatIgnore }])(
  "%p",
  ({ filename, format }) => {
    const { defaultFormat, pluginFormat } = format(filename, plugin, {
      parser: "ignore",
    });

    it("leaves unknown configs alone", () =>
      expect(pluginFormat(["b", "a", "b"])).toStrictEqual(
        defaultFormat(["b", "a", "b"])
      ));
  }
);

describe.each([{ filename: ".knownignore", format: formatIgnore }])(
  "%p",
  ({ filename, format }) => {
    const { defaultFormat, pluginFormat } = format(filename, plugin);

    it("[]", () => expect(pluginFormat([])).toStrictEqual(defaultFormat([])));

    it("applies config", () =>
      expect(pluginFormat(["b", "a", "b"])).toStrictEqual(
        defaultFormat(["a", "b"])
      ));

    it("removes whitespace", () =>
      expect(pluginFormat("\n\na\n\nb\n\n")).toStrictEqual(
        defaultFormat(["a", "b"])
      ));
  }
);
