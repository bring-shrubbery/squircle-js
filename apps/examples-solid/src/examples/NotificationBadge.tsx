import { Squircle } from "@squircle-js/solid";

export function Badge(props: { count: number }) {
  return (
    <Squircle
      class="min-w-[20px] bg-red-500 px-1.5 py-0.5 text-center font-bold text-white text-xs"
      cornerRadius={6}
      cornerSmoothing={0.6}
    >
      {props.count}
    </Squircle>
  );
}
