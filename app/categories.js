const router = require("express").Router();
const Category = require("../models/Category");

router.get("/", async (req, res) => {
    try {
        const category = await Category.find();
        res.send(category);
    } catch (e) {
        return res.status(500);
    }
});

module.exports = router;