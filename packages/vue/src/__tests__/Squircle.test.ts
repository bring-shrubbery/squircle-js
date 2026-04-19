import { render } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import Squircle from "../Squircle.vue";

describe("Squircle", () => {
  it("renders slot content", () => {
    const { getByText } = render(Squircle, {
      props: { cornerRadius: 16 },
      slots: { default: "hello" },
    });
    expect(getByText("hello")).toBeTruthy();
  });

  it("forwards class attribute", () => {
    const { container } = render(Squircle, {
      props: { cornerRadius: 16 },
      attrs: { class: "my-card" },
      slots: { default: "x" },
    });
    const div = container.firstElementChild as HTMLDivElement;
    expect(div.classList.contains("my-card")).toBe(true);
  });
});
