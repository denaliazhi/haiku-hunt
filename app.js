import express from "express";
import url from "url";
import path from "path";
import indexRouter from "./routers/indexRouter.js";
import searchRouter from "./routers/searchRouter.js";

const PORT = process.env.PORT;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsPath = path.join(__dirname, "public");

const app = express();
app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", indexRouter);
app.use("/search", searchRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err.message);
});

app.listen(PORT, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Server running on port ${PORT}`);
});
