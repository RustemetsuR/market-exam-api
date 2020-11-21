const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const users = require("./app/users");
const categories = require("./app/categories");
const products = require("./app/products");
const app = express();
const port = 8000;
const config = require("./config");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const run = async () => {
    await mongoose.connect(config.db.url + "/" + config.db.name,  { useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});

    app.use("/users", users);
    app.use("/products", products);
    app.use("/categories", categories);
    console.log("Connected to mongo DB");

    app.listen(port, () => {
        console.log(`Server started at http://localhost:${port}`);
    });
};

run().catch(console.log);