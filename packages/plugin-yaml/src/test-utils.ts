import prettier, { type Plugin } from "prettier";
import { stringify as YAMLStringify } from "yaml";

export const formatYAML = (
  filename: string,
  plugin: Plugin,
  {
    parser = "yaml",
    stringify = (source) =>
      typeof source === "string" ? source : YAMLStringify(source),
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
