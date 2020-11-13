const { Schema, model } = require("mongoose");
const schema = new Schema({
    id: String,
},{
    collection: "votes",
});

module.exports = model("_schema", schema);