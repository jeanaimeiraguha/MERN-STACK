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
  age: Number,
});

const Students = mongoose.model('Students', StudentsSchema);

app.post('/user/addNew', (req, res) => {
  const { name, email, age } = req.body;

  if (!name || !email || !age) {
    return res.status(400).json({ error: "All fields (name, email, age) are required." });
  }

  Students.create({ name, email, age })
    .then(newUser => {
      res.status(201).json({ message: "User added successfully", user: newUser });
    })
    .catch(err => {
      console.error("Failed to add user:", err.message);
      res.status(500).json({ error: "Internal server error" });
    });
});

app.get('/user', (req, res) => {
  Students.find()
    .then(users => res.json(users))
    .catch(err => {
      console.error("Error fetching users:", err.message);
      res.status(500).json({ error: "Failed to retrieve users" });
    });
});

app.put('/user/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;

  Students.findByIdAndUpdate(id, { name, email, age }, { new: true })
    .then(updatedUser => {
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ message: "User updated successfully", user: updatedUser });
    })
    .catch(err => {
      console.error("Update error:", err.message);
      res.status(500).json({ error: "Failed to update user" });
    });
});

app.delete('/user/:id', (req, res) => {
  const { id } = req.params;

  Students.findByIdAndDelete(id)
    .then(deletedUser => {
      if (!deletedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    })
    .catch(err => {
      console.error("Deletion error:", err.message);
      res.status(500).json({ error: "Failed to delete user" });
    });
});

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connected successfully");
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
})
.catch(err => {
  console.error("MongoDB connection failed:", err.message);
});
