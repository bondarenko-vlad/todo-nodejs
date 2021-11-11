const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  broadcastSubscribe: { type: Boolean },
  nightTheme: { type: Boolean },
  owner: { type: Types.ObjectId, ref: "User", unique: true },
});

module.exports = model("Settings", schema);
