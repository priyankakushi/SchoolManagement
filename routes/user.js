let express = require("express")
const User = require("../models/user")
let helper = require("../utility/utility")
let authentication = require("../middleware/auth/authentication")

let router = express.Router()

router.post("/create", async function (req, res) {

    let firstName = req.body.firstName
    let lastName = req.body.lastName
    let mobile = req.body.mobile
    let email = req.body.email
    let password = req.body.password
    let confirmPassword = req.body.confirmPassword
    let gender = req.body.gender
    let userType = req.body.userType

    /**
     * Validation
     */
    if (!firstName) return res.json({ success: false, responce: "First Name Must Required" })

    let strMobile = mobile.toString()
    if (typeof mobile !== "number" || strMobile.length !== 10) return res.json({ success: false, responce: "Mobile Number Is Incorrect" })

    if (!email.includes("@") || !email.includes(".")) return res.json({ success: false, responce: "EmailId Is Incorrect" })

    if (password !== confirmPassword) return res.json({ success: false, responce: "Password Does Not Match" })



    let userDetails = new User({

        firstName: firstName,
        lastName: lastName,
        mobile: mobile,
        email: email,
        password: password,
        gender: gender,
        userType: userType
    })

    let findUser = await User.findOne({ email: email })

    if (findUser) return res.json({ success: false, responce: `User Allready Created with this ${email}` })

    try {
        let hashPassword = await helper.hashPassword(userDetails.password)
        userDetails.password = hashPassword


        let createUser = await User.create(userDetails)

        return res.json({ success: true, responce: createUser })
    }
    catch (err) {
        console.log(err)
    }


    return res.json({ success: true, responce: "Your Account Has Created" })
})





router.post("/login", async function (req, res) {

    let emailId = req.body.email
    let password = req.body.password

    let findUser = await User.findOne({ email: emailId })

    if (findUser === null) return res.json({ success: false, responce: "This EmailId Does Not Exist First Create Your Account" })

    let dbpassword = findUser.password

    let comparePassword = helper.comparePassword(password, dbpassword)
    console.log(comparePassword)

    if (!comparePassword) return res.json({ success: false, response: "Password is incorrect" })

    let payload = ({ id: findUser._id, email: findUser.email, userType: findUser.userType })
    let secretKey = process.env.SECRET_KEY

    let jwtToken = authentication.createJwtToken(payload, secretKey)

    return res.json({ success: true, responce: jwtToken })
})




router.get("/getAllUsers", authentication.login, async function (req, res) {

    let userType = req.user.userType

    if (userType !== "Admin") return res.json({success: false, responce: "Your are not authorized for this api"})

    let getAllUsersData = await User.find({})

    return res.json({ success: true, responce: getAllUsersData })
})



router.get("/getAllTeachers", authentication.login, async function (req, res) {

    let userType = req.user.userType

    if (userType !== "Admin") return res.json({success: false, responce: "Your are not authorized for this api"})

    let getAllTeachers = await User.find({ userType: "Teacher" })

    return res.json({ success: true, responce: getAllTeachers })
})


router.get("/getAllStudents", authentication.login, async function (req, res) {

    let userType = req.user.userType

    if(userType !== "Admin") return res.json({ success: false, responce: "You are not Authorized for this Api" })
    
    let getAllStudents = await User.find({ userType: "Student" })

    return res.json({ success: true, responce: getAllStudents })
})



router.post("/updatePassword", authentication.login, async function (req, res) {

    let userId = req.params.userId
    let oldPassword = req.body.oldPassword
    let newPassword = req.body.newPassword
    let reNewPassword = req.body.reNewPassword

    if (newPassword !== reNewPassword) return res.json({ success: false, responce: "Password Does Not Match" })

    let findUser = await User.findById(userId)
    if (!findUser) return res.json({ success: false, responce: "User Does Not Exist" })

    let dbPassword = findUser.password

    let comparePassword = await helper.comparePassword(oldPassword, dbPassword)
    if (!comparePassword) return res.json({ success: false, responce: "Old Password Is Incorrect" })

    let hashPassword = await helper.hashPassword(newPassword)
    try {
        let updatePassword = await User.findByIdAndUpdate(userId, { password: hashPassword })

        return res.json({ success: true, responce: "Your Password Has Updated" })
    }
    catch (err) {
        console.log(err)
    }
})



router.post("/delete/:userId", async function (req, res) {

    let userId = req.params.userId
    let password = req.body.password

    let findUser = await User.findById(userId)
    if (!findUser) return res.json({ success: false, responce: "User Does Not Exist" })

    let dbPassword = findUser.password

    let comparePassword = await helper.comparePassword(password, dbPassword)
    if (!comparePassword) return res.json({ success: false, responce: "Your Password Is Incorrect" })

    try {
        let userDeleteAccount = await User.findByIdAndDelete(findUser)

        return res.json({ success: true, responce: "Your Account Has Deleted" })
    }
    catch (err) {
        console.log(err)
    }
})




module.exports = router