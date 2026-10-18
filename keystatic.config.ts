import { config, collection, singleton, fields } from "@keystatic/core";

// Local files while developing. Once the GitHub app exists (see README), the
// deployed site saves by committing to this repo instead.
const storage =
  process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG
    ? ({ kind: "github", repo: { owner: "Proph8", name: "love-story-selector-site-01" } } as const)
    : ({ kind: "local" } as const);

const image = (label: string, folder: string, description?: string) =>
  fields.image({
    label,
    description,
    directory: `public/media/${folder}`,
    publicPath: `/media/${folder}/`,
  });

export const POST_KINDS = [
  { label: "Essay", value: "essay" },
  { label: "Article", value: "article" },
  { label: "Blog post", value: "blog" },
  { label: "Poem", value: "poem" },
  { label: "Photos", value: "photos" },
  { label: "Note", value: "note" },
] as const;

const body = (label = "Text") =>
  fields.markdoc({
    label,
    options: { image: { directory: "public/media/inline", publicPath: "/media/inline/" } },
  });

export default config({
  storage,
  ui: {
    brand: { name: "Family site" },
    navigation: {
      Writing: ["posts"],
      People: ["members", "projects"],
      Home: ["family"],
    },
  },
  singletons: {
    family: singleton({
      label: "Family home page",
      path: "content/family",
      schema: {
        name: fields.text({ label: "Family name, as shown at the top", defaultValue: "Nisham & Fazna" }),
        intro: fields.text({
          label: "One-paragraph introduction",
          multiline: true,
          validation: { length: { max: 320 } },
        }),
        heroPhoto: image("Main family photo", "family", "Wide, landscape photo of the family."),
        heroPhotoAlt: fields.text({
          label: "Describe the main photo",
          description: "Read out by screen readers and used by search engines. Say who is in it and where.",
          validation: { isRequired: true },
        }),
        places: fields.text({
          label: "Sentence over the photos of where you're from",
          description: "Three short lines at most.",
          multiline: true,
        }),
        gallery: fields.array(
          fields.object({
            image: image("Photo", "family"),
            alt: fields.text({ label: "Describe the photo", validation: { isRequired: true } }),
            caption: fields.text({ label: "Caption" }),
            where: fields.select({
              label: "Where it appears",
              options: [
                { label: "Photos that pass under the names (black and white)", value: "places" },
                { label: "The changing frame (colour)", value: "frame" },
              ],
              defaultValue: "frame",
            }),
          }),
          { label: "Home page photos", itemLabel: (p) => p.fields.caption.value || p.fields.alt.value || "Photo" },
        ),
      },
    }),
  },
  collections: {
    members: collection({
      label: "Family members",
      slugField: "name",
      path: "content/members/*",
      format: { contentField: "bio" },
      columns: ["name", "role"],
      schema: {
        name: fields.slug({
          name: { label: "Full name" },
          slug: { label: "Web address", description: "Their page lives at /<this>. Keep it short, e.g. fazna." },
        }),
        shortName: fields.text({ label: "Short name", description: "Used in bylines, e.g. Fazna" }),
        role: fields.text({ label: "Role, one line", description: "e.g. AI SME at MediaMint" }),
        location: fields.text({ label: "Home town or city" }),
        portrait: image("Portrait", "members", "A photo of this person; upright crops work best."),
        portraitFocus: fields.text({
          label: "Which part of the portrait to keep",
          description: "Horizontal position: 50% is the middle, 20% keeps the left side, 80% the right.",
          defaultValue: "50%",
        }),
        portraitZoom: fields.number({
          label: "Zoom into the portrait",
          description: "1 shows the whole photo; 1.6 crops in closer around the point above.",
          defaultValue: 1,
          step: 0.1,
        }),
        accent: fields.select({
          label: "Their colour",
          description: "Used for links and highlights on their pages.",
          options: [
            { label: "Cobalt", value: "cobalt" },
            { label: "Fern", value: "fern" },
            { label: "Ocean", value: "ocean" },
            { label: "Amber", value: "amber" },
          ],
          defaultValue: "cobalt",
        }),
        tone: fields.select({
          label: "Their page tone",
          options: [
            { label: "Light (paper)", value: "light" },
            { label: "Dark (graphite)", value: "dark" },
          ],
          defaultValue: "light",
        }),
        lit: fields.integer({
          label: "Letters of their name in the family name",
          description: "Nisham gives 2 (Ni), Fazna gives 2 (Fa). Use 0 if they're not part of it.",
          defaultValue: 0,
        }),
        order: fields.integer({ label: "Order on the home page", defaultValue: 10 }),
        showOnHome: fields.checkbox({ label: "Show on the home page", defaultValue: true }),
        now: fields.text({ label: "What they're doing now", multiline: true }),
        email: fields.text({ label: "Email for the CV (optional)", description: "Shown on the printable CV only." }),
        links: fields.array(
          fields.object({ label: fields.text({ label: "Label" }), url: fields.url({ label: "Link" }) }),
          { label: "Links", itemLabel: (p) => p.fields.label.value || "Link" },
        ),
        experience: fields.array(
          fields.object({
            title: fields.text({ label: "Title" }),
            org: fields.text({ label: "Organisation" }),
            place: fields.text({ label: "Place" }),
            start: fields.text({ label: "Start", description: "e.g. Apr 2023" }),
            end: fields.text({ label: "End", description: "Leave empty if current" }),
            note: fields.text({ label: "Note", multiline: true }),
          }),
          { label: "Path (newest first)", itemLabel: (p) => `${p.fields.title.value} · ${p.fields.org.value}` },
        ),
        education: fields.array(
          fields.object({
            course: fields.text({ label: "Course" }),
            school: fields.text({ label: "School" }),
            years: fields.text({ label: "Years" }),
          }),
          { label: "Education", itemLabel: (p) => p.fields.course.value || "Course" },
        ),
        skillGroups: fields.array(
          fields.object({
            label: fields.text({ label: "Group" }),
            items: fields.text({ label: "Skills, comma separated" }),
          }),
          { label: "Skills", itemLabel: (p) => p.fields.label.value || "Group" },
        ),
        certifications: fields.array(
          fields.object({
            name: fields.text({ label: "Name" }),
            issuer: fields.text({ label: "Issuer" }),
            date: fields.text({ label: "Date" }),
          }),
          { label: "Certifications", itemLabel: (p) => p.fields.name.value || "Certificate" },
        ),
        photos: fields.array(
          fields.object({
            image: image("Photo", "members"),
            alt: fields.text({ label: "Describe the photo", validation: { isRequired: true } }),
            caption: fields.text({ label: "Caption" }),
          }),
          { label: "Photos on their page", itemLabel: (p) => p.fields.caption.value || p.fields.alt.value || "Photo" },
        ),
        bio: body("About"),
      },
    }),
    projects: collection({
      label: "Work & projects",
      slugField: "title",
      path: "content/projects/*",
      format: { contentField: "body" },
      columns: ["title", "year"],
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        member: fields.relationship({ label: "Whose work", collection: "members", validation: { isRequired: true } }),
        year: fields.text({ label: "Year" }),
        summary: fields.text({ label: "One-line summary", multiline: true }),
        link: fields.url({ label: "Link (optional)" }),
        image: image("Picture (optional)", "projects"),
        imageAlt: fields.text({ label: "Describe the picture" }),
        featured: fields.checkbox({ label: "Feature at the top of their page", defaultValue: false }),
        body: body("Details"),
      },
    }),
    posts: collection({
      label: "Posts",
      slugField: "title",
      path: "content/posts/*",
      format: { contentField: "body" },
      entryLayout: "content",
      columns: ["title", "date"],
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        kind: fields.select({ label: "What is it?", options: POST_KINDS, defaultValue: "essay" }),
        authors: fields.array(fields.relationship({ label: "Author", collection: "members" }), {
          label: "Written by",
          itemLabel: (p) => p.value ?? "Choose a person",
          validation: { length: { min: 1 } },
        }),
        date: fields.date({ label: "Date", defaultValue: { kind: "today" }, validation: { isRequired: true } }),
        language: fields.select({
          label: "Language",
          options: [
            { label: "English", value: "en" },
            { label: "Malayalam", value: "ml" },
          ],
          defaultValue: "en",
        }),
        summary: fields.text({
          label: "Short summary",
          description: "Shown in lists, in link previews and to search engines. One or two sentences, under 160 characters.",
          multiline: true,
          validation: { isRequired: true, length: { max: 160 } },
        }),
        cover: image("Cover picture (optional)", "posts"),
        coverAlt: fields.text({ label: "Describe the cover picture", description: "Needed whenever there is a cover." }),
        gallery: fields.array(
          fields.object({
            image: image("Photo", "posts"),
            alt: fields.text({ label: "Describe the photo", validation: { isRequired: true } }),
            caption: fields.text({ label: "Caption (optional)" }),
          }),
          { label: "Photos", itemLabel: (p) => p.fields.caption.value || p.fields.alt.value || "Photo" },
        ),
        draft: fields.checkbox({ label: "Draft (hidden from the site)", defaultValue: false }),
        body: body("Text"),
      },
    }),
  },
});
