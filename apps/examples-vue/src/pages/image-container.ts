import { createApp, h } from "vue";
import ImageContainer from "../examples/ImageContainer.vue";
import "../styles.css";

createApp({
  render: () =>
    h(ImageContainer, {
      src: "https://picsum.photos/seed/squircle-hero/600/400",
      alt: "Hero image",
    }),
}).mount("#app");
