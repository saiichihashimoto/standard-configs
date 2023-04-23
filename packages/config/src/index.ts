import { flow, identity, invert, sortBy, sortedUniqBy } from "lodash/fp";
import { type SupportLanguage, type doc } from "prettier";
import { type ZodType, z } from "zod";

/**
 * Returns a function that returns the index of the value from the original array.
 * Precomputes the indexes so it doesn't use `Array.indexOf()`.
 *
 * @default keys.length
 * @example
 * indexOf(['a', 'b', 'c'])('b') === 1;
 * indexOf(['a', 'b', 'c'])('d') === 3;
 *
 * @example
 * indexOf((unmatched) => ['a', 'b', unmatched, 'c'])('b') === 1;
 * indexOf((unmatched) => ['a', 'b', unmatched, 'c'])('d') === 2;
 */
export const indexOf = (
  objectKeysOrFn:
    | string[]
    | (<T extends symbol>(unmatched: T) => (T | string)[])
) => {
  const unmatched: unique symbol = Symbol("unmatchedIndexOf");

  const objectKeys = Array.isArray(objectKeysOrFn)
    ? objectKeysOrFn
    : objectKeysOrFn(unmatched);

  const indexObject: {
    [x: string]: number | undefined;
    [unmatched]: number;
  } = {
    [unmatched]: objectKeys.length,
    ...invert(objectKeys),
  };

  return (value: string) =>
    `${indexObject[value] ?? indexObject[unmatched]}`.padStart(3, "0");
};

export const sortAndUniqBy = <T, S>(getValue: (value: T) => S) =>
  flow(sortBy<T>(getValue), sortedUniqBy(getValue));

type NestedMaybeArray<T> = NestedMaybeArray<T>[] | T;

type ElementWrapper<Value> = {
  doc: doc.builders.Doc;
  value: Value;
};

export const elementsZod = <Value>(
  value: ZodType<Value> = z.any(),
  transform: (
    elements: ElementWrapper<Value>[]
  ) => ElementWrapper<Value>[] = identity
) =>
  z
    .array<ZodType<ElementWrapper<Value>>>(
      // @ts-expect-error -- Not sure how to convince this it's true
      z.object({
        value,
        doc: z.custom<doc.builders.Doc>(),
      })
    )
    .transform(transform);

export type PropertyWrapper<Value> = {
  doc: doc.builders.Doc;
  key: string;
  value: Value;
};

export const propertiesZod = <Value>(
  value: ZodType<Value> = z.any(),
  transform: (
    properties: PropertyWrapper<Value>[]
  ) => PropertyWrapper<Value>[] = identity
) =>
  z
    .array<ZodType<PropertyWrapper<Value>>>(
      // @ts-expect-error -- Not sure how to convince this it's true
      z.object({
        key: z.custom<string>(),
        value,
        doc: z.custom<doc.builders.Doc>(),
      })
    )
    .transform(transform);

export type Operation = {
  if?: (props: {
    getParentValue: (count?: number) => unknown;
    getRootValue: () => unknown;
    match: RegExpMatchArray;
    value: unknown;
  }) => boolean;
  overElements?: ZodType<ElementWrapper<unknown>[]>;
  overProperties?: ZodType<PropertyWrapper<unknown>[]>;
  path: RegExp;
  print?: (value: unknown) => doc.builders.Doc | undefined;
  sortKeys?:
    | (((key: string) => NestedMaybeArray<boolean | number | string>) | null)[]
    | undefined;
};

export type Config = {
  languages?: SupportLanguage[];
  operations: Operation[];
  parsers?: string[];
};

export const concatRegex = (parent: RegExp, child: RegExp) => {
  const parentReduced = parent.source.replace(/^\^/, "").replace(/\$$/, "");

  const childReduced = child.source.replace(/^\^/, "").replace(/\$$/, "");

  return new RegExp(
    `^${
      parent.test("") && child.test("")
        ? `(?:(?:(?:(?:${parentReduced})\\.)?(?:${childReduced}))|(?:(?:${parentReduced})(?:\\.(?:${childReduced}))?))`
        : parent.test("")
        ? `(?:(?:${parentReduced})\\.)?(?:${childReduced})`
        : child.test("")
        ? `(?:${parentReduced})(?:\\.(?:${childReduced}))?`
        : `(?:${parentReduced})\\.(?:${childReduced})`
    }$`
  );
};

/**
 * Nests a config under another config, ie eslintrc's config under package.json's eslintConfig field.
 */
export const nestConfig = (nestingStackPath: RegExp, nestedConfig: Config) =>
  nestedConfig.operations.map(
    ({ path, ...config }): Operation => ({
      ...config,
      path: concatRegex(nestingStackPath, path),
    })
  );
