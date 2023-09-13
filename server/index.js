import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();

app.use(cors());

app.get("/image", (req, res) => {
  fs.stat("photo.jpg", (err, stats) => {
    let fileStream = fs.createReadStream("photo.jpg");

    res.setHeader("Content-Type", "image/jpg");
    res.setHeader("x-file-size", stats.size);
    res.setHeader("Access-Control-Expose-Headers", "x-file-size");

    fileStream.pipe(res);
  });
});

app.listen(5000, () => {
  console.log(`Listening on http://localhost:5000`);
});
