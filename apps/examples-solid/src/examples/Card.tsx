import { Squircle } from "@squircle-js/solid";

export function Card(props: { title: string; body: string }) {
  return (
    <Squircle
      class="space-y-2 bg-white p-6 shadow-md"
      cornerRadius={20}
      cornerSmoothing={0.6}
    >
      <h3 class="font-semibold text-lg">{props.title}</h3>
      <p class="text-gray-600 text-sm">{props.body}</p>
    </Squircle>
  );
}
