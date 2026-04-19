import { createApp, h } from "vue";
import NotificationBadge from "../examples/NotificationBadge.vue";
import "../styles.css";

createApp({
  render: () => h(NotificationBadge, { count: 7 }),
}).mount("#app");
