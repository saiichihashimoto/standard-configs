import { sortBy } from "lodash/fp";
import { z } from "zod";

import { elementsZod } from "@standard-configs/config";

import { yamlPlugin } from ".";
import { formatYAML } from "./test-utils";

const config = {
  operations: [
    {
      path: /^bar$/,
      overElements: elementsZod(
        z.string(),
        sortBy(({ value }) => value)
      ),
    },
  ],
};

const plugin = yamlPlugin({ "<known>.yaml": config, "<known>.yml": config });

describe.each([
  { filename: "<unknown>.yaml", format: formatYAML },
  { filename: "<unknown>.yml", format: formatYAML },
])("%p", ({ filename, format }) => {
  const { defaultFormat, pluginFormat } = format(filename, plugin);

  it("leaves unknown configs alone", () =>
    expect(pluginFormat({ b: "foo", a: "bar" })).toStrictEqual(
      defaultFormat({ b: "foo", a: "bar" })
    ));
});

describe.each([
  { filename: "<known>.yaml", format: formatYAML },
  { filename: "<known>.yml", format: formatYAML },
])("%p", ({ filename, format }) => {
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
});
