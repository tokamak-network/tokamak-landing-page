import { describe, it, expect } from "vitest";
import { sanitizeColor } from "../format";

describe("sanitizeColor", () => {
  it("accepts valid 3-digit hex", () => {
    expect(sanitizeColor("#abc")).toBe("#abc");
    expect(sanitizeColor("#FFF")).toBe("#FFF");
  });

  it("accepts valid 4-digit hex (with alpha)", () => {
    expect(sanitizeColor("#abcd")).toBe("#abcd");
  });

  it("accepts valid 6-digit hex", () => {
    expect(sanitizeColor("#7C3AED")).toBe("#7C3AED");
    expect(sanitizeColor("#000000")).toBe("#000000");
  });

  it("accepts valid 8-digit hex (with alpha)", () => {
    expect(sanitizeColor("#7C3AED80")).toBe("#7C3AED80");
  });

  it("rejects invalid lengths (5, 7 digits)", () => {
    expect(sanitizeColor("#12345")).toBe("#888");
    expect(sanitizeColor("#1234567")).toBe("#888");
  });

  it("rejects non-hex characters", () => {
    expect(sanitizeColor("#gggggg")).toBe("#888");
    expect(sanitizeColor("red")).toBe("#888");
  });

  it("rejects CSS injection attempts", () => {
    expect(sanitizeColor("red; position:absolute")).toBe("#888");
    expect(sanitizeColor("#000; background:url(x)")).toBe("#888");
    expect(sanitizeColor("")).toBe("#888");
  });

  it("uses custom fallback when provided", () => {
    expect(sanitizeColor("invalid", "#000")).toBe("#000");
  });
});
