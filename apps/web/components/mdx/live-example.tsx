type Framework = "vue" | "svelte" | "solid";

const BASE_URLS: Record<Framework, string> = {
  vue:
    process.env.NEXT_PUBLIC_EXAMPLES_VUE_URL ??
    "https://squircle-examples-vue.vercel.app",
  svelte:
    process.env.NEXT_PUBLIC_EXAMPLES_SVELTE_URL ??
    "https://squircle-examples-svelte.vercel.app",
  solid:
    process.env.NEXT_PUBLIC_EXAMPLES_SOLID_URL ??
    "https://squircle-examples-solid.vercel.app",
};

interface LiveExampleProps {
  framework: Framework;
  example: string;
  height: number;
  title?: string;
}

export const LiveExample = ({
  framework,
  example,
  height,
  title,
}: LiveExampleProps) => {
  const src = `${BASE_URLS[framework]}/${example}.html`;
  const iframeTitle = title ?? `${framework} ${example} example`;

  return (
    <figure className="my-6 overflow-hidden rounded-xl border border-border bg-muted/30">
      <iframe
        className="block w-full border-0"
        height={height}
        loading="lazy"
        referrerPolicy="no-referrer"
        sandbox="allow-scripts"
        src={src}
        title={iframeTitle}
        width="100%"
      />
      {title ? (
        <figcaption className="px-3 py-2 text-muted-foreground text-xs">
          {title}
        </figcaption>
      ) : null}
    </figure>
  );
};
