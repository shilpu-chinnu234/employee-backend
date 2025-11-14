// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// --------------------
// Connect to MongoDB
// --------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    preloadEmployees();
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));

// --------------------
// Employee Schema & Model
// --------------------
const employeeSchema = new mongoose.Schema({
  name: String,
  position: String,
  salary: Number
});

const Employee = mongoose.model('Employee', employeeSchema);

// --------------------
// Preload 5 employees if DB is empty
// --------------------
const preloadEmployees = async () => {
  try {
    const count = await Employee.countDocuments();
    if (count === 0) {
      const sampleEmployees = [
        { name: "Alice Johnson", position: "Manager", salary: 70000 },
        { name: "Bob Smith", position: "Developer", salary: 50000 },
        { name: "Carol Lee", position: "Designer", salary: 45000 },
        { name: "David Brown", position: "Tester", salary: 40000 },
        { name: "Eva Green", position: "HR", salary: 48000 }
      ];
      await Employee.insertMany(sampleEmployees);
      console.log("💾 Preloaded 5 sample employees");
    }
  } catch (err) {
    console.error("Error preloading employees:", err);
  }
};

// --------------------
// Routes
// --------------------

// Root route
app.get('/', (req, res) => res.send("Employee Management API"));

// Get all employees
app.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new employee
app.post('/add', async (req, res) => {
  const { name, position, salary } = req.body;
  const newEmployee = new Employee({ name, position, salary });
  try {
    const saved = await newEmployee.save();
    res.status(201).json({ message: "Employee added successfully", employee: saved });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an employee by ID
app.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await Employee.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an employee by ID
app.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Employee.findByIdAndDelete(id);
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Catch-all 404 route
app.use((req, res) => res.status(404).send("❌ Route not found"));

// --------------------
// Start server
// --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
