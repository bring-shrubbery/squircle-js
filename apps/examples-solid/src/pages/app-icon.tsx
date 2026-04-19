import { render } from "solid-js/web";
import { AppIcon } from "../examples/AppIcon";
import "../styles.css";

render(
  () => (
    <div class="flex gap-6">
      <AppIcon name="Photos" src="https://picsum.photos/seed/icon-1/120/120" />
      <AppIcon name="Notes" src="https://picsum.photos/seed/icon-2/120/120" />
      <AppIcon name="Weather" src="https://picsum.photos/seed/icon-3/120/120" />
    </div>
  ),
  document.getElementById("app")!
);
