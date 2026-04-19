import { render } from "solid-js/web";
import { Button } from "../examples/Button";
import "../styles.css";

render(
  () => <Button onClick={() => {}}>Press me</Button>,
  document.getElementById("app")!
);
