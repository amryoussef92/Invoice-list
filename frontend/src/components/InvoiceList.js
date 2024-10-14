import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./InvoiceList.css";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetching the invoices from the server
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/invoicedetails"
        );
        setInvoices(response.data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };
    fetchInvoices();
  }, []);

  // Function to handle invoice deletion
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await axios.delete(`http://localhost:4000/api/invoicedetails/${id}`);
        // Update state after deletion by filtering out the deleted invoice
        setInvoices(invoices.filter((invoice) => invoice.id !== id));
        alert("Invoice deleted successfully.");
      } catch (error) {
        console.error("Error deleting invoice:", error);
        alert("Error deleting invoice. Please try again.");
      }
    }
  };

  return (
    <div className="invoice-list">
      <h1>Invoice List</h1>
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>Product Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.id}</td>
              <td>{invoice.productName}</td>
              <td>
                <button
                  onClick={() => navigate(`/invoice-details/${invoice.id}`)}
                >
                  View Details
                </button>
                <button
                  onClick={() => handleDelete(invoice.id)}
                  style={{ marginLeft: "10px" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceList;
