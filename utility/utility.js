let bcrypt = require("bcrypt")



async function hashPassword(password){

    let saltRound = await bcrypt.genSalt(10)
    let hashedPassword = await bcrypt.hash(password, saltRound)

    return hashedPassword
}



async function comparePassword(password, hashPassword){

    let result = await bcrypt.compare(password, hashPassword)

    return result
}

module.exports = {
    hashPassword,
    comparePassword
}