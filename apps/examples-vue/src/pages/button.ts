import { createApp, h } from "vue";
import Button from "../examples/Button.vue";
import "../styles.css";

createApp({
  render: () => h(Button, { onClick: () => {} }, () => "Press me"),
}).mount("#app");
