import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const GUIDES_DIR = path.join(process.cwd(), "content/guides");

export interface Guide {
  slug: string;
  title: string;
  date: string;
  description: string;
  readingTime: string;
}

export interface GuideWithContent extends Guide {
  content: string;
}

export function getAllGuides(): Guide[] {
  if (!fs.existsSync(GUIDES_DIR)) return [];

  const files = fs.readdirSync(GUIDES_DIR).filter((f) => f.endsWith(".mdx"));

  return files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const filePath = path.join(GUIDES_DIR, filename);
      const source = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(source);
      const rt = readingTime(content);

      return {
        slug,
        title: data.title as string,
        date: data.date as string,
        description: data.description as string,
        readingTime: rt.text,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getGuideBySlug(slug: string): GuideWithContent {
  const filePath = path.join(GUIDES_DIR, `${slug}.mdx`);
  const source = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(source);
  const rt = readingTime(content);

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    description: data.description as string,
    readingTime: rt.text,
    content: source,
  };
}

export function getAllGuideSlugs(): string[] {
  if (!fs.existsSync(GUIDES_DIR)) return [];

  return fs
    .readdirSync(GUIDES_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}
