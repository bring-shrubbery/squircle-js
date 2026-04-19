import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { defineComponent } from "vue";
import { squircleDirective } from "../squircleDirective";

describe("squircleDirective", () => {
  it("applies clip-path on mount and cleans up on unmount", async () => {
    const Test = defineComponent({
      directives: { squircle: squircleDirective },
      template:
        '<div v-squircle="{ cornerRadius: 16, width: 100, height: 100 }">x</div>',
    });
    const wrapper = mount(Test);
    await wrapper.vm.$nextTick();
    const div = wrapper.element as HTMLDivElement;
    expect(div.style.clipPath).toContain("path(");
    expect(div.getAttribute("data-squircle")).toBe("16");
    wrapper.unmount();
  });
});
