import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      <h1>Welcome to the Invoice App</h1>
      <p>Manage your invoices with ease.</p>

      <button onClick={() => navigate("/invoice-details")}>
        Invoice Details
      </button>
      <button onClick={() => navigate("/invoice-list")}>Invoice List</button>
    </div>
  );
};

export default HomePage;
