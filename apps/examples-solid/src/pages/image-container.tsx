import { render } from "solid-js/web";
import { HeroImage } from "../examples/ImageContainer";
import "../styles.css";

render(
  () => (
    <HeroImage
      src="https://picsum.photos/seed/squircle-hero/600/400"
      alt="Hero image"
    />
  ),
  document.getElementById("app")!,
);
