import { describe, it, expect } from "vitest";
import { parseColorIds, stringifyColorIds } from "../shared/colors";

describe("Color Functions", () => {
  it("should parse color IDs from string", () => {
    const result = parseColorIds("1,2,3");
    expect(result).toEqual([1, 2, 3]);
  });

  it("should stringify color IDs", () => {
    const result = stringifyColorIds([1, 2, 3]);
    expect(result).toBe("1,2,3");
  });

  it("should handle empty string", () => {
    const result = parseColorIds("");
    expect(result).toEqual([]);
  });

  it("should handle null", () => {
    const result = parseColorIds(null);
    expect(result).toEqual([]);
  });

  it("should handle undefined", () => {
    const result = parseColorIds(undefined);
    expect(result).toEqual([]);
  });

  it("should filter invalid IDs", () => {
    const result = parseColorIds("1,2,999");
    expect(result).toEqual([1, 2]);
  });

  it("should roundtrip correctly", () => {
    const original = [1, 2, 3];
    const stringified = stringifyColorIds(original);
    const parsed = parseColorIds(stringified);
    expect(parsed).toEqual(original);
  });
});
