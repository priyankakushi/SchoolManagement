let mongoose = require("mongoose")


function mongoDbConnection(){
    mongoose.connect("mongodb://localhost/SchoolAllData18"),{
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
}

module.exports = {
    mongoDbConnection
}