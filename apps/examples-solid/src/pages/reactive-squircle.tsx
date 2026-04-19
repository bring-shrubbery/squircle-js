import { render } from "solid-js/web";
import { Adjustable } from "../examples/ReactiveSquircle";
import "../styles.css";

render(() => <Adjustable />, document.getElementById("app")!);
