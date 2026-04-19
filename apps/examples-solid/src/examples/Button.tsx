import { Squircle } from "@squircle-js/solid";

export function Button(props: { children: any; onClick?: () => void }) {
  return (
    <Squircle
      asChild
      class="bg-indigo-600 px-5 py-2.5 font-semibold text-sm text-white"
      cornerRadius={12}
      cornerSmoothing={0.6}
    >
      <button onClick={props.onClick} type="button">
        {props.children}
      </button>
    </Squircle>
  );
}
