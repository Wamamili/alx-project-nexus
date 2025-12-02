Frontend Testing Guide

This document outlines the testing strategy for the frontend, covering unit, integration, and end-to-end testing to ensure a robust, reliable application.

Testing Types

Unit Tests

Test individual components or functions

Ensure small parts work in isolation

Integration Tests

Test multiple components or services together

Verify API calls and component interactions

End-to-End (E2E) Tests

Simulate real user workflows

Test the app from the browser perspective

Tools Used

Jest – Unit and integration tests

React Testing Library – Component behavior testing

Cypress – E2E tests

ESLint / Prettier – Enforce code quality rules

Unit Testing

Setup:

Create __tests__ folder inside each component or feature

Use Jest + React Testing Library

Example: testing a Button component

import { render, screen, fireEvent } from "@testing-library/react";
import Button from "../Button";

test("renders button with label", () => {
  render(<Button label="Click Me" />);
  expect(screen.getByText("Click Me")).toBeInTheDocument();
});

test("fires onClick event", () => {
  const handleClick = jest.fn();
  render(<Button label="Click" onClick={handleClick} />);
  fireEvent.click(screen.getByText("Click"));
  expect(handleClick).toHaveBeenCalledTimes(1);
});


Integration Testing

Test component + service layer interactions

Mock API responses using Jest or MSW (Mock Service Worker)

Example:

import { render, screen, waitFor } from "@testing-library/react";
import ProductsList from "../ProductsList";
import { ProductsService } from "../../services/products.service";

jest.mock("../../services/products.service");

test("displays products from API", async () => {
  ProductsService.getAll.mockResolvedValue({ data: [{ id: "1", name: "Shirt" }] });
  render(<ProductsList />);
  await waitFor(() => expect(screen.getByText("Shirt")).toBeInTheDocument());
});


End-to-End Testing

Use Cypress to simulate user workflows: login, browse products, checkout

Tests live against a deployed or local app

Example:

describe("Checkout flow", () => {
  it("adds product to cart and completes checkout", () => {
    cy.visit("/products");
    cy.get("[data-testid=add-to-cart]").first().click();
    cy.get("[data-testid=cart-button]").click();
    cy.get("[data-testid=checkout-button]").click();
    cy.url().should("include", "/checkout");
    cy.get("[data-testid=payment-submit]").click();
    cy.contains("Thank you for your order").should("exist");
  });
});


Test Coverage

Run coverage with Jest: npm run test -- --coverage

Aim for 80%+ coverage on critical components

Focus coverage on:
• Components rendering
• Service layer integration
• Forms and validation
• Routing behavior