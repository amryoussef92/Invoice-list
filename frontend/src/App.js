import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import InvoiceDetails from "./components/InvoiceDetails";
import InvoiceList from "./components/InvoiceList";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/invoice-details/:id" element={<InvoiceDetails />} />{" "}
        {/* Corrected Route */}
        <Route path="/invoice-details" element={<InvoiceDetails />} />{" "}
        {/* Route for Creating */}
        <Route path="/invoice-list" element={<InvoiceList />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;
