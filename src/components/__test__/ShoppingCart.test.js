import { render, screen, within } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import ShoppingCart from "../Main/ShoppingCart";


const mockStore = configureStore([]);

describe("ShoppingCart", () => {
  let store;

  //set each mockStore to be:
  beforeEach(() => {
    store = mockStore({
      products: {
        cart: [
          { id: 1, name: "Product 1", quantity: 2, img: "image1.jpg" },
          { id: 2, name: "Product 2", quantity: 1, img: "image2.jpg" },
        ],
      },
    });
  });

  it("renders ShoppingCart component", () => {

    render(
      <Provider store={store}>
        <ShoppingCart />
      </Provider>
    );
    //We make sure its handling component renders
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("Product 2")).toBeInTheDocument();
  });

  it("renders shopping item for each component", () => {
    render(
      <Provider store={store}>
        <ShoppingCart />
      </Provider>
    );

    // we assign a testId to every shopping item
    const shoppingItems = screen.getAllByTestId("shopping-item");
    //we expect length to 2 rendered succesfully
    expect(shoppingItems).toHaveLength(2);
  });

  it("renders correct quantity for each item", () => {
    render(
      <Provider store={store}>
        <ShoppingCart />
      </Provider>
    );
    // we use within to ensure that the corresponding quantity relates to the correct  shopping item
    const quantity1 = screen.getByTestId("quantity-1");
    expect(within(quantity1).getByText("2")).toBeInTheDocument();
  
    const quantity2 = screen.getByTestId("quantity-2");
    expect(within(quantity2).getByText("1")).toBeInTheDocument();
  });
});