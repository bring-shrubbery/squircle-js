import { defineComponent, h, Teleport } from "vue";

const NOSCRIPT_INNER_HTML =
  '<style>[data-squircle] { clip-path: none !important; border-radius: attr(data-squircle) !important; }</style>';

export const SquircleNoScript = defineComponent({
  name: "SquircleNoScript",
  setup() {
    return () =>
      h(Teleport, { to: "head" }, [
        h("noscript", { innerHTML: NOSCRIPT_INNER_HTML }),
      ]);
  },
});
