const { Schema, model } = require("mongoose");
const schema = new Schema({
    id: String,
    prefix: String,
},{
    collection: "prefixes",
});

module.exports = model("schema", schema);
