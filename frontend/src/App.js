import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import AddToCart from "./components/AddToCart";
import Payment from "./components/Payment"; // Import Payment component
import Layout from "./components/Layout";
import { CartProvider } from "./context/CartContext";

const App = () => {
  return (
    <CartProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/addtocart" element={<AddToCart />} />
            <Route path="/payment" element={<Payment />} /> {/* Payment route */}
          </Routes>
        </Layout>
      </Router>
    </CartProvider>
  );
};

export default App;
