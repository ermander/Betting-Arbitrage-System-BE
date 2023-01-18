const keys = require("../config/keys")
const bcrypt = require("bcryptjs")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const User = require("../models/user.model")
const JWTstrategy = require("passport-jwt").Strategy
const ExtractJWT = require("passport-jwt").ExtractJwt

passport.use(
    "local",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (email, password, done) => {
            try {
                const lowercaseEmail = email.trim().toLowerCase()
                const user = await User.findOne({ email: lowercaseEmail })

                if (!user) {
                    return done(null, false, { message: "User not found" })
                }
                if (!user.isActive) {
                    return done(null, false, { message: "Account not confirmed" })
                }
                //TODO: Bycrypt salt
                const validate = await bcrypt.compare(password, user.password)
                if (!validate) {
                    return done(null, false, { message: "Wrong Password" })
                }

                user.last_seen = new Date()
                await user.save()

                return done(null, user, { message: "Logged in Successfully" })
            } catch (error) {
                return done(error)
            }
        }
    )
)

passport.use(
    "user",
    new JWTstrategy(
        {
            secretOrKey: keys.SECRET,
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        },
        async (token, done) => {
            try {
                if (token.user) return done(null, token.user)
                throw new Error("unauthorized")
            } catch (error) {
                done(error)
            }
        }
    )
)