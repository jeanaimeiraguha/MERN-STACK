const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

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
  
  User.create({ name, email, age })
    .then(newUser => {
      res.status(201).json({ message: "User added successfully", user: newUser });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

mongoose.connect(
  "mongodb+srv://jeanaimeiraguha:Iraguha@mern.sazoqkg.mongodb.net/School?retryWrites=true&w=majority&appName=Mern"
)
.then(() => console.log("MongoDB connected successfully"))
.catch(err => console.error(" MongoDB connection error:", err));

app.get('/', (req, res) => {
  res.send("Server is running and connected to MongoDB");
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
