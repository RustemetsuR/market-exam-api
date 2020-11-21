const router = require("express").Router();
const Product = require("../models/Product");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const { nanoid } = require("nanoid");
const config = require("../config");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.get("/", async (req, res) => {
    let query;
    if (req.query.category) {
        query = { category: req.query.category };
    }
    try {
        const products = await Product.find(query).populate("category", "title description");
        res.send(products);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get("/:id", async (req, res) => {
    const result = await Product.findById(req.params.id).populate("userID category", "-__v -token");
    if (result) {
        res.send(result);
    } else {
        res.sendStatus(404);
    };
});

router.post("/", upload.single("image"), async (req, res) => {

    const token = req.get("Authorization");
    if (!token) {
        return res.status(401).send({ error: "No token presented" });
    };
    const user = await User.findOne({ token });
    if (!user) {
        return res.status(401).send({ error: "Wrong token" });
    };
    
    const productData = req.body;
    productData.userID = user._id;
    if (req.file) {
        productData.image = req.file.filename;
    };
    const product = new Product(productData);
    try {
        await product.save();
        res.send(product);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.delete("/:id", upload.single("image"), async (req, res) => {
    const token = req.get("Authorization");
    if (!token) {
        return res.status(401).send({ error: "No token presented" });
    };
    const user = await User.findOne({ token });
    if (!user) {
        return res.status(401).send({ error: "Wrong token" });
    };

    try {
        await Product.findByIdAndRemove(req.params.id);
        res.send({success: "The Product was successfully deleted"});
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;