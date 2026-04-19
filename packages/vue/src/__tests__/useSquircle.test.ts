import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { defineComponent, h, ref } from "vue";
import { useSquircle } from "../useSquircle";

describe("useSquircle", () => {
  it("applies clip-path on mount when width and height are provided", async () => {
    const TestComponent = defineComponent({
      setup() {
        const el = ref<HTMLDivElement | null>(null);
        useSquircle(el, { cornerRadius: 16, width: 100, height: 100 });
        return () => h("div", { ref: el }, "x");
      },
    });
    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();
    const div = wrapper.element as HTMLDivElement;
    expect(div.style.clipPath).toContain("path(");
    expect(div.getAttribute("data-squircle")).toBe("16");
    wrapper.unmount();
  });
});
