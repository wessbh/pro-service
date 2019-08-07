const express = require('express');
const router = express.Router();
const UserController = require('../controllers/usersController');
const {validateBody, schemas} = require('../helpers/routeHelpers');
const passport = require ('passport');
const passportConf = require('../passport');

const passportSignIn = passport.authenticate('local', {session : false});
const passportJWT = passport.authenticate('jwt', { session: false });
const passportGoogle = passport.authenticate('googleToken', {session: false});
const passportFacebook = passport.authenticate('facebookToken', {session: false});
    router.route('/signup')
        .post(validateBody(schemas.authSchema), UserController.signUp);

    router.route('/signin')
        .post( validateBody(schemas.loginSchema),passportSignIn, UserController.signIn);

    router.route('/secret')
        .get(passportJWT, UserController.secret);

    router.route('/oauth/google')
        .post(passportGoogle, UserController.googleOAuth);   

    router.route('/oauth/facebook')
        .post(passportFacebook, UserController.facebookOAuth);   
        
    router.route('/googleOAuth');

    router.route('/all_users')
        .get(passportJWT, UserController.getAll_users);
        
module.exports = router;