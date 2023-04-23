import { formatIgnore } from "@configs/plugin-ignore/src/test-utils";

import * as plugin from ".";

describe.each([
  { filename: ".gitignore", format: formatIgnore },
  { filename: "git/exclude", format: formatIgnore },
  { filename: "git/ignore", format: formatIgnore },
])("%p", ({ filename, format }) => {
  const { defaultFormat, pluginFormat } = format(filename, plugin);

  it("sorts and uniqs", () =>
    expect(pluginFormat(["b", "a", "b"])).toStrictEqual(
      defaultFormat(["a", "b"])
    ));
});
