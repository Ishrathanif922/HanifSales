"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from "react";
import { User, Cart, Product } from "@/types";
import { authAPI, cartAPI } from "@/services";

interface AppState {
  user: User | null;
  cart: Cart;
  isLoading: boolean;
  isCartLoaded: boolean;
}

type AppAction =
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_CART"; payload: Cart }
  | { type: "ADD_TO_CART_ITEM"; payload: { product: Product; quantity: number } }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "UPDATE_CART_ITEM"; payload: { itemId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_CART_LOADED"; payload: boolean };

const initialState: AppState = {
  user: null,
  cart: { items: [], total: 0 },
  isLoading: true,
  isCartLoaded: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_CART":
      return { ...state, cart: action.payload, isCartLoaded: true };
    case "CLEAR_CART":
      return { ...state, cart: { items: [], total: 0 } };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_CART_LOADED":
      return { ...state, isCartLoaded: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  refreshUser: () => Promise<void>;
  refreshCart: () => Promise<void>;
}>({
  state: initialState,
  dispatch: () => null,
  refreshUser: async () => {},
  refreshCart: async () => {},
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await authAPI.getMe();
      dispatch({ type: "SET_USER", payload: data.data || null });
    } catch {
      dispatch({ type: "SET_USER", payload: null });
    }
  }, []);

  const refreshCart = useCallback(async () => {
    try {
      if (!state.user) {
        dispatch({ type: "SET_CART", payload: { items: [], total: 0 } });
        dispatch({ type: "SET_LOADING", payload: false });
        return;
      }
      const { data } = await cartAPI.getCart();
      dispatch({ type: "SET_CART", payload: data.data || { items: [], total: 0 } });
    } catch {
      dispatch({ type: "SET_CART_LOADED", payload: true });
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [state.user]);

  useEffect(() => {
    const init = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      if (token) {
        await refreshUser();
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (state.user !== undefined) {
      refreshCart().then(() => dispatch({ type: "SET_LOADING", payload: false }));
    }
  }, [state.user, refreshCart]);

  return (
    <AppContext.Provider value={{ state, dispatch, refreshUser, refreshCart }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
