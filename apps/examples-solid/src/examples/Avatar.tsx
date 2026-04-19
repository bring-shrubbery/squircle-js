import { StaticSquircle } from "@squircle-js/solid";

export function Avatar(props: { src: string; alt: string; size?: number }) {
  const size = () => props.size ?? 48;
  return (
    <StaticSquircle
      asChild
      class="shrink-0 overflow-hidden"
      cornerRadius={Math.round(size() * 0.25)}
      cornerSmoothing={0.6}
      height={size()}
      width={size()}
    >
      <img alt={props.alt} class="h-full w-full object-cover" src={props.src} />
    </StaticSquircle>
  );
}
