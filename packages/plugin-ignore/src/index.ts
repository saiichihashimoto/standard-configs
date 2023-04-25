import { doc } from "prettier";
import type { Plugin } from "prettier";

import { keyByType, plugin, processStack } from "@standard-configs/plugin";
import type { Stack } from "@standard-configs/plugin";

type Point = {
  column: number;
  line: number;
  offset: number;
};

type Position = {
  end: Point;
  start: Point;
};

type Base = {
  original: string;
  position: Position;
};

type IgnoreComment = Base & {
  type: "comment";
  value: string;
};

type IgnorePattern = Base & {
  type: "pattern";
  value: string;
};

type IgnoreFile = Base & {
  children: (IgnoreComment | IgnorePattern)[];
  comments?: IgnoreComment[];
  type: "file";
};

type IgnoreNode = IgnoreComment | IgnoreFile | IgnorePattern;

// TODO Split out into pure ignore plugin
export const pureIgnorePlugin: Plugin<IgnoreNode> = {
  languages: [
    {
      name: "IgnoreFile",
      since: "0.1.0",
      parsers: ["ignore"],
      extensions: [".*ignore"],
      filenames: [".*ignore"],
      vscodeLanguageIds: ["ignore"],
    },
  ],
  parsers: {
    ignore: {
      astFormat: "ignore",
      locStart: ({
        position: {
          start: { offset },
        },
      }) => offset,
      locEnd: ({
        position: {
          end: { offset },
        },
      }) => offset,
      parse: (text) => {
        const children = text.split("\n").map((line, index, lines) => {
          const offset = lines
            .slice(0, index)
            .map((line) => `${line}\n`)
            .join("").length;

          return {
            original: line + (index === lines.length - 1 ? "" : "\n"),
            ...(line.startsWith("#")
              ? { type: "comment" as const, value: line.slice(1).trimEnd() }
              : { type: "pattern" as const, value: line.trim() }),
            position: {
              start: { line: index + 1, column: 1, offset },
              end: {
                line: index + 1,
                column: 1 + line.length,
                offset: offset + line.length,
              },
            },
          };
        });

        return {
          children: children.filter(
            ({ type, original }) =>
              type !== "pattern" || !/^\s*$/.test(original)
          ),
          // TODO Attach comments to plugin-ignore natively
          // comments: children.filter(
          //   (node): node is IgnoreComment => node.type === "comment"
          // ),
          type: "file",
          original: text,
          position:
            children.length === 0
              ? {
                  start: { line: 1, column: 1, offset: 0 },
                  end: { line: 1, column: 1, offset: 0 },
                }
              : {
                  start: children[0]!.position.start,
                  end: children.at(-1)!.position.end,
                },
        };
      },
    },
  },
  printers: {
    ignore: {
      print: (astPath, options, print) => {
        const {
          builders: { hardline, join },
        } = doc;

        return (
          keyByType<IgnoreNode, doc.builders.Doc>({
            file: () => [
              join(hardline, astPath.map(print, "children")),
              hardline,
            ],
            comment: ({ value }) => ["#", value],
            pattern: ({ value }) => value,
          })(astPath.getNode() ?? undefined) ?? ""
        );
      },
    },
  },
};

const {
  languages,
  parsers = {},
  printers: { ignore: originalPrinter } = {},
} = pureIgnorePlugin;

type GetNodeValueReturn = string[] | string | undefined;

const getNodeValue: ReturnType<
  typeof keyByType<IgnoreNode, GetNodeValueReturn>
> = keyByType<IgnoreNode, GetNodeValueReturn>({
  file: ({ children }) => children.map((node) => getNodeValue(node) as string),
  pattern: ({ value }) => value,
});

type IgnoreStack = Stack<IgnoreNode>;

const getStackPath: ReturnType<typeof processStack<IgnoreNode, IgnoreStack>> =
  processStack<IgnoreNode, IgnoreStack>(["file", "pattern"], {
    file: ([, , , index, ...stack]) => [index, ...getStackPath(stack)],
  });

export const ignorePlugin = plugin<IgnoreNode>({
  getNodeValue,
  getStackPath,
  languages,
  parsers,
  astFormat: "ignore",
  originalPrinter: originalPrinter!,
  print: ({ node, overArrayElements }, astPath, options, print) => {
    const {
      builders: { hardline, join },
    } = doc;

    return keyByType<IgnoreNode, doc.builders.Doc>({
      file: ({ children }) => [
        join(
          hardline,
          overArrayElements({
            elements: children,
            docs: astPath.map(print, "children"),
          })
        ),
        hardline,
      ],
    })(node);
  },
});
