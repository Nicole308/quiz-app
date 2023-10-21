import passport from "passport";
import {Strategy, ExtractJwt} from "passport-jwt";
import User from "../models/User.js";
import '../config/envConfig.js'

// console.log("JWT_SECRET", process.env.JWT_SECRET)

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

// console.log("jwtFromRequest: ", opts.jwtFromRequest)
// console.log("secretOrKey: ", opts.secretOrKey)

// Fetch user details from the JWT /Deserialize User
passport.use(
    new Strategy(opts, function(jwt_payload, done) {
        User.findOne({_id: jwt_payload._id})
            .then(user => {
                if (user) {
                    // console.log("from JwtStrategy.js if the user exists");
                    return done(null, user);
                } else {
                    // console.log("from JwtStrategy.js User does not exist");
                    return done(null, false);
                }
            })
            .catch(err => {
                // console.log("from JwtStrategy.js there's an error");
                return done(err, false);
            });
    
        // This one has an 500 internal server error but still gets the user detail
        // User.findOne({_id: jwt_payload._id}).then((err, user) => {
        //     if(err) {
        //         console.log("from JwtStrategy.js there's an error")
        //         return done (err, false)
        //     }
        //     if(user) {
        //         console.log("from JwtStrategy.js if the user exist")
        //         return done(null, user)
        //     } else {
        //         console.log(" from JwtStrategy.js User does not exist")
        //         return done(null, false) // Maybe instead of just null, encourage the user to create a new account
        //     }
        // })
    })
)