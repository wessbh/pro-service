const JWT = require ('jsonwebtoken');
const User = require ('../models/User');
const {JWT_SECRET} = require ('../configuration');
const mongoose = require ('mongoose');
signToken = user => {
  return  JWT.sign({
        iss: 'E-service',
        sub: user._id,
        iat: new Date().getTime(), // get current time
        exp: new Date().setDate(new Date().getDate()+1) // 1 day ahead of the current time
    }, JWT_SECRET);
}
module.exports = {
    signUpClient : async (req, res, next) => {
        if(req.body.user_type != "client"){
            return res.status(400).json({"message": "This only for clients"});
        }
        const {email, password, nom, prenom, num_portable, num_fixe, image, user_type} = {
            email: req.body.email,
            password: req.body.password,
            nom: req.body.nom,
            prenom: req.body.prenom,
            num_portable: req.body.num_portable,
            num_fixe: req.body.num_fixe,
            image: req.body.image,
            user_type: req.body.user_type
        }
        const {card_type, card_number, expiration_date, cvv, password_edinar} = {
            card_type: req.body.card_type,
            card_number: req.body.card_number,
            expiration_date: req.body.expiration_date,
            cvv: req.body.cvv,
            password_edinar: req.body.password_edinar
        }
        // Check if user exists
        const foundUser = await User.findOne({'local.email': email});
        if(foundUser){
            return res.status(403).json({error : 'Mail is already used'});
        }
        // Create a new User
        const newUser = new User({
            method: 'local',
            user_type: user_type,
            local:{
                email: email,
                password: password,
                nom: nom,
                prenom: prenom,
                num_portable: num_portable,
                num_fixe: num_fixe,
                image: image,
                cards:{
                    card_type: card_type,
                    card_number: card_number,
                    expiration_date: expiration_date,
                    cvv: cvv,
                    password_edinar: password_edinar
                }
            }
        });
        await newUser.save();

        // Create a token and Respond with it
        const token = signToken(newUser);
        return res.status(200).json({token});
    },
    signUpPro: async (req, res, next) => {
        if(!req.res.user_type == "pro"){
            return res.status(400).json({"message": "This only for professionals"});
        }
        const {email, password, nom, prenom, num_portable, num_fixe, image, user_type, horaire_travail,nb_jours_travail,libelle,siteweb } = {
            email: req.body.email,
            password: req.body.password,
            nom: req.body.nom,
            prenom: req.body.prenom,
            num_portable: req.body.num_portable,
            num_fixe: req.body.num_fixe,
            image: req.body.image,
            user_type: req.body.user_type,
            horaire_travail: req.body.horaire_travail,
            nb_jours_travail: req.body.nb_jours_travail,
            libelle: req.body.libelle,
            siteweb: req.body.siteweb
        }
        // Check if user exists
        const foundUser = await User.findOne({'local.email': email});
        if(foundUser){
            return res.status(403).json({error : 'User already exists'});
        }
        // Create a new User
        const newUser = new User({
            method: 'local',
            user_type: user_type,
            local:{
                email: email,
                password: password,
                nom: nom,
                prenom: prenom,
                num_portable: num_portable,
                num_fixe: num_fixe,
                image: image,
                horaire_travail: horaire_travail,
                nb_jours_travail: nb_jours_travail,
                libelle: libelle,
                siteweb: siteweb
            }
        });
        await newUser.save();

        // Create a token and Respond with it
        const token = signToken(newUser);
        return res.status(200).json({token});
    },
    signUpAdmin: async (req, res, next) => {
        if(req.body.user_type != "admin"){
            return res.status(400).json({"message": "This only for admins"});
        }
        const {user_type, email, password} = {
            user_type: req.body.user_type,
            email: req.body.email,
            password: req.body.password
        }
        // Check if user exists
        const foundUser = await User.findOne({'admin.email': email});
        if(foundUser){
            return res.status(403).json({error : 'Admin already exists'});
        }
        // Create a new User
        const newUser = new User({
            method: 'local',
            user_type: user_type,
            local: {
                email: email,
                password: password
            }
        });
        await newUser.save();
        
        // Create a token and Respond with it
        const token = signToken(newUser);
        return res.status(200).json({token});
    },
    signIn : async (req, res, next) => {
        // Generate Token
        console.log("Sign in !");
        const user = req.user;
        const token = signToken(user);
        console.log(user);
        res.status(200).json({token})
    },
    googleOAuth: async (req, res, next) => {
        const token = signToken(req.user);
        res.status(200).json({token});
    },
    facebookOAuth: async (req, res, next) => {
        const token = signToken(req.user);
        res.status(200).json({token});
        
    },
    secret : async (req, res, next) => {
        res.send('Secret');
        console.log("Secret !");
    },
    getAll_users: async (req, res, next) => {
        //const all_users  = await User.findOne({'facebook.id':'2388969841195170'});
        const all_users  = await User.find();
        if(!all_users){
            return res.status(403).json({error : 'There is no users'});
        }
        return res.status(200).json(all_users);
    },
    updateUser: async (req, res, next) => {
        var myquery = { _id: "5d39ab01b699c708686caeb5" };
        var newvalues = { $set: {num_portable: "12345321", num_fixe: "12345668" } };
        const user = await User.findById('5d39ab01b699c708686caeb5');
          console.log(user);
          await user.save();
        return res.status(200).json({user});
    }
    
}