const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const expressValidator = require("express-validator");
const fs = require("fs");
require("dotenv").config();

// import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const vaccinationRoutes = require("./routes/vaccination");
const testRoutes = require("./routes/test");
const centerRoutes = require("./routes/center");
const notificationRoutes = require("./routes/notification");

// app
const app = express();

// connect db
mongoose.connect(process.env.DATABASE).then(() => console.log("DB connected"));

// middlewares
app.use(morgan("dev"));
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());
app.use(express.json({ limit: "25mb" }));

// apiDocs
app.get("/", (req, res) => {
    fs.readFile("docs/apiDocs.json", (err, data) => {
        if (err) {
            res.status(400).json({
                error: err,
            });
        }
        const docs = JSON.parse(data);
        res.json(docs);
    });
});

// routes middlewares
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", vaccinationRoutes);
app.use("/api", testRoutes);
app.use("/api", centerRoutes);
app.use("/api", notificationRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});