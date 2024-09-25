import React from "react";
import { render, screen } from "@testing-library/react";
import Main from "../Main";

describe("Main Component", () => {
  it("should render child components", () => {
    render(<Main />);

    expect(screen.getByTestId('ProductsContainer')).toBeInTheDocument();
    expect(screen.getByTestId('ShoppingCart')).toBeInTheDocument();
  });
});