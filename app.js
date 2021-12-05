const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const expressValidator = require("express-validator");
const fs = require("fs");
const socketio = require("socket.io");
require("dotenv").config();

// import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const vaccinationRoutes = require("./routes/vaccination");
const vaccineRoutes = require("./routes/vaccine");
const chapAppRoutes = require("./routes/chat");

// import users handler
const {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
} = require("./helpers/usersHandler");

// app
const app = express();
const server = http.createServer(app);
const io = socketio(server);

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
app.use("/api", vaccineRoutes);
app.use("/api", chapAppRoutes);

// IO handler
io.on("connect", (socket) => {
    socket.on("join", ({ name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room });

        if (error) return callback(error);

        socket.join(user.room);

        socket.emit("message", {
            user: "admin",
            text: `${user.name}, welcome to room ${user.room}.`,
        });
        socket.broadcast
            .to(user.room)
            .emit("message", { user: "admin", text: `${user.name} has joined!` });

        io.to(user.room).emit("roomData", {
            room: user.room,
            users: getUsersInRoom(user.room),
        });

        callback();
    });

    socket.on("sendMessage", (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit("message", { user: user.name, text: message });

        callback();
    });

    socket.on("disconnect", () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit("message", {
                user: "Admin",
                text: `${user.name} has left.`,
            });
            io.to(user.room).emit("roomData", {
                room: user.room,
                users: getUsersInRoom(user.room),
            });
        }
    });
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});