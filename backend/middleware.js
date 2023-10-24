import passport from "passport"
import jwt from "jsonwebtoken"
import './config/envConfig.js'
const dev = process.env.NODE_ENV !== "production"

console.log("YOUR ARE IN MIDDLEWARE.JS")
// Create the refresh token cookie which should be httpOnly
export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: !dev,
    signed: true,
    maxAge: eval(process.env.REFRESH_TOKEN_EXPIRY) * 1000,
    // sameSite: "None",
}

// Create JSON Web Token
export const getToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: eval(process.env.SESSION_EXPIRY),
    })
}

// Create the refresh token which itself is a JSON Web Token
export const getRefreshToken = (user) => {
    console.log('user getRefreshToken', user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: eval(process.env.REFRESH_TOKEN_EXPIRY),
    })
    // console.log("refreshToken: ", refreshToken)
    return refreshToken
}

export const verifyUser = passport.authenticate("jwt", {session: false})

// export const verifyUser = (req, res) => {
//     res.status(200).send(req.user)

// }