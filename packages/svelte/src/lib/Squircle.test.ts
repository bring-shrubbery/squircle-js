import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Squircle from "./Squircle.svelte";

describe("Squircle", () => {
  test("renders a div with data-squircle and a path() clip-path", () => {
    const { container } = render(Squircle, {
      props: {
        cornerRadius: 16,
        defaultWidth: 100,
        defaultHeight: 100,
      },
    });

    const el = container.firstElementChild as HTMLElement;
    expect(el).not.toBeNull();
    expect(el.tagName).toBe("DIV");
    expect(el.getAttribute("data-squircle")).toBe("16");
    expect(el.style.clipPath.startsWith("path(")).toBe(true);
  });
});
