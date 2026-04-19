import { render } from "solid-js/web";
import { HeroImage } from "../examples/ImageContainer";
import "../styles.css";

render(
  () => (
    <HeroImage
      alt="Hero image"
      src="https://picsum.photos/seed/squircle-hero/600/400"
    />
  ),
  document.getElementById("app")!
);
