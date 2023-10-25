import passport from "passport";
import {Strategy, ExtractJwt} from "passport-jwt";
import User from "../models/User.js";
import '../config/envConfig.js'

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(
    new Strategy(opts, function(jwt_payload, done) {
        User.findOne({_id: jwt_payload._id})
            .then(user => {
                if (user) {
                    // console.log("from JwtStrategy.js if the user exists: ", user);
                    return done(null, user);
                } else {
                    // console.log("from JwtStrategy.js User does not exist");
                    return done(null, false);
                }
            })
            .catch(err => {
                return done(err, false);
            });
    })
)