import type {
  ArrayExpression,
  BooleanLiteral,
  NullLiteral,
  NumericLiteral,
  ObjectExpression,
  ObjectProperty,
  StringLiteral,
  TemplateElement,
  TemplateLiteral,
  UnaryExpression,
} from "@babel/types";
import { flow, fromPairs, map, pick } from "lodash/fp";
import { doc } from "prettier";
import type { AstPath, ParserOptions } from "prettier";
import originalPrinter from "prettier-raw/src/language-js/printer-estree-json";
import { parsers } from "prettier/parser-babel";

import { keyByType, plugin, processStack } from "@standard-configs/plugin";
import type { Stack } from "@standard-configs/plugin";

/* eslint-disable @typescript-eslint/no-use-before-define -- Recursive type definition */
type JSONExpression =
  | BooleanLiteral
  | JSONArrayExpression
  | JSONObjectExpression
  | JSONTemplateLiteral
  | JSONUnaryExpression
  | NullLiteral
  | NumericLiteral
  | StringLiteral;
/* eslint-enable @typescript-eslint/no-use-before-define */

type JSONArrayExpression = Omit<ArrayExpression, "elements"> & {
  elements: (JSONExpression | null)[];
};

type JSONObjectProperty = Omit<ObjectProperty, "key" | "value"> & {
  key: NumericLiteral | StringLiteral;
  value: JSONExpression;
};

type JSONObjectExpression = Omit<ObjectExpression, "properties"> & {
  properties: JSONObjectProperty[];
};

type JSONTemplateLiteral = Omit<TemplateLiteral, "expressions"> & {
  expressions: JSONExpression[];
};

type JSONUnaryExpression = Omit<UnaryExpression, "argument"> & {
  argument: JSONExpression;
};

// @babel/types doesn't expose BaseNode directly
type JSONRoot = Omit<ObjectExpression, "properties" | "type"> & {
  node: JSONExpression;
  type: "JsonRoot";
};

type JSONNode =
  | JSONExpression
  | JSONObjectProperty
  | JSONRoot
  | TemplateElement;

type GetNodeValueReturn =
  | GetNodeValueReturn[]
  | boolean
  | number
  | string
  | readonly GetNodeValueReturn[]
  | null
  | undefined;

const getNodeValue: ReturnType<typeof keyByType<JSONNode, GetNodeValueReturn>> =
  keyByType<JSONNode, GetNodeValueReturn>({
    JsonRoot: ({ node }) => getNodeValue(node),
    ObjectExpression: flow(
      ({ properties }) => properties,
      map((property) => getNodeValue(property)),
      fromPairs
    ),
    ObjectProperty: ({ key, value }) =>
      [getNodeValue(key), getNodeValue(value)] as const,
    ArrayExpression: ({ elements }) =>
      elements.map((element) => (!element ? element : getNodeValue(element))),
    BooleanLiteral: ({ value }) => value,
    NullLiteral: () => null,
    NumericLiteral: ({ value }) => value,
    StringLiteral: ({ value }) => value,
    TemplateElement: ({ value: { cooked } }) => cooked,
    TemplateLiteral: () => null,
    UnaryExpression: () => null,
  });

type JSONStack = Stack<JSONNode, "decorators">;

const getStackPath: ReturnType<typeof processStack<JSONNode, JSONStack>> =
  processStack<JSONNode, JSONStack>(
    [
      "ArrayExpression",
      "BooleanLiteral",
      "NullLiteral",
      "NumericLiteral",
      "ObjectExpression",
      "StringLiteral",
      "TemplateElement",
      "TemplateLiteral",
      "UnaryExpression",
    ],
    {
      JsonRoot: ([, , ...stack]) => getStackPath(stack),
      ObjectExpression: ([, , , , ...stack]) => getStackPath(stack),
      ObjectProperty: ([{ key }, field, ...stack]) =>
        field === "key"
          ? [null]
          : [getNodeValue(key) as number | string, ...getStackPath(stack)],
      ArrayExpression: ([, , , index, ...stack]) => [
        index!,
        ...getStackPath(stack),
      ],
    }
  );

const {
  builders: { group, hardline, indent, join, line, softline },
} = doc;

// HACK Until we figure out how arrays are actually printed, this is the closest to matching the actual output
const softPrintArrayElements = (docs: doc.builders.Doc[]) =>
  docs.length === 0
    ? "[]"
    : group(["[", indent([softline, join([",", line], docs)]), softline, "]"]);

// https://github.com/prettier/prettier/blob/2.8.8/src/language-js/index.js
export const jsonPlugin = plugin<JSONNode>({
  getNodeValue,
  getStackPath,
  originalPrinter: {
    ...originalPrinter,
    print: (
      astPath: AstPath<JSONNode>,
      options: ParserOptions<JSONNode>,
      print: (path: AstPath<JSONNode>) => doc.builders.Doc,
      args?: unknown
    ) => {
      const node = astPath.getNode();

      return node?.type !== "ArrayExpression"
        ? originalPrinter.print(astPath, options, print, args)
        : softPrintArrayElements(
            astPath.map(
              () =>
                astPath.getValue() === null
                  ? "null"
                  : // TODO Override Printer['print'] to allow no params
                    (print as () => doc.builders.Doc)(),
              "elements"
            )
          );
    },
  },
  astFormat: "estree-json",
  // https://github.com/prettier/prettier/blob/2.8.8/src/language-js/parse/json.js#L134
  parsers: pick(["json", "json5", "json-stringify"], parsers),
  // https://github.com/prettier/prettier/blob/2.8.8/src/language-js/printer-estree-json.js
  print: (
    { node, overArrayElements, overObjectProperties },
    astPath,
    options,
    print
  ) =>
    keyByType<JSONNode, doc.builders.Doc | null>({
      ArrayExpression: ({ elements }) =>
        // https://github.com/prettier/prettier/blob/2.8.8/src/language-js/printer-estree-json.js#L13
        softPrintArrayElements(
          overArrayElements({
            elements: elements.filter(
              (element): element is Exclude<typeof element, null> =>
                element !== null
            ),
            docs: astPath.map(
              () =>
                astPath.getValue() === null
                  ? "null"
                  : // TODO Override Printer['print'] to allow no params
                    (print as () => doc.builders.Doc)(),
              "elements"
            ),
          })
        ),
      ObjectExpression: ({ properties }) =>
        // https://github.com/prettier/prettier/blob/2.8.8/src/language-js/printer-estree-json.js#L30
        properties.length === 0
          ? null
          : [
              "{",
              indent([
                hardline,
                join(
                  [",", hardline],
                  overObjectProperties({
                    docs: astPath.map(print, "properties"),
                    keys: properties.map(({ key }) => key),
                    values: properties.map(({ value }) => value),
                  })
                ),
              ]),
              hardline,
              "}",
            ],
    })(node),
});
