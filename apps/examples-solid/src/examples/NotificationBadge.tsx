import { Squircle } from "@squircle-js/solid";

export function Badge(props: { count: number }) {
  return (
    <Squircle
      cornerRadius={6}
      cornerSmoothing={0.6}
      class="bg-red-500 px-1.5 py-0.5 text-white text-xs font-bold min-w-[20px] text-center"
    >
      {props.count}
    </Squircle>
  );
}
