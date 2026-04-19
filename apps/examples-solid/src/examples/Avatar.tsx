import { StaticSquircle } from "@squircle-js/solid";

export function Avatar(props: { src: string; alt: string; size?: number }) {
  const size = () => props.size ?? 48;
  return (
    <StaticSquircle
      width={size()}
      height={size()}
      cornerRadius={Math.round(size() * 0.25)}
      cornerSmoothing={0.6}
      class="overflow-hidden shrink-0"
      asChild
    >
      <img src={props.src} alt={props.alt} class="w-full h-full object-cover" />
    </StaticSquircle>
  );
}
