import { resolve } from "node:path";
import appRoot from "app-root-path";
import { Command } from "commander";
import { createBlog } from "./createBlog.js";

const root = appRoot.toString();

console.log("root", root);

const program = new Command();
program
  .name("@diskszk/astro-blog-template")
  .description("Generate Markdown file")
  .version("0.0.1", "-v, --version")
  .argument("<path>", "output directory")
  .argument("<filename>", "filenam to be generated")
  .action(async (path, filename) => {
    console.log("path", path);

    const outputDir = resolve(root, path);

    await createBlog(outputDir, filename);
  });

program.parse();
