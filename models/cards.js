const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  title: { type: String, require: true },
  text: { type: String, require: true },
  subscribers: { type: [Types.ObjectId], ref: "User" },
});

module.exports = model("Card", schema);
