// components/button/button.test.js
import { describe, it, expect } from "vitest";
import { CoolButton } from "./button.js";

describe("CoolButton", () => {
  it("renders with correct title", () => {
    const button = new CoolButton({ title: "Test Button" });
    expect(button.label).toBe("Test Button");
  });

  it("dispatches click event", async () => {
    const button = new CoolButton({ title: "Test Button" });
    let clicked = false;
    button.onDidClick.addListener(() => (clicked = true));
    button._button.click();
    expect(clicked).toBe(true);
  });
});
