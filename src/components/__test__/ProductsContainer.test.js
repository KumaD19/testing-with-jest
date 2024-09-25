import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ProductsContainer from '../Main/ProductsContainer';
import { fetchProducts } from '../../state/products.slice';
import { IDLE, LOADING, FAILED } from '../../state/status';


const mockStore = configureStore([]);

/*we mock fetchProducts */
jest.mock('../../state/products.slice', () => ({
  fetchProducts: jest.fn(),
}));

describe('ProductsContainer', () => {
  let store;

  /*We track actions that are dispatched */
  beforeEach(() => {
    store = mockStore({
      products: {
        products: [],
        status: IDLE,
      },
    });

 
    store.dispatch = jest.fn();
  });

  describe('when comoponent is mounted', () => {
    it('dispatches fetchProducts when status is idle', () => {
      render(
        <Provider store={store}>
          <ProductsContainer />
        </Provider>
      );


      expect(store.dispatch).toHaveBeenCalledWith(fetchProducts());
    });
  });

  describe('when products are ready', () => {
    it('renders products', () => {
      const mockProducts = [
        { id: 1, title: 'Product 1', price: 10, image: 'image1.jpg' },
        { id: 2, title: 'Product 2', price: 20, image: 'image2.jpg' },
      ];

      store = mockStore({
        products: {
          products: mockProducts,
          status: IDLE,
        },
      });

      render(
        <Provider store={store}>
          <ProductsContainer />
        </Provider>
      );

 
      mockProducts.forEach(product => {
        expect(screen.getByText(product.title)).toBeInTheDocument();
        expect(screen.getByText(`$${product.price}`)).toBeInTheDocument();
      });
    });
  });

  describe('when status is loading', () => {
    it('shows loading message', () => {
      store = mockStore({
        products: {
          products: [],
          status: LOADING,
        },
      });

      render(
        <Provider store={store}>
          <ProductsContainer />
        </Provider>
      );

      expect(screen.getByText('Loading products')).toBeInTheDocument();
    });
  });

  describe('when status is failed', () => {
    it('shows error message', () => {
      store = mockStore({
        products: {
          products: [],
          status: FAILED,
        },
      });

      render(
        <Provider store={store}>
          <ProductsContainer />
        </Provider>
      );

   
      expect(screen.getByText('Error loading products')).toBeInTheDocument();
    });
  });
});