import { render } from "solid-js/web";
import { AnimatedCard } from "../examples/MotionCard";
import "../styles.css";

render(
  () => (
    <AnimatedCard>
      <h3 class="font-semibold text-lg text-white">Smooth corners</h3>
      <p class="text-sm text-white/80">Animating in from below.</p>
    </AnimatedCard>
  ),
  document.getElementById("app")!,
);
