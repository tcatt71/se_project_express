const express = require("express");
const mongoose = require("mongoose");
const usersRouter = require("./routes/users");
const clothingItemsRouter = require("./routes/clothingItems");

const { PORT = 3001 } = process.env;
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use((req, res, next) => {
  req.user = { _id: "69feee0eb80280ba5aec97c7" };
  next();
});
app.use(express.json());
app.use("/", usersRouter);
app.use("/", clothingItemsRouter);

app.listen(PORT, () => console.log("Server is running."));
