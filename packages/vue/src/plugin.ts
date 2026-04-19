import type { Plugin } from "vue";
import Squircle from "./Squircle.vue";
import { SquircleNoScript } from "./SquircleNoScript";
import { squircleDirective } from "./squircleDirective";
import StaticSquircle from "./StaticSquircle.vue";
import { staticSquircleDirective } from "./staticSquircleDirective";

export const SquirclePlugin: Plugin = {
  install(app) {
    app.component("Squircle", Squircle);
    app.component("StaticSquircle", StaticSquircle);
    app.component("SquircleNoScript", SquircleNoScript);
    app.directive("squircle", squircleDirective);
    app.directive("static-squircle", staticSquircleDirective);
  },
};
