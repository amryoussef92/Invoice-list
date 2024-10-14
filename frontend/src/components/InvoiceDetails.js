import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./InvoiceDetails.css";

const InvoiceDetails = () => {
  const { id } = useParams(); // Get the invoice id from the URL
  const navigate = useNavigate();
  const [units, setUnits] = useState([]);
  const [invoice, setInvoice] = useState({
    productName: "",
    unitNo: "",
    price: 0,
    quantity: 0,
    total: 0,
    expiryDate: "",
  });

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/units");
        setUnits(response.data);
      } catch (error) {
        console.error("Error fetching units:", error);
      }
    };

    const fetchInvoice = async () => {
      if (id) {
        try {
          const response = await axios.get(
            `http://localhost:4000/api/invoicedetails/${id}`
          );
          console.log("Fetched Invoice Data:", response.data);
          setInvoice({
            productName: response.data.productName,
            unitNo: response.data.unitNo,
            price: Number(response.data.price),
            quantity: Number(response.data.quantity),
            total: Number(response.data.total),
            expiryDate: response.data.expiryDate,
          });
        } catch (error) {
          console.error("Error fetching invoice details:", error);
        }
      }
    };

    fetchUnits();
    fetchInvoice();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue =
      name === "price" || name === "quantity" ? Number(value) : value;
    setInvoice((prevState) => ({
      ...prevState,
      [name]: parsedValue,
      total:
        name === "price" || name === "quantity"
          ? (name === "price" ? parsedValue : prevState.price) *
            (name === "quantity" ? parsedValue : prevState.quantity)
          : prevState.total,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data for submission
    const { productName, unitNo, price, quantity, total, expiryDate } = invoice;
    const invoiceData = {
      productName,
      unitNo,
      price,
      quantity,
      total,
      expiryDate,
    };

    console.log("Submitting Invoice Data:", invoiceData);

    try {
      if (id) {
        // Update existing invoice
        await axios.put(
          `http://localhost:4000/api/invoicedetails/${id}`,
          invoiceData
        );
        alert("Invoice updated!");
      } else {
        // Create new invoice
        await axios.post(
          `http://localhost:4000/api/invoicedetails`,
          invoiceData
        );
        alert("Invoice created!");
      }
      navigate("/invoice-list"); // Redirect to list after operation
    } catch (error) {
      console.error("Error saving invoice:", error);
      alert("Error saving invoice. Please check the console for details.");
    }
  };

  const removeInvoice = async (e) => {
    e.preventDefault(); // Prevent form submission
    try {
      await axios.delete(`http://localhost:4000/api/invoicedetails/${id}`);
      console.log(`Invoice with id ${id} deleted successfully`);
      alert("Invoice deleted!");
      navigate("/invoice-list"); // Navigate back to the list after deletion
    } catch (error) {
      console.error("There was an error deleting the invoice:", error);
      alert("Error deleting invoice. Please check the console for details.");
    }
  };

  return (
    <div>
      <h1>Invoice Details</h1>
      <form onSubmit={handleSubmit}>
        {id && (
          <div>
            <label>Invoice ID:</label>
            <input type="number" name="id" value={id} readOnly />
          </div>
        )}
        <div>
          <label>Product Name:</label>
          <input
            type="text"
            name="productName"
            value={invoice.productName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Unit:</label>
          <select
            name="unitNo"
            value={invoice.unitNo}
            onChange={handleChange}
            required
          >
            <option value="">Select Unit</option>
            {units.map((unit) => (
              <option key={unit.unitNo} value={unit.unitNo}>
                {unit.unitName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={invoice.price}
            onChange={handleChange}
            required
            step="0.01"
          />
        </div>
        <div>
          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={invoice.quantity}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Total:</label>
          <input type="number" name="total" value={invoice.total} readOnly />
        </div>
        <div>
          <label>Expiry Date:</label>
          <input
            type="date"
            name="expiryDate"
            value={invoice.expiryDate}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">
          {id ? "Update Invoice" : "Create Invoice"}
        </button>
        {id && (
          <button onClick={removeInvoice} style={{ marginLeft: "10px" }}>
            Delete Invoice
          </button>
        )}
      </form>
    </div>
  );
};

export default InvoiceDetails;
