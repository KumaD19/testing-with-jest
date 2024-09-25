//Notes

/*Render: Renders component into virtual dom lets us test this way
 screen: lets us access rendered elements and lets us query them
 firevent: simulates clicks or inputs
 provider:allows for componets to access redux store
 configureStore: lets us create a mock redux

 rest are my action Creators that will be dispatched
*/

import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import ShoppingItem from "../Main/ShoppingCart/ShoppingItem";
import {
  incrementItem,
  decrementItem,
  deleteCart,
} from "../../state/products.slice";

//We create our mock Store
const mockStore = configureStore([]);

describe("ShoppingItem", () => {
  let store;

  //Makes a new mock store for each test
  beforeEach(() => {
    store = mockStore({});
  });

  /*increment action */
  it("calls incremention action when clicked", () => {
    /*Allows us to track calls to our dispatch*/
    const mockDispatch = jest.spyOn(store, "dispatch");

    //we render the component with access to the provider
    render(
      <Provider store={store}>
        <ShoppingItem id={1} name="Product 1" quantity={2} img="image1.jpg" />
      </Provider>
    );
    /*we simulate a click event on the button with + */

    fireEvent.click(screen.getByText("+"));
    /*verifies dispatch method is called with our id of 1 */
    expect(mockDispatch).toHaveBeenCalledWith(incrementItem(1));
  });

  it("Verifies our quantity ui is updated when incrementing", () => {
    store = mockStore({
      products: {
        items: [{ id: 1, quantity: 2 }],
      },
    });

    //We make sure ui is handling information correctly
    render(
      <Provider store={store}>
        <ShoppingItem id={1} name="Product 1" quantity={2} img="image1.jpg" />
      </Provider>
    );
    expect(screen.getByText("2")).toBeInTheDocument();

    fireEvent.click(screen.getByText("+"));
//Simulates update in redux and re render 
    store = mockStore({
        products:{
            items:[{id:1, quantity:3}]
        }
    })
    render(
        <Provider store={store}>
          <ShoppingItem id={1} name="Product 1" quantity={3} img="image1.jpg" />
        </Provider>
      );
    
      // We make sure it captures "the new ui re render"
      expect(screen.getByText("3")).toBeInTheDocument();

  });

  it("calls decrementAction when clicked", () => {
    const mockDispatch = jest.spyOn(store, "dispatch");

    render(
      <Provider store={store}>
        <ShoppingItem id={1} name="Product 1" quantity={2} img="image1.jpg" />
      </Provider>
    );

    fireEvent.click(screen.getByText("-"));
    expect(mockDispatch).toHaveBeenCalledWith(decrementItem(1));
  });

  it("calls deleteCart action when clicked", () => {
    const mockDispatch = jest.spyOn(store, "dispatch");

    render(
      <Provider store={store}>
        <ShoppingItem id={1} name="Product 1" quantity={2} img="image1.jpg" />
      </Provider>
    );

    fireEvent.click(screen.getByText("Delete Item"));
    expect(mockDispatch).toHaveBeenCalledWith(deleteCart(1));
  });
});
