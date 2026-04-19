import { createApp, h } from "vue";
import ListOfSquircles from "../examples/ListOfSquircles.vue";
import "../styles.css";

const tags = [
  { id: "1", label: "Design" },
  { id: "2", label: "Vue" },
  { id: "3", label: "Squircle" },
  { id: "4", label: "iOS" },
  { id: "5", label: "Smooth" },
];

createApp({
  render: () => h(ListOfSquircles, { tags }),
}).mount("#app");
