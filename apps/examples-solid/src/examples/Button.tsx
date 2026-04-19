import { Squircle } from "@squircle-js/solid";

export function Button(props: { children: any; onClick?: () => void }) {
  return (
    <Squircle
      cornerRadius={12}
      cornerSmoothing={0.6}
      class="bg-indigo-600 px-5 py-2.5 text-white font-semibold text-sm"
      asChild
    >
      <button type="button" onClick={props.onClick}>
        {props.children}
      </button>
    </Squircle>
  );
}
