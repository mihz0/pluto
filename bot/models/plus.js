const { Schema, model } = require("mongoose");
const schema = new Schema({
    id: String,
},{
    collection: "plus",
});

module.exports = model("__schema", schema);