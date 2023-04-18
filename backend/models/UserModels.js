const mongoose = require('mongoose');

const UserTable = new mongoose.Schema(
    {
        firstname : {type : String , required : true},
        username : {type : String , unique : true , required : true},
        age : {type : Number , required : true},
        password : {type : String , required : true}
    },
    {
        timestamps : true
    }
)

module.exports = mongoose.model("User" , UserTable)