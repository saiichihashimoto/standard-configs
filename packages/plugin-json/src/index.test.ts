import { sortBy } from "lodash/fp";
import { z } from "zod";

import { elementsZod } from "@configs/config";

import { jsonPlugin } from ".";
import { formatJSON } from "./test-utils";

const plugin = jsonPlugin({
  "<known>.json": {
    operations: [
      {
        path: /^bar$/,
        overElements: elementsZod(
          z.string(),
          sortBy(({ value }) => value)
        ),
      },
    ],
  },
});

describe.each([{ filename: "<unknown>.json", format: formatJSON }])(
  "%p",
  ({ filename, format }) => {
    const { defaultFormat, pluginFormat } = format(filename, plugin);

    it("leaves unknown configs alone", () =>
      expect(pluginFormat({ b: "foo", a: "bar" })).toStrictEqual(
        defaultFormat({ b: "foo", a: "bar" })
      ));
  }
);

describe.each([{ filename: "<known>.json", format: formatJSON }])(
  "%p",
  ({ filename, format }) => {
    const { defaultFormat, pluginFormat } = format(filename, plugin);

    it("{}", () => expect(pluginFormat({})).toStrictEqual(defaultFormat({})));

    it("sorts objects", () =>
      expect(pluginFormat({ b: "foo", a: "bar" })).toStrictEqual(
        defaultFormat({ a: "bar", b: "foo" })
      ));

    it("doesn't sort arrays", () =>
      expect(pluginFormat({ foo: ["b", "a"] })).toStrictEqual(
        defaultFormat({ foo: ["b", "a"] })
      ));

    it("can sort arrays", () =>
      expect(pluginFormat({ bar: ["b", "a"] })).toStrictEqual(
        defaultFormat({ bar: ["a", "b"] })
      ));

    it("sorts $schema before everything always", () =>
      expect(
        pluginFormat({ $a: "$a", $schema: "$schema", $z: "$z" })
      ).toStrictEqual(
        defaultFormat({ $schema: "$schema", $a: "$a", $z: "$z" })
      ));
  }
);
