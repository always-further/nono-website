import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const ACADEMY_DIR = path.join(process.cwd(), "content/academy");

export interface Lesson {
  slug: string;
  title: string;
  date: string;
  description: string;
  author: string;
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string;
  readingTime: string;
}

export interface LessonWithContent extends Lesson {
  content: string;
}

export function getAllLessons(): Lesson[] {
  if (!fs.existsSync(ACADEMY_DIR)) return [];

  const files = fs.readdirSync(ACADEMY_DIR).filter((f) => f.endsWith(".mdx"));

  return files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const filePath = path.join(ACADEMY_DIR, filename);
      const source = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(source);
      const rt = readingTime(content);

      return {
        slug,
        title: data.title as string,
        date: data.date as string,
        description: data.description as string,
        author: data.author as string,
        tags: (data.tags as string[]) ?? [],
        difficulty: (data.difficulty as Lesson["difficulty"]) ?? "beginner",
        duration: (data.duration as string) ?? rt.text,
        readingTime: rt.text,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getLessonBySlug(slug: string): LessonWithContent {
  const filePath = path.join(ACADEMY_DIR, `${slug}.mdx`);
  const source = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(source);
  const rt = readingTime(content);

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    description: data.description as string,
    author: data.author as string,
    tags: (data.tags as string[]) ?? [],
    difficulty: (data.difficulty as Lesson["difficulty"]) ?? "beginner",
    duration: (data.duration as string) ?? rt.text,
    readingTime: rt.text,
    content: source,
  };
}

export function getAllLessonSlugs(): string[] {
  if (!fs.existsSync(ACADEMY_DIR)) return [];

  return fs
    .readdirSync(ACADEMY_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getAllAcademyTags(): string[] {
  const lessons = getAllLessons();
  const tagSet = new Set(lessons.flatMap((l) => l.tags));
  return Array.from(tagSet).sort();
}

export function getLessonsByTag(tag: string): Lesson[] {
  return getAllLessons().filter((l) =>
    l.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase()),
  );
}
