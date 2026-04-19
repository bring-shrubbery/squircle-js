import type { Component } from "solid-js";
import { render } from "solid-js/web";
import { IconButton } from "../examples/IconButton";
import "../styles.css";

const SearchIcon: Component<{ class?: string }> = (props) => (
  <svg
    class={props.class}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

render(
  () => <IconButton icon={SearchIcon} label="Search" onClick={() => {}} />,
  document.getElementById("app")!,
);
