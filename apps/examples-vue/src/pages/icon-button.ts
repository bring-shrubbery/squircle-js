import { createApp, h } from "vue";
import IconButton from "../examples/IconButton.vue";
import "../styles.css";

createApp({
  render: () =>
    h(
      IconButton,
      { label: "Search", onClick: () => {} },
      () =>
        h(
          "svg",
          {
            width: 18,
            height: 18,
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": 2,
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
          },
          [
            h("circle", { cx: 11, cy: 11, r: 8 }),
            h("path", { d: "m21 21-4.3-4.3" }),
          ],
        ),
    ),
}).mount("#app");
