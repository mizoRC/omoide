import { expect, test, describe } from "bun:test";
import { isImageFile, padMonth } from "../src/metadata";

describe("Metadata Utilities", () => {
  test("isImageFile identifies image extensions correctly", () => {
    expect(isImageFile("photo.jpg")).toBe(true);
    expect(isImageFile("photo.JPEG")).toBe(true);
    expect(isImageFile("image.png")).toBe(true);
    expect(isImageFile("archive.zip")).toBe(false);
    expect(isImageFile("document.pdf")).toBe(false);
    expect(isImageFile("no-extension")).toBe(false);
  });

  test("padMonth pads single digit months", () => {
    expect(padMonth(1)).toBe("01");
    expect(padMonth(9)).toBe("09");
    expect(padMonth(10)).toBe("10");
    expect(padMonth(12)).toBe("12");
  });
});
