const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
    userId: {type: Types.ObjectId, ref:'User'},
    cardId: {type: Types.ObjectId, ref:'Card'}
});

module.exports = model("User-Card", schema);
