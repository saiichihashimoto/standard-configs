import { concatRegex } from ".";

describe("concatRegex", () => {
  it.each([
    { a: /^$/, b: /^$/, match: "" },
    { a: /^$/, b: /^$/, not: "foo" },
    { a: /^$/, b: /^foo$/, match: "foo" },
    { a: /^$/, b: /^foo$/, not: "" },
    { a: /^foo$/, b: /^$/, match: "foo" },
    { a: /^foo$/, b: /^$/, not: "" },
    { a: /^foo$/, b: /^bar$/, match: "foo.bar" },
    { a: /^foo$/, b: /^bar$/, not: "" },
    { a: /^foo$/, b: /^bar$/, not: "foo" },
    { a: /^foo$/, b: /^bar$/, not: "bar" },
    { a: /^(foo)?$/, b: /^bar$/, match: "foo.bar" },
    { a: /^(foo)?$/, b: /^bar$/, match: "bar" },
    { a: /^(foo)?$/, b: /^bar$/, not: "" },
    { a: /^(foo)?$/, b: /^bar$/, not: "foo" },
    // TODO { a: /^(foo)?$/, b: /^bar$/, not: ".bar" },
    { a: /^foo$/, b: /^(bar)?$/, match: "foo.bar" },
    { a: /^foo$/, b: /^(bar)?$/, match: "foo" },
    { a: /^foo$/, b: /^(bar)?$/, not: "" },
    { a: /^foo$/, b: /^(bar)?$/, not: "bar" },
    // TODO { a: /^foo$/, b: /^(bar)?$/, not: "foo." },
    { a: /^(foo)?$/, b: /^(bar)?$/, match: "foo.bar" },
    { a: /^(foo)?$/, b: /^(bar)?$/, match: "foo" },
    { a: /^(foo)?$/, b: /^(bar)?$/, match: "bar" },
    { a: /^(foo)?$/, b: /^(bar)?$/, match: "" },
    // TODO { a: /^(foo)?$/, b: /^(bar)?$/, not: ".bar" },
    // TODO { a: /^(foo)?$/, b: /^(bar)?$/, not: "foo." },
    // TODO { a: /^(foo)?$/, b: /^(bar)?$/, not: "." },
  ])("%p", ({ a, b, match, not }) => {
    if (match) {
      // eslint-disable-next-line jest/no-conditional-expect -- I could split this into two `it.each`, but I don't want to
      expect(match).toMatch(concatRegex(a, b));
    } else if (not) {
      // eslint-disable-next-line jest/no-conditional-expect -- I could split this into two `it.each`, but I don't want to
      expect(not).not.toMatch(concatRegex(a, b));
    }
  });
});
