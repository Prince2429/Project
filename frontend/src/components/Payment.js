// src/components/Payment.js
import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useLocation, useNavigate } from "react-router-dom";

const Payment = () => {
  const location = useLocation();
  const { cartItems = [], toppings = [] } = location.state || {}; // Get cart and toppings data from state
  const navigate = useNavigate();

  const calculateGrandTotal = () => {
    const cartTotal = cartItems.reduce((sum, item) => sum + item.qty * item.price, 0);
    const toppingsTotal = toppings.reduce((sum, topping) => sum + (topping.quantity * (topping.total_price || 0)), 0);
    return cartTotal + toppingsTotal;
  };

  const handleBackClick = () => navigate(-1);

  return (
    <div className="bg-black text-white min-h-screen px-4 py-6 space-y-6">
      <button className="bg-gray-800 p-2 rounded-full" onClick={handleBackClick}>
        &larr; Back
      </button>

      {/* Invoice Section */}
      <section>
        <h2 className="text-xl font-bold">Invoice</h2>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="text-left">Item</th>
              <th className="text-left">Quantity</th>
              <th className="text-left">Price</th>
              <th className="text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, index) => (
              <tr key={index}>
                <td>{item.item_name}</td>
                <td>{item.qty}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${(item.qty * item.price).toFixed(2)}</td>
              </tr>
            ))}
            {toppings.map((topping, index) => (
              <tr key={index}>
                <td>{topping.topping}</td>
                <td>{topping.quantity}</td>
                <td>${topping.total_price?.toFixed(2) || "0.00"}</td>
                <td>${(topping.quantity * (topping.total_price || 0)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr />
        <p className="text-lg font-bold mt-4">
          Grand Total: ${calculateGrandTotal().toFixed(2)}
        </p>
      </section>

      {/* QR Code Section */}
      <section className="flex justify-center">
        <QRCodeCanvas
          value="https://payment-gateway.com"
          size={256}
          level={"H"}
          includeMargin={true}
        />
      </section>
    </div>
  );
};

export default Payment;
