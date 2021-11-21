const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
    userId: {type: Types.ObjectId, ref:'User', required: true},
    cardId: {type: Types.ObjectId, ref:'Card', required: true}
});

module.exports = model("User-Card", schema);
