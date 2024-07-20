import { execSync } from "node:child_process";

export async function exec(filename: string) {
  execSync(`pnpm tsx src/main.ts out ${filename}`);
}
