import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "../Header";

describe("Header Component", () => {
  it("should render the header with title 'STORE'", () => {
    render(<Header />);
    expect(screen.getByText('STORE')).toBeInTheDocument();
  });
});