const {Schema, model,Types} = require('mongoose')

const schema = new Schema({
    title:{type:String, required:true},
    date:{type:Date, value:Date.now()},
    isfinished:{type:Boolean}, 
    id:{type:String, required:true},
    owner:{type:Types.ObjectId, ref:'User'}
})



module.exports = model('Task',schema)