import prettier from "prettier";
import type { Plugin } from "prettier";

export const formatJSON = (
  filename: string,
  plugin: Plugin,
  {
    parser = "json-stringify",
    stringify = (source) =>
      typeof source === "string" ? source : JSON.stringify(source),
  }: {
    parser?: string;
    stringify?: (source: unknown) => string;
  } = {}
) => ({
  defaultFormat: (source: unknown) =>
    prettier.format(stringify(source), {
      parser,
      filepath: `/some/file/path/${filename}`,
      pluginSearchDirs: false,
      plugins: [],
    }),
  pluginFormat: (source: unknown) =>
    prettier.format(stringify(source), {
      filepath: `/some/file/path/${filename}`,
      pluginSearchDirs: false,
      plugins: [plugin],
    }),
  expectExample: (source: unknown, defaultSource = source) =>
    expect(
      prettier.format(stringify(source), {
        filepath: `/some/file/path/${filename}`,
        pluginSearchDirs: false,
        plugins: [plugin],
      })
    ).toStrictEqual(
      prettier.format(stringify(defaultSource), {
        parser,
        filepath: `/some/file/path/${filename}`,
        pluginSearchDirs: false,
        plugins: [],
      })
    ),
});
