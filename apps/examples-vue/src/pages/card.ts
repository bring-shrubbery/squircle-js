import { createApp, h } from "vue";
import Card from "../examples/Card.vue";
import "../styles.css";

createApp({
  render: () =>
    h(Card, {
      title: "Smooth corners",
      body: "A responsive card clipped with a squircle — the shape adapts to any content width.",
    }),
}).mount("#app");
