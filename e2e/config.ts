import appRoot from "app-root-path";
import path from "node:path";
import { mkdir } from "node:fs/promises";
import { deleteAsync } from "del";

const root = appRoot.toString();
export const outDir = path.resolve(root, "out");

export async function setup() {
  await mkdir(outDir);
}

export async function cleanup() {
  await deleteAsync(outDir);
}
