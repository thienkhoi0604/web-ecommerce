const passport = require('passport');
const { BcryptUtil } = require('../utils');
const { UserModel } = require('../models');
const { Types } = require('mongoose');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: 'http://localhost:8080/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'email'],
}, async (accessToken, refreshToken, profile, done) => {
    const user = {
        id: profile.id,
        fullname: profile.displayName,
        email: profile?.emails?.[0]?.value,
        password: "123456",
        source: 'facebook',
    };
    const existedUser = await UserModel.findOne({
        $or: [
            { id: user.id },
            { email: profile?.emails?.[0]?.value },
        ]
    }).lean();
    if (existedUser !== null) {
        return done(null, existedUser);
    }
    const newUser = await UserModel.create(user);
    return done(null, newUser);
}));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:8080/auth/google/callback',
    passReqToCallback: true
}, async (request, accessToken, refreshToken, profile, done) => {
    const user = {
        id: profile.id,
        fullname: profile.displayName,
        email: profile?.emails?.[0]?.value,
        password: "123456",
        source: 'google',
    };
    const existedUser = await UserModel.findOne({
        $or: [
            { id: user.id },
            { email: profile?.emails?.[0]?.value }, F
        ]
    }).lean();
    if (existedUser !== null) {
        return done(null, existedUser);
    }
    const newUser = await UserModel.create(user);
    return done(null, newUser.toObject());
}));

passport.serializeUser((user, done) => {
    done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
    try {
        const user = await UserModel.findOne({ email });
        if (user === null) {
            return done(null, false);
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
});

module.exports = passport;
