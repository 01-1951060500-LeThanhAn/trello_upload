import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import FileModel from "./src/model/fileModel.js";
import path from "path";
dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

app.use(
  express.json({
    limit: "100mb",
  })
);
app.use("./files", express.static("./files"));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to Express & TypeScript Server");
});

const mongoURL = process.env.MONGO_DATABASE;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const times = Date.now();
    cb(null, times + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/upload-file", upload.single("file"), async (req, res) => {
  const fileName = req.file?.filename;
  try {
    const data = await FileModel.create({
      pdf: fileName,
    });

    res.status(200).json({ data });
  } catch (error) {
    res.status(401).json(error);
  }
});

app.get("/get-files", async (req, res) => {
  try {
    FileModel.find({}).then((data) => {
      res.send({ status: "ok", data: data });
    });
  } catch (error) {
    res.status(401).json(error);
  }
});

app.get("/get-files/:pdf", (req, res) => {
  const filename = req.params?.pdf;
  res.sendFile(path.join(__dirname, "files", filename));
});

mongoose
  .connect(mongoURL, {
    useBigInt64: true,
  })
  .then(() => {
    console.log("Connectd to DB");
  })
  .catch(() => console.log("Connect failed"));

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
