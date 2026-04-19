import { render } from "solid-js/web";
import { TagList } from "../examples/ListOfSquircles";
import "../styles.css";

const tags = [
  { id: "1", label: "Design" },
  { id: "2", label: "Solid" },
  { id: "3", label: "Squircle" },
  { id: "4", label: "iOS" },
  { id: "5", label: "Smooth" },
];

render(() => <TagList tags={tags} />, document.getElementById("app")!);
