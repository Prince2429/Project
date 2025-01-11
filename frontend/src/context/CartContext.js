import React, { createContext, useState, useEffect } from "react";
import io from "socket.io-client";

export const CartContext = createContext();

const socket = io("http://localhost:5000"); // Adjust URL as per backend location.

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [invoiceData, setInvoiceData] = useState({});
  const [notification, setNotification] = useState("");

  // Derived state: Calculate total price of cart
  const calculateTotalPrice = () =>
    cartItems.reduce(
      (sum, item) =>
        sum +
        item.price * (item.qty || 1) +
        (item.Toppings?.reduce((toppingSum, topping) => toppingSum + topping.price, 0) || 0),
      0
    );

  useEffect(() => {
    // Socket: Cart updates
    socket.on("update_cart", (data) => {
      if (data.action === "add_to_cart") {
        setCartItems(data.data.items);
        showNotification("Item added to cart!");
      } else if (data.action === "delete_from_cart") {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.sku !== data.data.sku)
        );
        showNotification("Item removed from cart!");
      }
    });

    // Socket: Topping updates
    socket.on("update_toppings", (data) => {
      if (data.action === "add_toppings") {
        setToppings((prevToppings) => [...prevToppings, data.data]);
        showNotification(`${data.data.topping} added as a topping!`);
      } else if (data.action === "delete_topping") {
        setToppings((prevToppings) =>
          prevToppings.filter((t) => t.topping !== data.data.topping)
        );
        showNotification(`${data.data.topping} removed from toppings!`);
      }
    });

    return () => {
      socket.off("update_cart");
      socket.off("update_toppings");
    };
  }, []);

  // Helper: Show notification with auto-clear
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000); // Clear after 3 seconds
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        toppings,
        setToppings,
        invoiceData,
        setInvoiceData,
        notification,
        socket,
        calculateTotalPrice, // Expose total price calculation
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
