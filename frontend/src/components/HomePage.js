import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const HomePage = () => {
  const navigate = useNavigate();
  const { socket } = useContext(CartContext);

  useEffect(() => {
    // Redirect to AddToCart when an item is added to the cart
    socket.on("update_cart", (data) => {
      if (data.action === "add_to_cart") {
        navigate("/addtocart");
      }
    });

    return () => {
      socket.off("update_cart");
    };
  }, [socket, navigate]);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <section className="bg-red-600 rounded-xl p-6">
        <h2 className="text-xl font-bold">COMBOS</h2>
        <p className="text-sm">starting @ $49</p>
        <img
          src="https://placehold.co/600x200"
          alt="Combo"
          className="mt-4 rounded-lg"
        />
      </section>

      {/* Menu Categories */}
      <section>
        <h3 className="text-lg font-bold mb-4">Discover Our Menu</h3>
        <div className="grid grid-cols-3 gap-4">
          {[ "Sides", "Buckets", "Pizza", "Beverages", "Burgers", "Quick Bites"].map((category, index) => (
            <button key={index} className="bg-gray-800 rounded-lg p-4 text-center space-y-2">
              <img src={`https://placehold.co/80x80`} alt={category} className="w-16 h-16 mx-auto rounded-md" />
              <span>{category}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Best Sellers Section */}
      <section>
        <h3 className="text-lg font-bold mb-4">Best Sellers</h3>
        <div className="grid grid-cols-3 gap-4">
          {[{ name: "Chicken Burger", price: "$6.00" }, { name: "Pepsi", price: "$3.25" }, { name: "Margherita", price: "$9.45" }].map((item, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-4 text-center space-y-2">
              <img src="https://placehold.co/100x100" alt={item.name} className="w-16 h-16 mx-auto rounded-md" />
              <span className="block font-bold">{item.name}</span>
              <span className="block text-sm">{item.price}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
