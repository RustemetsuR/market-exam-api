const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");

const SALT_WORK_FACTOR = 10;

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, "Поле username обязательно для заполнения"],
        unique: true,
        validate: {
            validator: async (value) => {
                const user = await User.findOne({ username: value });
                if (user) return false;
            },
            message: (props) => `User ${props.value} is already exist`
        }
    },
    name: {
        type: String,
        required: [true, "Поле name обязательно для заполнения"]
    },
    password: {
        type: String,
        required: [true, "Поле password обязательно для заполнения"],
        minlength: [8, "Минимальная длина пароля 8 символов"],
    },
    phoneNumber:{
        type: String,
        required: [true, "Поле phoneNumber обязательно для заполнения"],
    },
    token: {
        type: String,
        required: true
    }
});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
});

UserSchema.set("toJSON", {
    transform: (doc, ret, options) => {
        delete ret.password;
        return ret;
    }
});

UserSchema.methods.checkPassword = function (password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function () {
    this.token = nanoid();
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
