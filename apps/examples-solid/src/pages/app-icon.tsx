import { render } from "solid-js/web";
import { AppIcon } from "../examples/AppIcon";
import "../styles.css";

render(
  () => (
    <div class="flex gap-6">
      <AppIcon src="https://picsum.photos/seed/icon-1/120/120" name="Photos" />
      <AppIcon src="https://picsum.photos/seed/icon-2/120/120" name="Notes" />
      <AppIcon src="https://picsum.photos/seed/icon-3/120/120" name="Weather" />
    </div>
  ),
  document.getElementById("app")!,
);
