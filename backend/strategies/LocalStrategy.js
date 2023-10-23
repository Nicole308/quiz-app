import passport from "passport"
import {Strategy} from "passport-local"
import User from "../models/User.js"

console.log("YOU ARE IN LOCAL STRATEGY")
// Local Strategy 
passport.use(new Strategy(User.authenticate()));

// Serialize User after user logged in
passport.serializeUser(User.serializeUser());