import {
  flatMap,
  flow,
  groupBy,
  identity,
  keyBy,
  map,
  mapValues,
  over,
  sortBy,
  toPairs,
  uniq,
  values,
  zip,
} from "lodash/fp";
import { Minimatch } from "minimatch";
import { basename } from "path";
import type { AstPath, Plugin, Printer, SupportLanguage, doc } from "prettier";

import type { Config, PropertyWrapper } from "@standard-configs/config";

export type Stack<
  Node,
  IgnoredKeys = never,
  CurrentNode = Node,
  CurrentStack extends unknown[] = []
> = Exclude<
  CurrentStack["length"] extends 20
    ? never
    : CurrentNode extends unknown[] | readonly unknown[]
    ? Exclude<CurrentNode[number], null | undefined> extends Node
      ? [...CurrentStack, CurrentNode, number, Node]
      : Stack<
          Node,
          IgnoredKeys,
          Exclude<CurrentNode[number], number | string | null | undefined>,
          [...CurrentStack, CurrentNode, number]
        >
    : CurrentNode extends object
    ? {
        [key in Exclude<keyof CurrentNode, IgnoredKeys>]: Exclude<
          CurrentNode[key],
          null | undefined
        > extends Node
          ? [...CurrentStack, CurrentNode, key, Node]
          : Stack<
              Node,
              IgnoredKeys,
              Exclude<CurrentNode[key], number | string | null | undefined>,
              [...CurrentStack, CurrentNode, key]
            >;
      }[Exclude<keyof CurrentNode, IgnoredKeys>]
    : never,
  undefined
>;

export const keyByType =
  <T extends { type: string }, Return>(obj: {
    [type in T["type"]]?: (item: Extract<T, { type: type }>) => Return;
  }) =>
  <S extends T>(item: S | undefined) =>
    !item ||
    !((item: S): item is Extract<S, { type: S["type"] }> => item.type in obj)(
      item
    )
      ? undefined
      : obj[item.type]?.(item);

export const processStack = <
  Node extends { type: string },
  Stack extends [Node, ...unknown[]]
>(
  terminalNodeTypes: Node["type"][],
  obj: {
    [type in Node["type"]]?: (
      stack: Extract<Stack, [{ type: type }, ...unknown[]]>
    ) => (number | string | null)[];
  }
) => {
  const isTerminalNode = keyBy((type) => type, terminalNodeTypes);

  return (rawStack: Node[]): (number | string | null)[] => {
    const stack = rawStack as Stack | [Node];

    return stack.length === 1
      ? isTerminalNode[stack[0].type]
        ? [""]
        : [null]
      : // @ts-expect-error -- It's narrowed
        obj[stack[0].type]?.(stack) ?? [null];
  };
};

export const mergePlugins = (...plugins: Plugin[]) =>
  plugins.reduce(
    (
      {
        defaultOptions: defaultOptionsA,
        languages: languagesA = [],
        options: optionsA,
        parsers: parsersA,
        printers: printersA,
      },
      {
        defaultOptions: defaultOptionsB,
        languages: languagesB = [],
        options: optionsB,
        parsers: parsersB,
        printers: printersB,
      }
    ) => ({
      defaultOptions: { ...defaultOptionsA, ...defaultOptionsB },
      options: { ...optionsA, ...optionsB },
      parsers: { ...parsersA, ...parsersB },
      printers: { ...printersA, ...printersB },
      languages: flow(
        groupBy<SupportLanguage>(({ name }) => name),
        mapValues((languages) =>
          languages.reduce(
            (
              {
                aliases: aliasesA = [],
                extensions: extensionsA = [],
                filenames: filenamesA = [],
                interpreters: interpretersA = [],
                parsers: parsersA,
                vscodeLanguageIds: vscodeLanguageIdsA = [],
                ...parserA
              },
              {
                aliases: aliasesB = [],
                extensions: extensionsB = [],
                filenames: filenamesB = [],
                interpreters: interpretersB = [],
                parsers: parsersB,
                vscodeLanguageIds: vscodeLanguageIdsB = [],
                ...parserB
              }
            ) => ({
              ...parserA,
              ...parserB,
              aliases: uniq([...aliasesA, ...aliasesB]),
              extensions: uniq([...extensionsA, ...extensionsB]),
              filenames: uniq([...filenamesA, ...filenamesB]),
              interpreters: uniq([...interpretersA, ...interpretersB]),
              parsers: uniq([...parsersA, ...parsersB]),
              vscodeLanguageIds: uniq([
                ...vscodeLanguageIdsA,
                ...vscodeLanguageIdsB,
              ]),
            })
          )
        ),
        values<{ [index: string]: SupportLanguage }>
      )([...languagesA, ...languagesB]),
    })
  );

export const plugin =
  <Node>({
    astFormat,
    getNodeValue,
    getStackPath,
    languages = [],
    parsers,
    print,
    originalPrinter: { print: printDefault, ...originalPrinter },
  }: {
    astFormat: string;
    getNodeValue: (node: Node | undefined) => unknown;
    getStackPath: (stack: AstPath<Node>["stack"]) => (number | string | null)[];
    languages?: SupportLanguage[] | undefined;
    originalPrinter: Printer<Node>;
    parsers: NonNullable<Plugin<Node>["parsers"]>;
    print: (
      helpers: {
        node: Node;
        overArrayElements: <ElementNode extends Node>(docs: {
          docs: doc.builders.Doc[];
          elements: ElementNode[];
        }) => doc.builders.Doc[];
        overObjectProperties: <
          KeyNode extends Node,
          ValueNode extends Node
        >(docs: {
          docs: doc.builders.Doc[];
          keys: KeyNode[];
          values: ValueNode[];
        }) => doc.builders.Doc[];
        value: unknown;
      },
      ...args: Parameters<Printer<Node>["print"]>
    ) => ReturnType<Printer<Node>["print"]> | null | undefined;
  }) =>
  (configs: { [key: string]: Config }): Plugin<Node> => {
    const configPairs = toPairs(configs);
    const minimatches = configPairs.map(([pattern, config]) => ({
      config,
      minimatch: new Minimatch(`**/${pattern}`),
    }));
    const cacheMatch: { [key: string]: (typeof minimatches)[number] | false } =
      {};

    return {
      languages: [
        ...languages,
        ...configPairs
          .map(([pattern, { parsers = [] }]) => ({
            parsers,
            name: pattern,
            filenames: [basename(pattern)],
          }))
          .filter(({ parsers }) => parsers.length > 0),
        ...flow(
          values<typeof configs>,
          map(({ languages = [] }) => languages),
          flatMap((languages) => languages)
        )(configs),
      ],
      parsers: mapValues(
        (parser) => ({
          ...parser,
          astFormat: `@standard-configs/${astFormat}`,
        }),
        parsers
      ),
      printers: {
        [`@standard-configs/${astFormat}`]: {
          ...originalPrinter,
          print: (...params) => {
            const [astPath, { filepath }] = params;

            // eslint-disable-next-line no-multi-assign,fp/no-mutation -- print will be called recursively and often with the same filepath. We can avoid doing this over and over again.
            const minimatch = (cacheMatch[filepath] =
              cacheMatch[filepath] ??
              minimatches.find(({ minimatch }) => minimatch.match(filepath)) ??
              false);

            if (!minimatch) {
              return printDefault(...params);
            }

            const stackPath = getStackPath(astPath.stack).reduce(
              (previous, current) =>
                previous === null || current === null
                  ? null
                  : [
                      previous,
                      typeof current !== "number" ? current : `[${current}]`,
                    ]
                      .filter(Boolean)
                      .join(typeof current !== "number" ? "." : ""),
              ""
            ) as string | null;

            if (stackPath === null) {
              return printDefault(...params);
            }

            const {
              config: { operations },
            } = minimatch;

            const node = astPath.getValue();

            const value = getNodeValue(node);

            const matches = operations.filter(({ path, if: ifCondition }) => {
              const match = stackPath.match(path);

              return (
                match &&
                (!ifCondition ||
                  ifCondition({
                    match,
                    value,
                    getParentValue: (count) =>
                      getNodeValue(astPath.getParentNode(count)!),
                    getRootValue: () => getNodeValue(astPath.stack[0]!),
                  }))
              );
            });

            const printed = matches
              .map(({ print }) => print)
              .filter(Boolean)
              .map((printNode) => printNode(value))
              .find(Boolean);

            if (printed !== undefined) {
              return printed;
            }

            const sortKeys = matches.flatMap(({ sortKeys = [] }) => sortKeys);
            const sortFn = flow(
              ({
                key,
              }: {
                doc: doc.builders.Doc;
                key: unknown;
                value: unknown;
              }) => key,
              over([
                ...(sortKeys.includes(null)
                  ? []
                  : [(value: string) => (value === "$schema" ? 0 : 1)]),
                ...sortKeys.filter(
                  (sort): sort is Exclude<typeof sort, null> => sort !== null
                ),
                ...(sortKeys.includes(null) ? [] : [identity<string>]),
              ])
            );
            const overElements = matches
              .map(({ overElements }) => overElements)
              .filter(Boolean);
            const overProperties = matches
              .map(({ overProperties }) => overProperties)
              .filter(Boolean);

            return (
              print(
                {
                  node,
                  value,
                  overArrayElements: ({ docs, elements: nodes }) =>
                    flow(
                      zip(nodes)<doc.builders.Doc>,
                      map(([node, doc]) => ({
                        doc: doc!,
                        value: getNodeValue(node),
                      })),
                      (elementWrappers) =>
                        overElements.reduce(
                          (elementWrappers, zod) =>
                            zod
                              // eslint-disable-next-line promise/prefer-await-to-then -- This isn't a promise
                              .catch(elementWrappers)
                              .parse(elementWrappers),
                          elementWrappers
                        ),
                      map(({ doc }) => doc)
                    )(docs),
                  overObjectProperties: ({ docs, keys, values }) =>
                    flow(
                      zip(keys)<doc.builders.Doc>,
                      zip(values),
                      map(([value, [key, doc] = []]) => ({
                        doc: doc!,
                        key: getNodeValue(key),
                        value: getNodeValue(value),
                      })),
                      sortBy(sortFn),
                      (propertyWrappers) =>
                        overProperties.reduce(
                          (propertyWrappers, zod) =>
                            zod
                              // eslint-disable-next-line promise/prefer-await-to-then -- This isn't a promise
                              .catch(
                                propertyWrappers as PropertyWrapper<unknown>[]
                              )
                              .parse(propertyWrappers),
                          propertyWrappers
                        ),
                      map(({ doc }) => doc)
                    )(docs),
                },
                ...params
              ) ?? printDefault(...params)
            );
          },
        },
      },
    };
  };
