import { Motion } from "@motionone/solid";
import { Squircle } from "@squircle-js/solid";

export function AnimatedCard(props: { children: any }) {
  return (
    <Squircle
      asChild
      class="bg-gradient-to-br from-violet-500 to-indigo-600 p-6"
      cornerRadius={20}
      cornerSmoothing={0.6}
    >
      <Motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.3 }}
      >
        {props.children}
      </Motion.div>
    </Squircle>
  );
}
