const UTM_QUERY =
  "utm_source=squircle.js.org&utm_medium=footer&utm_campaign=quassum-footer";

/** Append the Quassum footer UTM parameters so Umami on the destination can attribute the visit. */
export const withQuassumUtm = (href: string) =>
  `${href}${href.includes("?") ? "&" : "?"}${UTM_QUERY}`;

export const QUASSUM = {
  name: "Quassum",
  href: "https://www.quassum.com",
  blurb: "a product studio in Vilnius that has shipped 25+ products",
};

export interface SiblingProduct {
  name: string;
  tagline: string;
  href: string;
}

/** Sibling Quassum products that fit this site's audience: frontend developers and designers. */
export const SIBLING_PRODUCTS: SiblingProduct[] = [
  {
    name: "Pluck",
    tagline: "Copy any component from any website",
    href: "https://www.pluck.so",
  },
  {
    name: "SVG to SwiftUI Converter",
    tagline: "Convert SVG paths to SwiftUI Shape code",
    href: "https://svg-to-swiftui.quassum.com",
  },
  {
    name: "Lucide Icons for SwiftUI",
    tagline: "More than 1,700 Lucide icons as native SwiftUI shapes",
    href: "https://github.com/bring-shrubbery/lucide-swift",
  },
];
