const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDb } = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const equipmentRoutes = require("./routes/equipmentRoutes");
const borrowRoutes = require("./routes/borrowRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Equipment Lending Portal API" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/borrow", borrowRoutes);

const port = process.env.PORT || 4000;

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`API listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database", error);
    process.exit(1);
  });
