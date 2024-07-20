import path from "node:path";
import { access, writeFile, readFile } from "node:fs/promises";
import { test, describe, expect, afterAll, vitest, beforeAll } from "vitest";
import { setup, cleanup, outDir } from "./config.js";
import { exec } from "./exec.js";

describe("markdownファイルを新規作成する", () => {
  beforeAll(async () => {
    await setup();
  });

  afterAll(async () => {
    await cleanup();
  });

  test("outディレクトリにsample-1234_asdf.mdファイルを作成する", async () => {
    await exec("sample-1234_asdf");

    expect(access(path.resolve(`${outDir}/sample-1234_asdf.md`))).resolves.ok;
  });

  test("すでに同名のファイルが存在する場合、異常終了する", async () => {
    await writeFile(path.resolve(outDir, "exists-123456.md"), "exists");

    expect(exec("exists-123456")).rejects.toThrow();

    expect(
      await readFile(path.resolve(outDir, "exists-123456.md"), "utf-8")
    ).toBe("exists");
  });
});
