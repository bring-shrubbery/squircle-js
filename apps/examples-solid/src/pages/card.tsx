import { render } from "solid-js/web";
import { Card } from "../examples/Card";
import "../styles.css";

render(
  () => (
    <Card
      body="A responsive card clipped with a squircle — the shape adapts to any content width."
      title="Smooth corners"
    />
  ),
  document.getElementById("app")!
);
