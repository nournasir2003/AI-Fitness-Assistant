import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MessageBubble from "./MessageBubble";

describe("MessageBubble", () => {
  it("displays the user's message", () => {
    render(
      <MessageBubble role="user" parts={[{ type: "text", text: "Hello" }]} />,
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("displays the assistant's message", () => {
    render(
      <MessageBubble
        role="assistant"
        parts={[{ type: "text", text: "Hi there!" }]}
      />,
    );
    expect(screen.getByText("Hi there!")).toBeInTheDocument();
  });
});
