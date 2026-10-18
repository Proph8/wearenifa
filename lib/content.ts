import "server-only";
import { createReader } from "@keystatic/core/reader";
import Markdoc, { type Config, type Node } from "@markdoc/markdoc";
import config, { POST_KINDS } from "../keystatic.config";

export const reader = createReader(process.cwd(), config);

export type Member = NonNullable<Awaited<ReturnType<typeof reader.collections.members.read>>> & {
  slug: string;
};
export type Post = NonNullable<Awaited<ReturnType<typeof reader.collections.posts.read>>> & {
  slug: string;
};
export type Project = NonNullable<Awaited<ReturnType<typeof reader.collections.projects.read>>> & {
  slug: string;
};

export async function getMembers(): Promise<Member[]> {
  const all = await reader.collections.members.all();
  return all
    .map(({ slug, entry }) => ({ ...entry, slug }))
    .sort((a, b) => (a.order ?? 10) - (b.order ?? 10) || a.name.localeCompare(b.name));
}

export async function getMember(slug: string): Promise<Member | null> {
  const entry = await reader.collections.members.read(slug);
  return entry ? { ...entry, slug } : null;
}

export async function getPosts(): Promise<Post[]> {
  const all = await reader.collections.posts.all();
  return all
    .map(({ slug, entry }) => ({ ...entry, slug }))
    .filter((p) => !p.draft)
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}

export async function getPost(slug: string): Promise<Post | null> {
  const entry = await reader.collections.posts.read(slug);
  return entry && !entry.draft ? { ...entry, slug } : null;
}

export async function getProjects(member?: string): Promise<Project[]> {
  const all = await reader.collections.projects.all();
  return all
    .map(({ slug, entry }) => ({ ...entry, slug }))
    .filter((p) => !member || p.member === member)
    .sort((a, b) => Number(b.featured) - Number(a.featured) || (b.year ?? "").localeCompare(a.year ?? ""));
}

export async function getFamily() {
  return reader.singletons.family.read();
}

export function kindLabel(kind: string) {
  return POST_KINDS.find((k) => k.value === kind)?.label ?? kind;
}

export function formatDate(iso: string | null | undefined, opts: Intl.DateTimeFormatOptions = {}) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", ...opts }).format(
    new Date(`${iso}T00:00:00`),
  );
}

// Poems keep the line breaks the author typed; prose reflows as usual.
export function renderableBody(node: Node, { poem = false } = {}) {
  const markdocConfig: Config = poem ? { nodes: { softbreak: { render: "br" } } } : {};
  const errors = Markdoc.validate(node, markdocConfig);
  if (errors.length) console.error(errors);
  return Markdoc.transform(node, markdocConfig);
}

export function wordCount(node: Node) {
  let words = 0;
  for (const n of node.walk()) {
    if (n.type === "text" && typeof n.attributes.content === "string") {
      words += n.attributes.content.split(/\s+/).filter(Boolean).length;
    }
  }
  return words;
}

export async function bodyNode(body: { node: Node } | (() => Promise<{ node: Node }>)) {
  return (typeof body === "function" ? await body() : body).node;
}

export function byline(authors: readonly (string | null)[], members: Member[]) {
  const names = authors
    .map((slug) => members.find((m) => m.slug === slug))
    .filter((m): m is Member => Boolean(m))
    .map((m) => m.shortName || m.name);
  return names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}` : (names[0] ?? "");
}

export function writingRows(posts: Post[], members: Member[]) {
  return posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    summary: p.summary ?? "",
    kind: p.kind,
    kindLabel: kindLabel(p.kind),
    authors: p.authors.filter((a): a is string => Boolean(a)),
    byline: byline(p.authors, members),
    when: formatDate(p.date, { day: undefined, month: "short" }),
    lang: p.language,
  }));
}

/** The letters a member gave the family name, and the rest of their name. */
export function splitName(m: Member) {
  const first = m.shortName || m.name.split(" ")[0];
  const n = Math.max(0, Math.min(m.lit ?? 0, first.length));
  return { lit: first.slice(0, n), rest: first.slice(n), first };
}
