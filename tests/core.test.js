import { describe, expect, it } from "vitest";
import { calculateDiscount, getCoupons } from "../src/core";

describe("test suite", () => {
  it("test case", () => {
    const result = { name: "Abhi" };
    expect(result).toEqual({ name: "Abhi" });
  });
});

describe("test suite", () => {
  it("test case", () => {
    const result = { id: 1, name: "Abhi" };
    expect(result).toMatchObject({ name: "Abhi" });
    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("name", "Abhi");
    expect(typeof result.name).toBe("string");
  });
});

describe("test suite2", () => {
  it("test case2", () => {
    const result = "The requested file was not found!";
    // BAD
    // expect(result).toBeDefined(); - LOOSE
    // expect(result).toEqual("The requested file was not found!"); - TIGHT

    // GOOD
    expect(result).toMatch(/not found/i);
  });
});

describe("test suite3", () => {
  it("test case3", () => {
    const result = [3, 1, 2];
    expect(result).toEqual(expect.arrayContaining([1, 2, 3]));
    expect(result).toHaveLength(3);
    expect(result.length).toBeGreaterThan(0);
  });
});

// actual core.js test

describe("getCoupons", () => {
  it("should return an array of coupons", () => {
    const coupons = getCoupons();

    expect(Array.isArray(coupons)).toBeTruthy();
    expect(coupons.length).toBeGreaterThan(0);
  });

  it("should return an array with valid coupon codes", () => {
    const coupons = getCoupons();
    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty("code");
      expect(typeof coupon.code).toBe("string");
      expect(coupon.code).toBeTruthy();
    });
  });

  it("should return an array with valid coupon discounts", () => {
    const coupons = getCoupons();
    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty("discount");
      expect(typeof coupon.discount).toBe("number");
      expect(coupon.discount).toBeGreaterThan(0);
      expect(coupon.discount).toBeLessThan(1);
    });
  });
});

describe("calculateDiscount", () => {
  it("should return discounted price if given valid code", () => {
    expect(calculateDiscount(10, "SAVE10")).toBe(9);
  });
});
