import { getAllContent } from "@/lib/mdx";
import { QUASSUM, SIBLING_PRODUCTS, withQuassumUtm } from "@/lib/quassum";
import { SITECONFIG } from "@/lib/siteconfig";

export const dynamic = "force-static";

const HOST = SITECONFIG.hostname;

const FRAMEWORKS = [
  {
    name: "React",
    pkg: "@squircle-js/react",
    slug: "getting-started",
    note: "the original package; Squircle, StaticSquircle, SquircleNoScript and the asChild pattern",
  },
  {
    name: "Vue",
    pkg: "@squircle-js/vue",
    slug: "vue-getting-started",
    note: "Vue 3.3 or later; component, directive and composable APIs",
  },
  {
    name: "Svelte",
    pkg: "@squircle-js/svelte",
    slug: "svelte-getting-started",
    note: "Svelte 5; component and action APIs",
  },
  {
    name: "Solid",
    pkg: "@squircle-js/solid",
    slug: "solid-getting-started",
    note: "Solid.js; Squircle, StaticSquircle and the asChild pattern",
  },
];

const link = (title: string, url: string, description: string) =>
  `- [${title}](${url}): ${description}`;

export function GET() {
  const posts = getAllContent("blog");

  const lines = [
    "# Squircle.js",
    "",
    "> Squircle.js brings iOS-style squircles (continuously smooth corners, the shape Apple uses for app icons and Figma calls corner smoothing) to the web. CSS border-radius draws circular arcs, and the native corner-shape / superellipse() CSS is not yet widely supported, so each package uses figma-squircle to generate an SVG path for the element's measured size and applies it as a CSS clip-path. Available for React, Vue, Svelte and Solid. MIT licensed, open source, built by Antoni Silvestrovic at Quassum.",
    "",
    "## Docs",
    "",
    link(
      "Documentation",
      `${HOST}/docs`,
      "getting started, component reference, corner smoothing, no-JavaScript fallback and examples for every framework"
    ),
    "",
    "## Packages",
    "",
    ...FRAMEWORKS.map((framework) =>
      link(
        `${framework.name} (${framework.pkg})`,
        `${HOST}/docs/${framework.slug}`,
        framework.note
      )
    ),
    "",
    "## Blog",
    "",
    link(
      "Blog",
      `${HOST}/blog`,
      "articles about squircles, smooth corners, superellipses and UI design"
    ),
    ...posts.map((post) =>
      link(post.title, `${HOST}/blog/${post.slug}`, post.description)
    ),
    "",
    "## Source",
    "",
    link(
      "GitHub repository",
      SITECONFIG.githubLink,
      "monorepo with all four packages, examples and this site; issues and contributions welcome"
    ),
    "",
    "## Built by Quassum",
    "",
    link(
      QUASSUM.name,
      withQuassumUtm(QUASSUM.href),
      `Squircle.js is built by Quassum, ${QUASSUM.blurb}`
    ),
    ...SIBLING_PRODUCTS.map((product) =>
      link(product.name, withQuassumUtm(product.href), product.tagline)
    ),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
