import { render } from "solid-js/web";
import { Avatar } from "../examples/Avatar";
import "../styles.css";

render(
  () => (
    <Avatar src="https://i.pravatar.cc/96?img=5" alt="Avatar" size={96} />
  ),
  document.getElementById("app")!,
);
