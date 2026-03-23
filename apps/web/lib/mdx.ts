import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content");

export interface BlogFrontmatter {
  title: string;
  description: string;
  date: string;
  keywords: string[];
  slug: string;
}

export interface DocsFrontmatter {
  title: string;
  description: string;
  keywords: string[];
  slug: string;
  order: number;
}

export function getContentBySlug<T extends "blog" | "docs">(
  type: T,
  slug: string,
): {
  frontmatter: T extends "blog" ? BlogFrontmatter : DocsFrontmatter;
  content: string;
} {
  const filePath = path.join(contentDirectory, type, `${slug}.mdx`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  return {
    frontmatter: data as T extends "blog" ? BlogFrontmatter : DocsFrontmatter,
    content,
  };
}

export function getAllContent<T extends "blog" | "docs">(
  type: T,
): (T extends "blog" ? BlogFrontmatter : DocsFrontmatter)[] {
  const dir = path.join(contentDirectory, type);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));

  const items = files.map((file) => {
    const fileContents = fs.readFileSync(path.join(dir, file), "utf8");
    const { data } = matter(fileContents);
    return data as T extends "blog" ? BlogFrontmatter : DocsFrontmatter;
  });

  if (type === "blog") {
    return items.sort(
      (a, b) =>
        new Date((b as BlogFrontmatter).date).getTime() -
        new Date((a as BlogFrontmatter).date).getTime(),
    );
  }

  return items.sort(
    (a, b) =>
      (a as DocsFrontmatter).order - (b as DocsFrontmatter).order,
  );
}
