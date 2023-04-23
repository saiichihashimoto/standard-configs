import { formatJSON } from "@configs/plugin-json/src/test-utils";
import { formatYAML } from "@configs/plugin-yaml/src/test-utils";

import * as plugin from ".";

describe.each([
  { filename: ".huskyrc.json", format: formatJSON },
  { filename: ".huskyrc.yaml", format: formatYAML },
  { filename: ".huskyrc.yml", format: formatYAML },
  { filename: ".huskyrc", format: formatJSON },
])("%p", ({ filename, format }) => {
  const { defaultFormat, pluginFormat } = format(filename, plugin);

  it("sorts by git-hooks-list", () =>
    expect(
      pluginFormat({
        hooks: {
          "applypatch-msg": "applypatch-msg",
          "commit-msg": "commit-msg",
          "fsmonitor-watchman": "fsmonitor-watchman",
          "p4-changelist": "p4-changelist",
          "p4-post-changelist": "p4-post-changelist",
          "p4-pre-submit": "p4-pre-submit",
          "p4-prepare-changelist": "p4-prepare-changelist",
          "post-applypatch": "post-applypatch",
          "post-checkout": "post-checkout",
          "post-commit": "post-commit",
          "post-index-change": "post-index-change",
          "post-merge": "post-merge",
          "post-receive": "post-receive",
          "post-rewrite": "post-rewrite",
          "post-update": "post-update",
          "pre-applypatch": "pre-applypatch",
          "pre-auto-gc": "pre-auto-gc",
          "pre-commit": "pre-commit",
          "pre-merge-commit": "pre-merge-commit",
          "pre-push": "pre-push",
          "pre-rebase": "pre-rebase",
          "pre-receive": "pre-receive",
          "prepare-commit-msg": "prepare-commit-msg",
          "proc-receive": "proc-receive",
          "push-to-checkout": "push-to-checkout",
          "reference-transaction": "reference-transaction",
          "sendemail-validate": "sendemail-validate",
          "update": "update",
        },
      })
    ).toStrictEqual(
      defaultFormat({
        hooks: {
          "applypatch-msg": "applypatch-msg",
          "pre-applypatch": "pre-applypatch",
          "post-applypatch": "post-applypatch",
          "pre-commit": "pre-commit",
          "pre-merge-commit": "pre-merge-commit",
          "prepare-commit-msg": "prepare-commit-msg",
          "commit-msg": "commit-msg",
          "post-commit": "post-commit",
          "pre-rebase": "pre-rebase",
          "post-checkout": "post-checkout",
          "post-merge": "post-merge",
          "pre-push": "pre-push",
          "pre-receive": "pre-receive",
          "update": "update",
          "proc-receive": "proc-receive",
          "post-receive": "post-receive",
          "post-update": "post-update",
          "reference-transaction": "reference-transaction",
          "push-to-checkout": "push-to-checkout",
          "pre-auto-gc": "pre-auto-gc",
          "post-rewrite": "post-rewrite",
          "sendemail-validate": "sendemail-validate",
          "fsmonitor-watchman": "fsmonitor-watchman",
          "p4-changelist": "p4-changelist",
          "p4-prepare-changelist": "p4-prepare-changelist",
          "p4-post-changelist": "p4-post-changelist",
          "p4-pre-submit": "p4-pre-submit",
          "post-index-change": "post-index-change",
        },
      })
    ));
});

describe.each([
  { filename: ".simple-git-hooks.json", format: formatJSON },
  { filename: "simple-git-hooks.json", format: formatJSON },
])("%p", ({ filename, format }) => {
  const { defaultFormat, pluginFormat } = format(filename, plugin);

  it("sorts by git-hooks-list", () =>
    expect(
      pluginFormat({
        "applypatch-msg": "applypatch-msg",
        "commit-msg": "commit-msg",
        "fsmonitor-watchman": "fsmonitor-watchman",
        "p4-changelist": "p4-changelist",
        "p4-post-changelist": "p4-post-changelist",
        "p4-pre-submit": "p4-pre-submit",
        "p4-prepare-changelist": "p4-prepare-changelist",
        "post-applypatch": "post-applypatch",
        "post-checkout": "post-checkout",
        "post-commit": "post-commit",
        "post-index-change": "post-index-change",
        "post-merge": "post-merge",
        "post-receive": "post-receive",
        "post-rewrite": "post-rewrite",
        "post-update": "post-update",
        "pre-applypatch": "pre-applypatch",
        "pre-auto-gc": "pre-auto-gc",
        "pre-commit": "pre-commit",
        "pre-merge-commit": "pre-merge-commit",
        "pre-push": "pre-push",
        "pre-rebase": "pre-rebase",
        "pre-receive": "pre-receive",
        "prepare-commit-msg": "prepare-commit-msg",
        "proc-receive": "proc-receive",
        "push-to-checkout": "push-to-checkout",
        "reference-transaction": "reference-transaction",
        "sendemail-validate": "sendemail-validate",
        "update": "update",
      })
    ).toStrictEqual(
      defaultFormat({
        "applypatch-msg": "applypatch-msg",
        "pre-applypatch": "pre-applypatch",
        "post-applypatch": "post-applypatch",
        "pre-commit": "pre-commit",
        "pre-merge-commit": "pre-merge-commit",
        "prepare-commit-msg": "prepare-commit-msg",
        "commit-msg": "commit-msg",
        "post-commit": "post-commit",
        "pre-rebase": "pre-rebase",
        "post-checkout": "post-checkout",
        "post-merge": "post-merge",
        "pre-push": "pre-push",
        "pre-receive": "pre-receive",
        "update": "update",
        "proc-receive": "proc-receive",
        "post-receive": "post-receive",
        "post-update": "post-update",
        "reference-transaction": "reference-transaction",
        "push-to-checkout": "push-to-checkout",
        "pre-auto-gc": "pre-auto-gc",
        "post-rewrite": "post-rewrite",
        "sendemail-validate": "sendemail-validate",
        "fsmonitor-watchman": "fsmonitor-watchman",
        "p4-changelist": "p4-changelist",
        "p4-prepare-changelist": "p4-prepare-changelist",
        "p4-post-changelist": "p4-post-changelist",
        "p4-pre-submit": "p4-pre-submit",
        "post-index-change": "post-index-change",
      })
    ));
});
