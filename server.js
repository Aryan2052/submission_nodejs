const express = require("express");
const bodyParser = require("body-parser");
const schoolRoutes = require("./src/routes/schoolRoutes");

const app = express();
app.use(bodyParser.json());

// Use routes
app.use("/api", schoolRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
