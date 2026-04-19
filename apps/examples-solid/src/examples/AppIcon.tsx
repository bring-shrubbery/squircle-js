import { StaticSquircle } from "@squircle-js/solid";

export function AppIcon(props: { src: string; name: string }) {
  return (
    <div class="flex flex-col items-center gap-1.5">
      <StaticSquircle
        asChild
        class="overflow-hidden"
        cornerRadius={13}
        cornerSmoothing={0.6}
        height={60}
        width={60}
      >
        <img alt={props.name} src={props.src} />
      </StaticSquircle>
      <span class="text-gray-700 text-xs">{props.name}</span>
    </div>
  );
}
