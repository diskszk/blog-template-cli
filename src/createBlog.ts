import fs, { access } from "node:fs/promises";
import { join } from "node:path";
import { format } from "date-fns";
import { err, ok, type Result } from "neverthrow";

function validateFilename(filename: string): boolean {
  // 半角英小文字（a-z）、半角数字（0-9）、ハイフン（-）、アンダースコア（_）の12〜50字の組み合わせ
  const pattern = /^[a-z0-9_-]{12,50}$/;

  return pattern.test(filename);
}

async function createNewFile(
  path: string,
  data: string
): Promise<Result<void, Error>> {
  try {
    await fs.writeFile(path, data);
    return ok(void 0);
  } catch {
    return err(new Error(`ファイルの書き込みに失敗しました。\nfile: ${path}`));
  }
}

async function isNewFile(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return false;
  } catch {
    return true;
  }
}

export async function createBlog(
  targetDir: string,
  filename: string
): Promise<void> {
  if (!validateFilename(filename)) {
    console.error(
      "ブログのfilenameは半角英小文字（a-z）、半角数字（0-9）、ハイフン（-）、アンダースコア（_）の12〜50字の組み合わせで入力してください"
    );
    process.exit(1);
  }

  try {
    await access(targetDir);
  } catch {
    console.error(`${targetDir} does not exists`);
    process.exit(1);
  }

  const isNew = await isNewFile(join(targetDir, `${filename}.md`));
  if (!isNew) {
    console.error(`${targetDir}/${filename}.md alerady exists`);
    process.exit(1);
  }

  const publishedAt = format(new Date(), "yyyy-MM-dd");

  const data = {
    title: "",
    topics: [""],
    published: false,
    published_at: publishedAt,
  };

  const frontmatter = `---
title: ${data.title}
topics: [${data.topics.map((v) => `"${v}"`)}]
published: ${data.published}
published_at: '${data.published_at}'
description:
---`;

  const createNewFileResult = await createNewFile(
    join(targetDir, `${filename}.md`),
    frontmatter
  );

  if (createNewFileResult.isErr()) {
    console.error(createNewFileResult.error);
    process.exit(1);
  }

  console.log(
    "Complate create markdown file\npath:",
    join(targetDir, `${filename}.md`)
  );
}
