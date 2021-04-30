const {Schema, model,Types} = require('mongoose')

const schema = new Schema({
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    list:{type:Types.ObjectId, ref:'List'}
})



module.exports = model('User',schema)