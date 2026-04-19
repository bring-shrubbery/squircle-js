import { createApp, h } from "vue";
import AppIcon from "../examples/AppIcon.vue";
import "../styles.css";

createApp({
  render: () =>
    h("div", { class: "flex gap-6" }, [
      h(AppIcon, {
        src: "https://picsum.photos/seed/icon-1/120/120",
        name: "Photos",
      }),
      h(AppIcon, {
        src: "https://picsum.photos/seed/icon-2/120/120",
        name: "Notes",
      }),
      h(AppIcon, {
        src: "https://picsum.photos/seed/icon-3/120/120",
        name: "Weather",
      }),
    ]),
}).mount("#app");
