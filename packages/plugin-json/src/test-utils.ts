import prettier from "prettier";
import type { Options, Plugin } from "prettier";

const commonOptions = ({ filename }: { filename: string }): Options => ({
  filepath: `/some/file/path/${filename}`,
  pluginSearchDirs: false,
  // The error diffs are very nice when everything attempts to print on it's own line
  printWidth: 1,
});

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
      ...commonOptions({ filename }),
      parser,
      plugins: [],
    }),
  pluginFormat: (source: unknown) =>
    prettier.format(stringify(source), {
      ...commonOptions({ filename }),
      plugins: [plugin],
    }),
  expectExample: (source: unknown, defaultSource = source) =>
    expect(
      prettier.format(stringify(source), {
        ...commonOptions({ filename }),
        plugins: [plugin],
      })
    ).toStrictEqual(
      prettier.format(stringify(defaultSource), {
        ...commonOptions({ filename }),
        parser,
        plugins: [],
      })
    ),
});
