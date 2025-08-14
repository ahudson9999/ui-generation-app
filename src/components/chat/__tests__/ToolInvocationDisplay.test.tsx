import { test, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationDisplay } from "../ToolInvocationDisplay";

afterEach(() => {
  cleanup();
});

// Helper function to create mock tool invocations
const createMockToolInvocation = (overrides = {}) => ({
  toolCallId: "test-id",
  toolName: "str_replace_editor",
  args: { command: "create", path: "/App.jsx" },
  state: "result",
  result: "Success",
  ...overrides,
});

test("ToolInvocationDisplay shows user-friendly message for str_replace_editor create command", () => {
  const toolInvocation = createMockToolInvocation({
    args: { command: "create", path: "/components/Button.jsx" },
  });

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("Creating Button.jsx")).toBeDefined();
  expect(screen.queryByText("str_replace_editor")).toBeNull();
});

test("ToolInvocationDisplay shows user-friendly message for str_replace_editor str_replace command", () => {
  const toolInvocation = createMockToolInvocation({
    args: { command: "str_replace", path: "/components/Card.jsx" },
  });

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("Editing Card.jsx")).toBeDefined();
});

test("ToolInvocationDisplay shows user-friendly message for str_replace_editor insert command", () => {
  const toolInvocation = createMockToolInvocation({
    args: { command: "insert", path: "/utils/helpers.js" },
  });

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("Updating helpers.js")).toBeDefined();
});

test("ToolInvocationDisplay shows user-friendly message for str_replace_editor view command", () => {
  const toolInvocation = createMockToolInvocation({
    args: { command: "view", path: "/README.md" },
  });

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("Reading README.md")).toBeDefined();
});

test("ToolInvocationDisplay shows user-friendly message for file_manager rename command", () => {
  const toolInvocation = createMockToolInvocation({
    toolName: "file_manager",
    args: {
      command: "rename",
      path: "/old-file.js",
      new_path: "/new-file.js",
    },
  });

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("Renaming old-file.js to new-file.js")).toBeDefined();
});

test("ToolInvocationDisplay shows user-friendly message for file_manager delete command", () => {
  const toolInvocation = createMockToolInvocation({
    toolName: "file_manager",
    args: { command: "delete", path: "/temp-file.js" },
  });

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("Deleting temp-file.js")).toBeDefined();
});

test("ToolInvocationDisplay shows loading state for in-progress tool", () => {
  const toolInvocation = createMockToolInvocation({
    state: "in-progress",
    result: null,
    args: { command: "create", path: "/App.jsx" },
  });

  const { container } = render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("Creating App.jsx...")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeDefined();
});

test("ToolInvocationDisplay shows completed state for finished tool", () => {
  const toolInvocation = createMockToolInvocation({
    state: "result",
    result: "Success",
    args: { command: "create", path: "/App.jsx" },
  });

  const { container } = render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("Creating App.jsx")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

test("ToolInvocationDisplay handles nested file paths correctly", () => {
  const toolInvocation = createMockToolInvocation({
    args: { command: "create", path: "/src/components/ui/Button.tsx" },
  });

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("Creating Button.tsx")).toBeDefined();
});

test("ToolInvocationDisplay handles JSON string args", () => {
  const toolInvocation = createMockToolInvocation({
    args: JSON.stringify({ command: "create", path: "/App.jsx" }),
  });

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("Creating App.jsx")).toBeDefined();
});

test("ToolInvocationDisplay handles unknown tool names gracefully", () => {
  const toolInvocation = createMockToolInvocation({
    toolName: "unknown_tool",
    args: { some: "args" },
  });

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("Using unknown_tool")).toBeDefined();
});

test("ToolInvocationDisplay handles unknown commands gracefully", () => {
  const toolInvocation = createMockToolInvocation({
    args: { command: "unknown_command", path: "/some-file.js" },
  });

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("Working on some-file.js")).toBeDefined();
});

test("ToolInvocationDisplay handles invalid JSON args gracefully", () => {
  const toolInvocation = createMockToolInvocation({
    args: "invalid json {",
  });

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("Using str_replace_editor")).toBeDefined();
});

test("ToolInvocationDisplay handles missing path gracefully", () => {
  const toolInvocation = createMockToolInvocation({
    args: { command: "create" }, // No path
  });

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("Creating file")).toBeDefined();
});

test("ToolInvocationDisplay handles empty path gracefully", () => {
  const toolInvocation = createMockToolInvocation({
    args: { command: "create", path: "" },
  });

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("Creating file")).toBeDefined();
});

test("ToolInvocationDisplay applies correct styling classes", () => {
  const toolInvocation = createMockToolInvocation();

  const { container } = render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  const displayElement = container.querySelector(".inline-flex");
  expect(displayElement?.className).toContain("items-center");
  expect(displayElement?.className).toContain("gap-2");
  expect(displayElement?.className).toContain("mt-2");
  expect(displayElement?.className).toContain("px-3");
  expect(displayElement?.className).toContain("py-1.5");
  expect(displayElement?.className).toContain("bg-neutral-50");
  expect(displayElement?.className).toContain("rounded-lg");
  expect(displayElement?.className).toContain("text-xs");
  expect(displayElement?.className).toContain("border");
  expect(displayElement?.className).toContain("border-neutral-200");
});

test("ToolInvocationDisplay shows correct icon for completed state", () => {
  const toolInvocation = createMockToolInvocation({
    state: "result",
    result: "Success",
  });

  const { container } = render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  const completedIcon = container.querySelector(".bg-emerald-500");
  expect(completedIcon?.className).toContain("w-2 h-2 rounded-full");
});

test("ToolInvocationDisplay shows loader icon for in-progress state", () => {
  const toolInvocation = createMockToolInvocation({
    state: "in-progress",
    result: null,
  });

  const { container } = render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  // Check that loader icon exists
  const loaderIcon = container.querySelector(".animate-spin");
  expect(loaderIcon).toBeDefined();
  
  // Check for the Loader2 component (Lucide icon)
  const loader2Component = container.querySelector("svg");
  expect(loader2Component).toBeDefined();
});