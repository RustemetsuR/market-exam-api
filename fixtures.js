const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
const config = require("./config");
const Category = require("./models/Category");
const User = require("./models/User");
const Product = require("./models/Product");

mongoose.connect(config.db.url + "/" + config.db.name, { useNewUrlParser: true });

const db = mongoose.connection;

db.once("open", async () => {
    try {
        await db.dropCollection("categories");
        await db.dropCollection("products");
        await db.dropCollection("users");
    } catch (e) {
        console.log("Collection were not presented, skipping drop...");
    }

    const [computerCategory, phoneCategory, sportCategory] = await Category.create(
        {
            title: "Computers",
        },
        {
            title: "Phones",
        },
        {
            title: "Sport",
        },
    );

    const [user1, user2] = await User.create(
        {
            username: "user_1",
            password: "qwerty123123",
            name: "Kolya Denisov",
            phoneNumber: "+996-000-000-000",
            token: nanoid(),
        },
        {
            username: "user_2",
            password: "qwerty123123",
            name: "John Doe",
            phoneNumber: "+996-111-111-111",
            token: nanoid(),
        }
    );

    await Product.create(
        {
            title: "Razor Nebula BMX",
            userID: user1._id,
            description: "The best bicycle in the world!",
            image: "bicycle.jpg",
            category: sportCategory._id,
            price: 15000,
        },
        {
            title: "Gaming Computer",
            userID: user2._id,
            description: "The best gaming Computer in the world!",
            image: "computer.jpg",
            category: computerCategory._id,
            price: 40000,
        },
        {
            title: "Iphone 7",
            userID: user1._id,
            description: "The best phone in the world!",
            image: "iphone.jpg",
            category: phoneCategory._id,
            price: 20000,
        },
    )
    db.close();
});