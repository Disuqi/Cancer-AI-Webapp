import Home from "../src/app/page";
import RootLayout from "../src/app/layout";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe } from "node:test";

describe("Rendering", () => {
    it("renders home page", async () => {
      render(<Home />);
      const container = screen.getByTestId("model-cards-container");
      expect(container).toBeInTheDocument();
      expect(screen.getByText("Select a Cancer Detector")).toBeInTheDocument();
      await new Promise((r) => setTimeout(r, 2000));
      expect(container.childNodes.length).toBeGreaterThan(1);
    });
  });


describe("Authentication", () => 
{
  it("Open all auth modals", async () =>
  {
    render(<RootLayout />);
    const signInButton = screen.getByTestId("signin-button");
    expect(signInButton).toBeInTheDocument();

    fireEvent.click(signInButton);
    expect(screen.getByTestId("auth-modal")).toBeInTheDocument();
    expect(screen.getByTestId("signin-form")).toBeInTheDocument();

    const signUpButton = screen.getByTestId("signup-button");
    expect(signUpButton).toBeInTheDocument();

    fireEvent.click(signUpButton);
    expect(screen.getByTestId("signup-form")).toBeInTheDocument();

    const closeButton = screen.getByTestId("close-auth-modal");
    fireEvent.click(closeButton);
    expect(screen.queryByTestId("auth-modal")).not.toBeInTheDocument();
  });

  it("Sign in", async () =>
  {
    render(<RootLayout />);
    const signInButton = screen.getByTestId("signin-button");
    fireEvent.click(signInButton);

    const authModal = screen.getByTestId("auth-modal");
    expect(authModal).toBeInTheDocument();

    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("password-input");
    const submitButton = screen.getByTestId("submit-signin");

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: "test@email.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.click(submitButton);

    expect(authModal).not.toBeInTheDocument();
  })
});

