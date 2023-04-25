import prettier from "prettier";
import type { Plugin } from "prettier";

export const formatIgnore = (
  filename: string,
  plugin: Plugin,
  {
    parser,
    stringify = (source) =>
      typeof source === "string"
        ? source
        : (source as string[]).map((line) => `${line.trimEnd()}\n`).join(""),
  }: {
    parser?: string;
    stringify?: (source: unknown) => string;
  } = {}
) => ({
  defaultFormat: (source: unknown) => stringify(source),
  pluginFormat: (source: unknown) =>
    prettier.format(stringify(source), {
      ...(!parser ? {} : { parser }),
      filepath: `/some/file/path/${filename}`,
      pluginSearchDirs: false,
      plugins: [plugin],
    }),
  expectExample: (source: unknown, defaultSource = source) =>
    expect(
      prettier.format(stringify(source), {
        ...(!parser ? {} : { parser }),
        filepath: `/some/file/path/${filename}`,
        pluginSearchDirs: false,
        plugins: [plugin],
      })
    ).toStrictEqual(stringify(defaultSource)),
});
