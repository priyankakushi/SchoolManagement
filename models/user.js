let mongoose = require("mongoose")



let User = mongoose.Schema({

    firstName:{
        type: String,
        require: true 
    },
    lastName:{
        type: String
    },
    mobile:{
        type: Number,
        maxLength: 10,
        minLength: 10
    },
    email:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    },
    gender:{
        type: String,
        require: true
    },
    userType:{
        type: String,
        enum: ["Student", "Teacher", "Admin"]
    }
})

let user = mongoose.model("user", User)

module.exports = user