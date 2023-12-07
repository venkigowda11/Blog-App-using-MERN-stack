const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");

const path = require("path");
const cheerio = require("cheerio");

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://blog-app-ten-ebon.vercel.app.com"
  );
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(
  cors({
    credentials: true,
    origin: ["https://blog-app-frontend-three.vercel.app"],
    methods: ["POST", "GET", "PUT"],
    allowedHeaders: "Content-Type",
  })
);

app.use(express.json());
app.use(cookieParser());

const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");

const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");
const { error } = require("console");
const secret = "dekn28f2f2nkf3f2nkfkw92ffn";

app.listen(4000);

mongoose.connect(
  "mongodb+srv://venkateshmnvenki:Mern!blog11@cluster0.5klblqe.mongodb.net/Cluster0?retryWrites=true&w=majority"
);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(user);
  } catch (e) {
    res.status(400).json("duplicate value");
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    jwt.sign(
      { username, id: userDoc._id },
      secret,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        else {
          res.cookie("token", token, { sameSite: "None", secure: true }).json({
            id: userDoc._id,
            username,
          });
        }
      }
    );
  } else {
    res.status(400).json("Wrong credentials");
  }
});

app.get("/profile", (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    // Handle the case where no token is provided
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      // Handle token verification failure
      console.error("Token verification failed:", err);
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    // Token is valid, respond with decoded user information
    res.json(info);
    console.log("Decoded user information:", info);
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

app.get("/post", async (req, res) => {
  const posts = await Post.find()
    .populate("author", ["username"])
    .sort({ createdAt: -1 })
    .limit(50);

  res.json(posts);
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const postDoc = await Post.findById(id).populate("author", ["username"]);

    if (!postDoc) {
      return res.status(404).json({ error: "Post not found" });
    }

    console.log("Retrieved post document:", postDoc);

    res.json(postDoc);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/post", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, contentC, urlC } = req.body;

    const contentEdit = contentC;
    const $ = cheerio.load(contentEdit);
    const content = $.text();

    const url = urlC.replace(/['"]/g, "");

    console.log(content, url);
    const postDoc = await Post.create({
      title,
      summary,
      content,
      url,
      author: info.id,
    });
    res.json(postDoc);
  });
});

app.put("/post", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;

    const { id, title, summary, contentC, urlC } = req.body;

    const contentEdit = contentC;
    const $ = cheerio.load(contentEdit);
    const content = $.text();

    const urlU = urlC.replace(/['"]/g, "");

    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    await postDoc.updateOne({
      title,
      summary,
      content,
      url: urlU ? urlU : postDoc.url,
    });
    res.json({ isAuthor, postDoc, info });
  });
});
