let express = require("express")
let router = require("./routes/user")
let mongoDBConnection = require("./connection/mongoDbConnection")
require("dotenv").config()

let app = express()

app.use(express.json())

app.use("/user", router)

mongoDBConnection.mongoDbConnection()

let PORT = process.env.PORT

app.listen(PORT, function(){
    console.log("It's working")
})