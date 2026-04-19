import { render } from "solid-js/web";
import { Avatar } from "../examples/Avatar";
import "../styles.css";

render(
  () => <Avatar alt="Avatar" size={96} src="https://i.pravatar.cc/96?img=5" />,
  document.getElementById("app")!
);
