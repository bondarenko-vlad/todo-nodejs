const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  title: { type: String, require: true },
  text: { type: String, require: true },
});

module.exports = model("Card", schema);
