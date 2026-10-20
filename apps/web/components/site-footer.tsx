import Link from "next/link";
import { QUASSUM, SIBLING_PRODUCTS, withQuassumUtm } from "@/lib/quassum";

const linkClassName =
  "font-medium text-foreground/80 underline-offset-4 transition-colors hover:text-blue-600 hover:underline";

export const SiteFooter = ({ className }: { className?: string }) => {
  return (
    <footer
      className={`mx-auto px-6 pt-8 pb-12 text-muted-foreground text-sm ${className ?? "max-w-7xl"}`}
    >
      <div className="border-t pt-8">
        <p className="leading-7">
          {"Squircle.JS is built by "}
          <Link
            className={linkClassName}
            data-umami-event="click"
            data-umami-event-id="click_quassum_footer"
            data-umami-event-ref="quassum"
            href={withQuassumUtm(QUASSUM.href)}
            rel="noopener"
          >
            {QUASSUM.name}
          </Link>
          {`, ${QUASSUM.blurb}.`}
        </p>

        <ul className="mt-3 flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:gap-x-6">
          {SIBLING_PRODUCTS.map((product) => (
            <li key={product.href}>
              <Link
                className={linkClassName}
                data-umami-event="click"
                data-umami-event-id="click_quassum_footer"
                data-umami-event-ref={product.name}
                href={withQuassumUtm(product.href)}
                rel="noopener"
              >
                {product.name}
              </Link>
              {` · ${product.tagline}`}
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};
