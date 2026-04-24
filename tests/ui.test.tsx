import React from "react";
import { render } from "ink-testing-library";
import { expect, test, describe } from "bun:test";
import { ProgressBar, YearStats, ErrorList } from "../src/ui";

describe("UI Component Units", () => {
  test("ProgressBar displays correct percentage and bar", () => {
    const { lastFrame } = render(<ProgressBar processed={5} total={10} />);
    const output = lastFrame();
    
    expect(output).toContain("50%");
    expect(output).toContain("5 / 10");
    // Half of 20 width is 10 '█' characters
    expect(output).toContain("██████████░░░░░░░░░░");
  });

  test("YearStats displays counts correctly", () => {
    const stats = {
      total: 10,
      processed: 10,
      byYear: new Map([[2023, 5], [2024, 5]]),
      errors: []
    };
    
    const { lastFrame } = render(<YearStats stats={stats} done={true} />);
    const output = lastFrame();
    
    expect(output).toContain("✔ 2023 → 5 fotos");
    expect(output).toContain("✔ 2024 → 5 fotos");
  });

  test("ErrorList displays errors correctly", () => {
    const errors = [
      { file: "pic1.jpg", error: "Corrupted" },
      { file: "pic2.jpg", error: "No date" }
    ];
    
    const { lastFrame } = render(<ErrorList errors={errors} />);
    const output = lastFrame();
    
    expect(output).toContain("⚠️ Errores (2)");
    expect(output).toContain("pic1.jpg: Corrupted");
    expect(output).toContain("pic2.jpg: No date");
  });

  test("ErrorList is empty when no errors", () => {
    const { lastFrame } = render(<ErrorList errors={[]} />);
    expect(lastFrame()).toBe("");
  });
});
