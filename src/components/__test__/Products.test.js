// Products.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Products from "../Main/ProductsContainer/Products";
import { addCart } from "../../state/products.slice";

const mockStore = configureStore([]);

describe("Products Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      products: { cart: [] }, 
    });


    store.dispatch = jest.fn();
  });

  test("renders product details", () => {
    const product = {
      name: "Test Product",
      price: 20,
      id: 1,
      img: "test-image.jpg",
    };

    render(
      <Provider store={store}>
        <Products {...product} />
      </Provider>
    );

 
    expect(screen.getByText(product.name)).toBeInTheDocument();
    expect(screen.getByText(`$${product.price}`)).toBeInTheDocument();
    expect(screen.getByAltText(product.name)).toBeInTheDocument();
  });

  test("dispatches addCart action on button click", () => {
    const product = {
      name: "Test Product",
      price: 20,
      id: 1,
      img: "test-image.jpg",
    };

    render(
      <Provider store={store}>
        <Products {...product} />
      </Provider>
    );


    fireEvent.click(screen.getByText(/Add To Cart/i));

   
    expect(store.dispatch).toHaveBeenCalledWith(
      addCart({
        name: product.name,
        id: product.id,
        img: product.img,
        quantity: 1,
      })
    );
  });
});
