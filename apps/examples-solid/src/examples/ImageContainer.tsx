import { StaticSquircle } from "@squircle-js/solid";

export function HeroImage(props: { src: string; alt: string }) {
  return (
    <StaticSquircle
      asChild
      cornerRadius={32}
      cornerSmoothing={0.8}
      height={400}
      width={600}
    >
      <img alt={props.alt} class="h-full w-full object-cover" src={props.src} />
    </StaticSquircle>
  );
}
