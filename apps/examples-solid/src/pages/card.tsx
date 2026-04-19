import { render } from "solid-js/web";
import { Card } from "../examples/Card";
import "../styles.css";

render(
  () => (
    <Card
      title="Smooth corners"
      body="A responsive card clipped with a squircle — the shape adapts to any content width."
    />
  ),
  document.getElementById("app")!,
);
