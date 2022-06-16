let jwt = require("jsonwebtoken")



function createJwtToken(payload, secretKey){

    if (!payload) throw "Payload Must Required"
    if (!secretKey) throw "SecretKey Must Required"

    let jwtOptions = {expiresIn: "2h"}
    let token = jwt.sign(payload, secretKey, jwtOptions)


    return {
        tokenType: "Bearer",
        token: token,
        expiresIn: 7200000
    }
}



function login(req, res, next){

    let authHeader = req.headers.authorization
    if (!authHeader) return res.sendStatus(401)

    let token = authHeader.split(" ")[1]
    if (!token) return res.sendStatus(401)

    let secretKey = process.env.SECRET_KEY

    jwt.verify(token, secretKey, async function(err, data){

        if (err) return res.sendStatus(401)

        else{

            req.user = data
            
        }
        next()
    })

}




module.exports = {
    createJwtToken,
    login
}