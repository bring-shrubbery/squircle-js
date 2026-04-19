import { createApp, h } from "vue";
import Avatar from "../examples/Avatar.vue";
import "../styles.css";

createApp({
  render: () =>
    h(Avatar, {
      src: "https://i.pravatar.cc/96?img=5",
      alt: "Avatar",
      size: 96,
    }),
}).mount("#app");
