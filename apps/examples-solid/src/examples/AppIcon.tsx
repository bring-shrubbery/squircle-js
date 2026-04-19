import { StaticSquircle } from "@squircle-js/solid";

export function AppIcon(props: { src: string; name: string }) {
  return (
    <div class="flex flex-col items-center gap-1.5">
      <StaticSquircle
        width={60}
        height={60}
        cornerRadius={13}
        cornerSmoothing={0.6}
        class="overflow-hidden"
        asChild
      >
        <img src={props.src} alt={props.name} />
      </StaticSquircle>
      <span class="text-xs text-gray-700">{props.name}</span>
    </div>
  );
}
