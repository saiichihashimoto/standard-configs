import { flow, fromPairs, map, pick } from "lodash/fp";
import { doc } from "prettier";
import { parsers } from "prettier/parser-yaml";
// eslint-disable-next-line import/no-extraneous-dependencies -- Use prettier's version
import {
  type Document,
  type FlowMappingItem,
  type FlowSequenceItem,
  type MappingItem,
  type MappingValue,
  type SequenceItem,
  type YamlUnistNode,
} from "yaml-unist-parser";

import {
  type Stack,
  keyByType,
  plugin,
  processStack,
} from "@standard-configs/plugin";

import * as originalPrinter from "./printer-yaml";
import { injectablePrint } from "./printer-yaml";

type GetNodeValueReturn =
  | GetNodeValueReturn[]
  | string
  | readonly GetNodeValueReturn[]
  | undefined;

const getNodeValue: ReturnType<
  typeof keyByType<YamlUnistNode, GetNodeValueReturn>
> = keyByType<YamlUnistNode, GetNodeValueReturn>({
  root: ({ children }) => children.map((doc) => getNodeValue(doc)),
  document: ({ children }) => getNodeValue(children[1]),
  documentBody: ({ children }) => getNodeValue(children[0]),
  mapping: flow(
    ({ children }) => children,
    map((item) => getNodeValue(item)),
    fromPairs
  ),
  mappingItem: ({ children: [key, value] }) =>
    [getNodeValue(key.children[0]), getNodeValue(value.children[0])] as const,
  mappingValue: ({ children: [value] }) => getNodeValue(value),
  sequence: ({ children }) => children.map((item) => getNodeValue(item)),
  sequenceItem: ({ children }) => getNodeValue(children[0]),
  flowMapping: ({ children }) => children.map((item) => getNodeValue(item)),
  flowMappingItem: ({ children: [key, value] }) =>
    [getNodeValue(key.children[0]), getNodeValue(value.children[0])] as const,
  flowSequence: ({ children }) => children.map((item) => getNodeValue(item)),
  flowSequenceItem: ({ children }) => getNodeValue(children[0]),
  alias: ({ value }) => value,
  anchor: ({ value }) => value,
  blockFolded: ({ value }) => value,
  blockLiteral: ({ value }) => value,
  comment: ({ value }) => value,
  plain: ({ value }) => value,
  quoteDouble: ({ value }) => value,
  quoteSingle: ({ value }) => value,
  tag: ({ value }) => value,
});

type YAMLStackBefore = Stack<YamlUnistNode, "_parent">;

type YAMLStack =
  | Exclude<
      YAMLStackBefore,
      | [Document, "children", ...unknown[]]
      | [FlowMappingItem, "children", ...unknown[]]
      | [FlowSequenceItem, "children", ...unknown[]]
      | [MappingItem, "children", ...unknown[]]
      | [MappingItem, "children", ...unknown[]]
      | [MappingValue, "children", ...unknown[]]
      | [SequenceItem, "children", ...unknown[]]
    >
  | [Document, "body", YamlUnistNode]
  | [FlowMappingItem, "key", YamlUnistNode]
  | [FlowMappingItem, "value", YamlUnistNode]
  | [FlowSequenceItem, "content", YamlUnistNode]
  | [MappingItem, "key", YamlUnistNode]
  | [MappingItem, "value", YamlUnistNode]
  | [MappingValue, "content", YamlUnistNode]
  | [SequenceItem, "content", YamlUnistNode];

const getStackPath: ReturnType<typeof processStack<YamlUnistNode, YAMLStack>> =
  processStack<YamlUnistNode, YAMLStack>(
    [
      "alias",
      "blockFolded",
      "blockLiteral",
      "flowMapping",
      "flowSequence",
      "mapping",
      "plain",
      "quoteDouble",
      "quoteSingle",
      "sequence",
    ],
    {
      root: ([, field, , , ...stack]) =>
        field !== "children" ? [null] : getStackPath(stack),
      document: ([, field, ...stack]) =>
        field !== "body" ? [null] : getStackPath(stack),
      documentHead: () => [null],
      documentBody: ([, field, , , ...stack]) =>
        field !== "children" ? [null] : getStackPath(stack),
      mapping: ([, field, , , ...stack]) =>
        field !== "children" ? [null] : getStackPath(stack),
      mappingItem: ([
        {
          children: [
            {
              children: [key],
            },
          ],
        },
        field,
        ...stack
      ]) =>
        field !== "value" || !key
          ? [null]
          : [
              getNodeValue(key) as number | string,
              ...getStackPath(stack as [YamlUnistNode]),
            ],
      mappingValue: ([, field, ...stack]) =>
        field !== "content" ? [null] : getStackPath(stack as [YamlUnistNode]),
      sequence: ([, field, , index, ...stack]) =>
        field !== "children" ? [null] : [index!, ...getStackPath(stack)],
      sequenceItem: ([, field, ...stack]) =>
        field !== "content" ? [null] : getStackPath(stack as [YamlUnistNode]),
      flowMapping: ([, field, , index, ...stack]) =>
        field !== "children" ? [null] : [index!, ...getStackPath(stack)],
      flowMappingItem: ([
        {
          children: [
            {
              children: [key],
            },
          ],
        },
        field,
        ...stack
      ]) =>
        field !== "value" || !key
          ? [null]
          : [
              getNodeValue(key) as number | string,
              ...getStackPath(stack as [YamlUnistNode]),
            ],
      flowSequence: ([, field, , index, ...stack]) =>
        field !== "children" ? [null] : [index!, ...getStackPath(stack)],
      flowSequenceItem: ([, , ...stack]) =>
        getStackPath(stack as [YamlUnistNode]),
    }
  );

// https://github.com/prettier/prettier/blob/main/src/language-yaml/index.js
export const yamlPlugin = plugin<YamlUnistNode>({
  getNodeValue,
  getStackPath,
  originalPrinter,
  astFormat: "yaml",
  // https://github.com/prettier/prettier/blob/main/src/language-yaml/parser-yaml.js
  parsers: pick(["yaml"], parsers),
  // https://github.com/prettier/prettier/blob/main/src/language-yaml/printer-yaml.js
  print: (
    { node, overArrayElements, overObjectProperties },
    astPath,
    options,
    print
  ) => {
    const {
      builders: { hardline, join },
    } = doc;

    return injectablePrint(astPath, options, print, () =>
      keyByType<YamlUnistNode, doc.builders.Doc>({
        mapping: ({ children }) =>
          // https://github.com/prettier/prettier/blob/main/src/language-yaml/printer-yaml.js#L328
          join(
            hardline,
            overObjectProperties({
              docs: astPath.map(print, "children"),
              keys: children.map(
                ({
                  children: [
                    {
                      children: [key],
                    },
                  ],
                }) => key!
              ),
              values: children.map(
                ({
                  children: [
                    ,
                    {
                      children: [value],
                    },
                  ],
                }) => value!
              ),
            })
          ),
        sequence: ({ children }) =>
          // https://github.com/prettier/prettier/blob/main/src/language-yaml/printer-yaml.js#L328
          join(
            hardline,
            overArrayElements({
              docs: astPath.map(print, "children"),
              elements: children.map(({ children: [child] }) => child!),
            })
          ),
      })(node)
    );
  },
});
