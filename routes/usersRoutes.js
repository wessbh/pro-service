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
    router.route('/signup_client')
        .post(validateBody(schemas.authSchemaClient), UserController.signUpClient);
    router.route('/signup_pro')
        .post(validateBody(schemas.authSchemaPro), UserController.signUpPro);
    router.route('/signup_admin')
        .post(validateBody(schemas.authSchemaAdmin), UserController.signUpAdmin);

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

    router.route('/add_card')
        .put(UserController.add_card);

    router.route('/delete_card')
        .delete(UserController.delete_card);
        
module.exports = router;