import { Motion } from "@motionone/solid";
import { Squircle } from "@squircle-js/solid";

export function AnimatedCard(props: { children: any }) {
  return (
    <Squircle
      cornerRadius={20}
      cornerSmoothing={0.6}
      class="bg-gradient-to-br from-violet-500 to-indigo-600 p-6"
      asChild
    >
      <Motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {props.children}
      </Motion.div>
    </Squircle>
  );
}
