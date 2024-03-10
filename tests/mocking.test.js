import { describe, expect, it, vi } from "vitest";

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
