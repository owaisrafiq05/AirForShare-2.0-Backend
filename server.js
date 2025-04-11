const express = require("express");

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to my server!');
});

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});