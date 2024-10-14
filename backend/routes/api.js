const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// Load mock data
const mockDataPath = path.join(__dirname, "../db.json");

// Helper function to read and write mock data
const readMockData = () => {
  const data = fs.readFileSync(mockDataPath, "utf-8");
  return JSON.parse(data);
};

const saveMockData = (data) => {
  fs.writeFileSync(mockDataPath, JSON.stringify(data, null, 2));
};

// CRUD for Units

// Create a new Unit
router.post("/units", (req, res) => {
  const { unitNo, unitName } = req.body;

  // Check if unitNo already exists
  const data = readMockData();
  const existingUnit = data.units.find((u) => u.unitNo == unitNo);
  if (existingUnit) {
    return res.status(400).json({ message: "Unit number already exists." });
  }

  const newUnit = { unitNo, unitName };
  data.units.push(newUnit);
  saveMockData(data);
  res.status(201).json(newUnit);
});

// Get all Units
router.get("/units", (req, res) => {
  const data = readMockData();
  res.json(data.units);
});

// Get a single Unit by unitNo
router.get("/units/:unitNo", (req, res) => {
  const { unitNo } = req.params;
  const data = readMockData();
  const unit = data.units.find((u) => u.unitNo == unitNo);
  if (!unit) {
    return res.status(404).send("Unit not found");
  }
  res.json(unit);
});

// Update a Unit
router.put("/units/:unitNo", (req, res) => {
  const { unitNo } = req.params;
  const { unitName } = req.body;
  const data = readMockData();
  const unitIndex = data.units.findIndex((u) => u.unitNo == unitNo);
  if (unitIndex === -1) {
    return res.status(404).send("Unit not found");
  }
  data.units[unitIndex].unitName = unitName;
  saveMockData(data);
  res.json({ message: "Unit updated successfully" });
});

// Delete a Unit
router.delete("/units/:unitNo", (req, res) => {
  const { unitNo } = req.params;
  const data = readMockData();
  const unitIndex = data.units.findIndex((u) => u.unitNo == unitNo);
  if (unitIndex === -1) {
    return res.status(404).send("Unit not found");
  }
  data.units.splice(unitIndex, 1);
  saveMockData(data);
  res.json({ message: "Unit deleted successfully" });
});

// CRUD for InvoiceDetails

// Create a new InvoiceDetails entry
// CRUD for InvoiceDetails

// Create a new InvoiceDetails entry
router.post("/invoicedetails", (req, res) => {
  const { id, productName, unitNo, price, quantity, total, expiryDate } =
    req.body;
  const data = readMockData();

  // Validate required fields
  if (
    !productName ||
    !unitNo ||
    price === undefined ||
    quantity === undefined ||
    !expiryDate
  ) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  let newId;

  if (id && id !== "") {
    // Check if id already exists
    const existingInvoice = data.invoicedetails.find(
      (invoice) => invoice.id === Number(id)
    );
    if (existingInvoice) {
      return res.status(400).json({ message: "Invoice ID already exists." });
    }
    newId = Number(id);
  } else {
    // Generate a new unique id (e.g., using timestamp)
    newId = Date.now();
  }

  // Convert fields to correct types
  const newInvoiceDetail = {
    id: newId,
    productName,
    unitNo: Number(unitNo),
    price: Number(price),
    quantity: Number(quantity),
    total: Number(total),
    expiryDate,
  };

  data.invoicedetails.push(newInvoiceDetail);
  saveMockData(data);
  res.status(201).json(newInvoiceDetail);
});

// Get all InvoiceDetails entries
router.get("/invoicedetails", (req, res) => {
  const data = readMockData();
  res.json(data.invoicedetails);
});

// Get a single InvoiceDetails entry by lineNo
router.get("/invoicedetails/:id", (req, res) => {
  const { id } = req.params;
  const data = readMockData();
  const invoiceDetail = data.invoicedetails.find((invoice) => invoice.id == id);
  if (!invoiceDetail) {
    return res.status(404).send("Invoice details not found");
  }
  res.json(invoiceDetail);
});

// Update an InvoiceDetails entry
router.put("/invoicedetails/:id", (req, res) => {
  const id = Number(req.params.id);
  const { productName, unitNo, price, quantity, total, expiryDate } = req.body;
  const data = readMockData();
  const invoiceIndex = data.invoicedetails.findIndex(
    (invoice) => invoice.id == id
  );
  if (invoiceIndex === -1) {
    return res.status(404).send("Invoice not found");
  }
  // Update invoice details
  data.invoicedetails[invoiceIndex] = {
    id,
    productName,
    unitNo: Number(unitNo),
    price: Number(price),
    quantity: Number(quantity),
    total: Number(total),
    expiryDate,
  };
  saveMockData(data);
  res.json({ message: "Invoice updated successfully" });
});

// Delete an InvoiceDetails entry
router.delete("/invoicedetails/:id", (req, res) => {
  const { id } = req.params;
  const data = readMockData();
  const invoiceIndex = data.invoicedetails.findIndex(
    (invoice) => invoice.id == id
  );
  if (invoiceIndex === -1) {
    return res.status(404).send("Invoice not found");
  }
  data.invoicedetails.splice(invoiceIndex, 1);
  saveMockData(data);
  res.json({ message: "Invoice deleted successfully" });
});

module.exports = router;
