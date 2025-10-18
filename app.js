import express from "express";
import url from "url";
import path from "path";
import mainRouter from "./routers/mainRouter.js";
import fountainRouter from "./routers/fountainRouter.js";
import initialConfig from "./config.js";

const PORT = process.env.PORT;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsPath = path.join(__dirname, "public");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: true }));

app.use("/", mainRouter);
app.use("/:group", fountainRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err.message);
});

app.listen(PORT, async (err) => {
  if (err) {
    throw err;
  }
  await initialConfig(app);
  console.log(`Server running on port ${PORT}`);
});
