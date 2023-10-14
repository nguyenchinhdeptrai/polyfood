const mongoose = require("mongoose");

const dataUser = new mongoose.Schema({
    name: { type: String, require: true },
    email: { type: String, require: true },
    phone: { type: String, require: true },
    password: { type: String },
    role: { type: String },
});

const ModelUser = mongoose.model("user", dataUser);
module.exports = ModelUser;