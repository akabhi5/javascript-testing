import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getPriceInCurrency,
  getShippingInfo,
  login,
  renderPage,
  signUp,
  submitOrder,
} from "../src/mocking";
import { getExchangeRate } from "../src/libs/currency";
import { getShippingQuote } from "../src/libs/shipping";
import { trackPageView } from "../src/libs/analytics";
import { charge } from "../src/libs/payment";
import { sendEmail } from "../src/libs/email";
import security from "../src/libs/security";

vi.mock("../src/libs/currency");
vi.mock("../src/libs/shipping");
vi.mock("../src/libs/analytics");
vi.mock("../src/libs/payment");

// mocking just a single func: sendEmail
vi.mock("../src/libs/email", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    sendEmail: vi.fn(),
  };
});

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

describe("renderPage", () => {
  it("should render correct content", async () => {
    const result = await renderPage();

    expect(result).toMatch(/content/i);
  });

  it("should call analytics", async () => {
    await renderPage();

    expect(trackPageView).toHaveBeenCalledWith("/home");
  });
});

describe("submitOrder", () => {
  const order = { totalAmount: 10 };
  const creditCard = { creditCardNumber: "1234" };
  it("should charge the customer", async () => {
    vi.mocked(charge).mockResolvedValue({ status: "success" });

    await submitOrder(order, creditCard);

    expect(charge).toHaveBeenCalledWith(creditCard, order.totalAmount);
  });

  it("should return success if payment is successful", async () => {
    vi.mocked(charge).mockResolvedValue({ status: "success" });

    const result = await submitOrder(order, creditCard);

    expect(result).toEqual({ success: true });
  });

  it("should return success if payment is not successful", async () => {
    vi.mocked(charge).mockResolvedValue({ status: "failed" });

    const result = await submitOrder(order, creditCard);

    expect(result).toEqual({ success: false, error: "payment_error" });
  });
});

describe("signUp", () => {
  const email = "a@a.com";

  // can be configured in vitest.config.js
  //   beforeEach(() => {
  // clearing mock for a func
  // vi.mocked(sendEmail).mockClear();
  // clearing mock for all
  // vi.clearAllMocks()
  //   });

  it("should return false if email is invalid", async () => {
    const result = await signUp("a");

    expect(result).toBe(false);
  });

  it("should return true if email is valid", async () => {
    const result = await signUp(email);

    expect(result).toBe(true);
  });

  it("should send the welcome email if email is valid", async () => {
    const result = await signUp(email);

    expect(sendEmail).toHaveBeenCalledOnce();
    const args = vi.mocked(sendEmail).mock.calls[0];
    expect(args[0]).toBe(email);
    expect(args[1]).toMatch(/welcome/i);
  });
});

describe("login", () => {
  const email = "a@a.com";
  it("should email the one-time login code", async () => {
    const spy = vi.spyOn(security, "generateCode");

    await login(email);

    const code = spy.mock.results[0].value.toString();
    expect(sendEmail).toHaveBeenCalledWith(email, code);
  });
});
