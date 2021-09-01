const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const userRoute = require("./routes/users.routes");
const authRoute = require("./routes/auth.routes");
const postsRoute = require("./routes/posts.routes");
const conversationRoute = require("./routes/conversation.routes");
const messageRoute = require("./routes/message.routes");
const cors = require("cors");
const path = require("path");

dotenv.config();

mongoose.connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log("Connected to MongoDB");
    }
);
app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
        console.log(req.body);
        return res.status(200).json("File uploded successfully");
    } catch (error) {
        console.error(error);
    }
});

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

// middleware

app.listen(8800, () => {
    console.log("Backend server is running!");
});
