import productsReducer, {
  addCart,
  deleteCart,
  incrementItem,
  decrementItem,
  fetchProducts,
} from "../../state/products.slice";
import axios from "axios";
import { configureStore } from "@reduxjs/toolkit";

/*Axios mock simulate api calls*/
jest.mock("axios");

describe("productsSlice", () => {
  it("should add an item to the cart", () => {
    
    const initialState = {
      cart: [],
      products: [],
      status: "idle",
      error: null,
    };
/*We use addCart function and pass the following parameters*/
    const action = addCart({ id: 1, name: "Product 1", price: 10 });
    /* We pass the action and initial state if logic is correct our empty cart should 
    now have that object inside of it*/
    const newState = productsReducer(initialState, action);

    expect(newState.cart).toEqual([
      { id: 1, name: "Product 1", price: 10, quantity: 1 },
    ]);
  });

  it("should increase quantity of item is already in cart", () => {
    const initialState = {
      cart: [{ id: 1, name: "Product 1", quantity: 2, price: 10 }],
      products: [],
      status: "idle",
      error: null,
    };
    /*If object is already in cart then it should only update the quantity*/
    const action = addCart({ id: 1, name: "Product 1", price: 10 });
    const newState = productsReducer(initialState, action);
    expect(newState.cart[0].quantity).toBe(3);
  });

  describe("IncrementItem", () => {
    it("should increment the quantity of an item in the cart with +", () => {
      const initialState = {
        cart: [{ id: 1, name: "Product 1", quantity: 2, price: 10 }],
        products: [],
        status: "idle",
        error: null,
      };

      /*Handles our increment if it has the matching id then it only upadtes the 
      quantity*/
      const action = incrementItem(1);
      const newState = productsReducer(initialState, action);

      expect(newState.cart[0].quantity).toBe(3);
    });

    it("Should not increment quantity if item doesnt exist", () => {
      const initialState = {
        cart: [{ id: 1, name: "Product 1", quantity: 2, price: 10 }],
        products: [],
        status: "idle",
        error: null,
      };
      /*If item does not exist in cart should return 
      initial state intact*/
      const action = incrementItem(2);
      const newState = productsReducer(initialState, action);
      expect(newState).toEqual(initialState);
    });
  });

  describe("DecrementItem", () => {
    it("should decrement quantity of an item in the cart", () => {
      const initialState = {
        cart: [{ id: 1, name: "Product 1", quantity: 2, price: 10 }],
        products: [],
        status: "idle",
        error: null,
      };

      /*removes 1 quantity from an item in cart */
      const action = decrementItem(1);
      const newState = productsReducer(initialState, action);
      expect(newState.cart[0].quantity).toBe(1);
    });

    it("should remove item from cart if quantity is 0", () => {
      const initialState = {
        cart: [{ id: 1, name: "Product 1", quantity: 1, price: 10 }],
        products: [],
        status: "idle",
        error: null,
      };
      /*if quantity is 1 and it subtracts it from cart should be removed*/
      const action = decrementItem(1);
      const newState = productsReducer(initialState, action);
      expect(newState.cart).toEqual([]);
    });

    it("should not decrement value if it does not exist" ,() =>{
        const initialState = {
            cart: [{ id: 1, name: "Product 1", quantity: 2, price: 10 }],
            products: [],
            status: "idle",
            error: null,
          };
          const action = decrementItem(2);
          const newState = productsReducer(initialState, action);
          expect(newState).toEqual(initialState);

    })
  });

  it("should remove an item from the cart", () => {
    const initialState = {
      cart: [
        { id: 1, name: "Product 1", quantity: 2, price: 10 },
        { id: 2, name: "Product 2", quantity: 1, price: 20 },
      ],
      products: [],
      status: "idle",
      error: null,
    };

    /* handles our delete cart item logic removes it from our object state*/
    const action = deleteCart(1);
    const newState = productsReducer(initialState, action);

    expect(newState.cart).toEqual([
      { id: 2, name: "Product 2", quantity: 1, price: 20 },
    ]);
  });

  describe("fetchProducts", () => {
    let store;

    beforeEach(() => {
      store = configureStore({
        reducer: {
          products: productsReducer,
        },
      });
    });

    it("should handle pending state", () => {
      store.dispatch(fetchProducts.pending());
      const state = store.getState().products;
      expect(state.status).toBe("loading");
      expect(state.error).toBeNull();
    });

    it("should fetch products successfully", async () => {
      const mockProducts = [
        { id: 1, name: "Product 1", price: 10 },
        { id: 2, name: "Product 2", price: 20 },
      ];

      axios.get.mockResolvedValue({ data: mockProducts });

      await store.dispatch(fetchProducts());
      /*our mock products should be in our state */
      const state = store.getState().products;
      expect(state.status).toBe("succeeded");
      expect(state.products).toEqual(mockProducts);
      expect(state.error).toBeNull();
    });

    it("should handle fetch products failure", async () => {
      const errorMessage = "Network Error";
      axios.get.mockRejectedValue(new Error(errorMessage));

      await store.dispatch(fetchProducts());

      const state = store.getState().products;
      expect(state.status).toBe("failed");
      expect(state.error).toBe(errorMessage);
    });
  });
});
