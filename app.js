const express = require("express");
const multer = require("multer");
const path = require("path");
const config = require("./config/environment");
const csvRoutes = require("./routes/csvRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const port = 3000;

// Multer setup for handling file uploads
const upload = multer({ dest: config.CSV_UPLOAD_PATH_URL });


// Middleware for parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use Routes
app.use("/upload", csvRoutes(upload));
app.use("/users", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
