import { StaticSquircle } from "@squircle-js/solid";

export function HeroImage(props: { src: string; alt: string }) {
  return (
    <StaticSquircle
      width={600}
      height={400}
      cornerRadius={32}
      cornerSmoothing={0.8}
      asChild
    >
      <img src={props.src} alt={props.alt} class="w-full h-full object-cover" />
    </StaticSquircle>
  );
}
