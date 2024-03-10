import { describe, expect, it, vi } from "vitest";
import { getPriceInCurrency, getShippingInfo } from "../src/mocking";
import { getExchangeRate } from "../src/libs/currency";
import { getShippingQuote } from "../src/libs/shipping";

vi.mock("../src/libs/currency");
vi.mock("../src/libs/shipping");

describe("test suite - mocking", () => {
  it("test case", () => {
    const greet = vi.fn();
    greet.mockReturnValue("hello");

    const result = greet();
    console.log(result);
  });

  it("test case - return promise", () => {
    const greet = vi.fn();
    greet.mockResolvedValue("hello"); // returns promise

    greet().then((result) => console.log(result));
  });

  it("test case - mock func with implementation", () => {
    const greet = vi.fn();
    greet.mockImplementation((name) => "hello " + name); // func body

    const result = greet("abhi");
    console.log(result);
  });

  it("test case - mock func with implementation", () => {
    const greet = vi.fn();
    greet.mockImplementation((name) => "hello " + name); // func body

    const result = greet("abhi");
    expect(greet).toHaveBeenCalled();
    expect(greet).toHaveBeenCalledWith("abhi");
    expect(greet).toHaveBeenCalledOnce();
  });
});

describe("test suite 2", () => {
  it("test case", () => {
    const sendText = vi.fn();
    sendText.mockReturnValue("ok");

    const result = sendText("message");

    expect(sendText).toHaveBeenCalledWith("message");
    expect(result).toBe("ok");
  });
});

describe("getPriceInCurrency", () => {
  it("should return price in target currency", () => {
    vi.mocked(getExchangeRate).mockReturnValue(1.5);

    const price = getPriceInCurrency(10, "AUD");

    expect(price).toBe(15);
  });
});

describe("getShippingInfo", () => {
  it("should return shipping unavailable if quote cannot be fetched", () => {
    vi.mocked(getShippingQuote).mockReturnValue(null);
    const result = getShippingInfo("London");
    expect(result).toMatch(/unavailable/i);
  });

  it("should return shipping info if quote can be fetched", () => {
    vi.mocked(getShippingQuote).mockReturnValue({ cost: 10, estimatedDays: 2 });
    const result = getShippingInfo("London");
    expect(result).toMatch("$10");
    expect(result).toMatch(/2 days/i);
  });
});
