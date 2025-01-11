import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const AddToCart = () => {
  const {
    cartItems,
    setCartItems,
    toppings,
    setToppings,
    notification,
    socket,
  } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const calculateTotalPrice = () =>
    cartItems.reduce(
      (sum, item) =>
        sum +
        item.price * (item.qty || 1) +
        (item.Toppings?.reduce((topSum, topping) => topSum + topping.price, 0) || 0),
      0
    );

  useEffect(() => {
    socket.on("update_cart", (data) => {
      setCartItems(data.data.items);
    });

    socket.on("update_toppings", (data) => {
      setToppings((prev) =>
        data.action === "add_toppings"
          ? [...prev, data.data]
          : prev.filter((t) => t.topping !== data.data.topping)
      );
    });

    return () => {
      socket.off("update_cart");
      socket.off("update_toppings");
    };
  }, [socket, setCartItems, setToppings]);

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const addTopping = (toppingName) => {
    socket.emit("add_toppings", { args: { topping: toppingName, quantity: 1 } });
  };

  const handleProceedToPayment = () => {
    navigate("/payment", { state: { cartItems, toppings } });
  };

  return (
    <div className="bg-black text-white min-h-screen px-4 py-6 space-y-6">
      {/* Notification */}
      {notification && <div className="bg-green-500 p-2 rounded">{notification}</div>}

      {/* Cart Items */}
      <section className="space-y-4">
        {cartItems.map((item, index) => (
          <div key={index} className="flex space-x-4 items-center">
            <img
              src="https://placehold.co/80x80"
              alt={item.item_name}
              className="w-20 h-20 rounded-lg"
            />
            <div>
              <h2 className="text-xl font-bold">{item.item_name}</h2>
              <p className="text-sm text-gray-400">Price: ${item.price}</p>
              {item.Toppings && item.Toppings.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold">Toppings:</h4>
                  {item.Toppings.map((topping, idx) => (
                    <p key={idx} className="text-sm text-gray-400">
                      {topping.item_name} - ${topping.price}
                    </p>
                  ))}
                </div>
              )}
            </div>
            <div className="ml-auto">
              <button onClick={decrementQuantity} className="px-2">-</button>
              <span className="px-4">{quantity}</span>
              <button onClick={incrementQuantity} className="px-2">+</button>
            </div>
          </div>
        ))}
      </section>

      {/* Total Price */}
      <div className="text-lg font-bold">
        Total Price: ${calculateTotalPrice().toFixed(2)}
      </div>

      {/* Proceed to Payment */}
      <button
        onClick={handleProceedToPayment}
        className="bg-blue-600 py-2 px-4 rounded-lg w-full"
      >
        Proceed to Payment
      </button>
    </div>
  );
};

export default AddToCart;
