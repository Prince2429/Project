// src/components/Layout.js
import React from "react";
import WebCall from "./WebCall";

const Layout = ({ children }) => {
  return (
    <div className="bg-black text-white min-h-screen">
      <header className="flex justify-between items-center px-4 py-6">
        <div className="flex items-center space-x-2">
          <button className="bg-gray-800 p-2 rounded-full">
            <img
              src="https://placehold.co/40x40"
              alt="Profile"
              className="rounded-full"
            />
          </button>
          <span className="text-sm">Rebecca Welton</span>
        </div>
        <div className="flex-1 mx-4">
          <div className="flex bg-gray-800 px-4 py-2 rounded-lg items-center">
            <WebCall />
            <input
              type="text"
              placeholder="Click the icon and Start to Speak..."
              className="flex-1 bg-transparent text-white px-2 py-1 outline-none"
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="bg-gray-800 p-2 rounded-full">
            <i className="fas fa-question-circle text-lg text-white"></i>
          </button>
          <button className="bg-gray-800 p-2 rounded-full">
            <i className="fas fa-bell text-lg text-white"></i>
          </button>
        </div>
      </header>
      <main className="px-4 py-6">{children}</main>
    </div>
  );
};

export default Layout;
