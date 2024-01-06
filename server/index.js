const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");

app.use(express.json());
app.use(cookieParser());

const path = require("path");
const cheerio = require("cheerio");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://bloggerhub.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use(
  cors({
    credentials: true,
    origin: ["https://bloggerhub.vercel.app"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    allowedHeaders: "Content-Type",
  })
);

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
      { expiresIn: "2h" },
      (err, token) => {
        if (err) throw err;
        else {
          res.cookie("token", token, { sameSite: "None", secure: true }).json({
            id: userDoc._id,
            username,
            token,
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
    console.error("No token found in cookies");
    return res.status(401).json("Unauthorized");
  }

  jwt.verify(token, secret, (err, info) => {
    if (err) {
      console.error("Token verification error:", err);
      return res.status(401).json("Unauthorized");
    }
    console.log("Token verified successfully. User info:", info);
    res.json(info);
  });
});

app.get("/post", async (req, res) => {
  const posts = await Post.find()
    .populate("author", ["username"])
    .sort({ createdAt: -1 })
    .limit(50);

  res.json(posts);
});

app.get("/myblog", async (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    console.error("No token found in cookies");
    return res.status(401).json("Unauthorized");
  }

  jwt.verify(token, secret, async (err, info) => {
    if (err) {
      console.error("Token verification error:", err);
      return res.status(401).json("Unauthorized");
    }

    try {
      const userPosts = await Post.find({ author: info.id })
        .populate("author", ["username"])
        .sort({ createdAt: -1 });

      res.json(userPosts);
    } catch (error) {
      console.error("Error fetching user's posts:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
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
  console.log("Request Body:", req.body);

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, contentC, urlC } = req.body;

    const url = urlC.replace(/['"]/g, "");

    const postDoc = await Post.create({
      title,
      summary,
      content: contentC,
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

    const urlU = urlC.replace(/['"]/g, "");

    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    await postDoc.updateOne({
      title,
      summary,
      content: contentC,
      url: urlU ? urlU : postDoc.url,
    });
    res.json({ isAuthor, postDoc, info });
  });
});

app.post("/logout", (req, res) => {
  res
    .cookie("token", "", {
      expires: new Date(0),
      path: "/",
      secure: true,
      sameSite: "None",
    })
    .json("Logged out");
});

// ...

app.delete("/post/:id", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      console.error("Token verification error:", err);
      return res.status(401).json("Unauthorized");
    }

    const { id } = req.params;

    try {
      const postDoc = await Post.findById(id);

      if (!postDoc) {
        return res.status(404).json({ error: "Post not found" });
      }

      if (JSON.stringify(postDoc.author) !== JSON.stringify(info.id)) {
        return res
          .status(403)
          .json({ error: "Unauthorized to delete this post" });
      }

      await Post.findByIdAndDelete(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
});
