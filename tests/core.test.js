import { describe, expect, it } from "vitest";
import {
  calculateDiscount,
  canDrive,
  getCoupons,
  isPriceInRange,
  isValidUsername,
  validateUserInput,
} from "../src/core";

describe("test suite", () => {
  it("test case", () => {
    const result = { name: "Abhi" };
    expect(result).toEqual({ name: "Abhi" });
  });
});

describe("test suite2", () => {
  it("test case2", () => {
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
    expect(calculateDiscount(10, "SAVE20")).toBe(8);
  });

  it("should handle non-numeric price", () => {
    expect(calculateDiscount("10", "SAVE10")).toMatch(/invalid/i);
  });

  it("should handle invalid discount code", () => {
    expect(calculateDiscount(10, "INVALID")).toBe(10);
  });
});

describe("validateUserInput", () => {
  it("should return success if given valid input", () => {
    expect(validateUserInput("abhi", 27)).toMatch(/success/i);
  });

  it("should return an error if username is not a string", () => {
    expect(validateUserInput(1, 27)).toMatch(/invalid/i);
  });

  it("should return an error if username is less than 3 chars", () => {
    expect(validateUserInput("a", 27)).toMatch(/invalid/i);
  });

  it("should return an error if age is not a number", () => {
    expect(validateUserInput("abhi", "27")).toMatch(/invalid/i);
  });

  it("should return an error if age is less than 18", () => {
    expect(validateUserInput("abhi", 17)).toMatch(/invalid/i);
  });

  it("should return an error if age is greater than 100", () => {
    expect(validateUserInput("abhi", 101)).toMatch(/invalid/i);
  });

  it("should return an error if both username and age is invalid", () => {
    expect(validateUserInput("", 0)).toMatch(/invalid username/i);
    expect(validateUserInput("", 0)).toMatch(/invalid age/i);
  });
});

describe("isPriceInRange", () => {
  it("should return false when the price is outside the range", () => {
    expect(isPriceInRange(-10, 0, 100)).toBe(false);
    expect(isPriceInRange(200, 0, 100)).toBe(false);
  });

  it("should return true when the price is equal to min and max range", () => {
    expect(isPriceInRange(0, 0, 100)).toBe(true);
    expect(isPriceInRange(100, 0, 100)).toBe(true);
  });

  it("should return true when the price is within range", () => {
    expect(isPriceInRange(50, 0, 100)).toBe(true);
  });
});

describe("isValidUsername", () => {
  const minLength = 5;
  const maxLength = 15;

  it("should return false if username is too short", () => {
    expect(isValidUsername("a".repeat(minLength - 1))).toBe(false);
  });

  it("should return false if username is too long", () => {
    expect(isValidUsername("a".repeat(maxLength + 1))).toBe(false);
  });

  it("should return true if username is at min or max length", () => {
    expect(isValidUsername("a".repeat(minLength))).toBe(true);
    expect(isValidUsername("a".repeat(maxLength))).toBe(true);
  });

  it("should return true if username within length constraint", () => {
    expect(isValidUsername("a".repeat(minLength + 1))).toBe(true);
    expect(isValidUsername("a".repeat(maxLength - 1))).toBe(true);
  });

  it("should return false for invalid input type", () => {
    expect(isValidUsername(null)).toBe(false);
    expect(isValidUsername(undefined)).toBe(false);
    expect(isValidUsername(1)).toBe(false);
  });
});

describe("canDrive", () => {
  it("should return error for invalid country code", () => {
    expect(canDrive(20, "FR")).toMatch(/invalid/i);
  });

  it("should return false for underage in US", () => {
    expect(canDrive(15, "US")).toBe(false);
  });

  it("should return true for min age in US", () => {
    expect(canDrive(16, "US")).toBe(true);
  });

  it("should return true for eligible in US", () => {
    expect(canDrive(17, "US")).toBe(true);
  });

  it("should return false for underage in UK", () => {
    expect(canDrive(15, "UK")).toBe(false);
  });

  it("should return true for min age in UK", () => {
    expect(canDrive(17, "UK")).toBe(true);
  });

  it("should return true for eligible in UK", () => {
    expect(canDrive(18, "UK")).toBe(true);
  });
});
