const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const StudentsSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number
});

const Students = mongoose.model('Students', StudentsSchema);


app.post('/user/addNew', (req, res) => {
  const { name, email, age } = req.body;

  if (!name || !email || !age) {
    return res.status(400).json({ error: "All fields are required: name, email, age" });
  }

  Students.create({ name, email, age }) 
    .then(newUser => {
      res.status(201).json({ message: "User added successfully", user: newUser });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});
mongoose.connect(MONGODB_URI)
  .then(() => console.log(" MongoDB connected successfully"))
  .catch(err => console.error(" MongoDB connection error:", err));

app.get('/', (req, res) => {
  res.send(" Server is running and connected to MongoDB");
});

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
