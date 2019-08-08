const passport = require ('passport');
const JwtStrategy = require ('passport-jwt').Strategy;
const LocalStrategy = require ('passport-local').Strategy;
const GooglePlusTokenStrategy = require ('passport-google-plus-token');
const FacebookTokenStrategy = require ('passport-facebook-token');

const {ExtractJwt} = require ('passport-jwt');
const config = require ('./configuration');
const User = require ('./models/User');

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.JWT_SECRET
},async(payload, done)=>{
    try{
        //find the user specified in the token
        const user = await User.findById(payload.sub);
        // if user doesn't existe, handle it
        if(!user){
            return done(null, false);
        }
        // otherwise return the user
        done(null, user);
    }
    catch(error){
        done(error, false);
    }
}));

// Google OAuth Strategy
passport.use('googleToken', new GooglePlusTokenStrategy({
    clientID: '682827997110-ls2m56lbl2ip3srurjup21ldc7maul98.apps.googleusercontent.com',
    clientSecret: 'kHE3Z8DB5ojAWJ8WmC0q58Ny'
}, async(accessToken, refreshToken, profile, done)=>{
    try{
        // console.log('accessToken: '+accessToken);
        // console.log('refreshToken: '+refreshToken);
        // console.log('profile: '+JSON.stringify(profile));

        // Check if the user exists
        const existingUser = await User.findOne({"google.id": profile.id});
        if(existingUser){
            console.log("User already exists");
            return done(null, existingUser);
        }
        // if the user doesn't exist
        console.log(profile);
        
        const newUser = new User({
            method: 'google',
            google: {
                id: profile.id,
                email: profile.emails[0].value,
                image: profile.photos[0].value
            }
        } );
        console.log("User doesn't exist, Creating a new one...");
        await newUser.save();
        done(null, newUser);
    }
    catch(error){
        done(error, false, error.message);
    }

}));

passport.use('facebookToken', new FacebookTokenStrategy ({
    // clientID: config.oauth.facebook.clientID,
    // clientSecret: config.oauth.facebook.clientSecret
            clientID: '1232944663534222',
            clientSecret: '9c3caee27c204b99c0afe463208b622e'
}, async (accessToken, refreshToken, profile, done)=> {
    try {
        console.log('accessToken: '+accessToken);
        console.log('refreshToken: '+refreshToken);
        console.log('profile: '+JSON.stringify(profile));
        const existingUser = await User.findOne({ "facebook.id": profile.id});
        if(existingUser){            
            return done(null,existingUser);
        }
        const newUser = new User({
            method : 'facebook',
            user_type: 'client',
            facebook: {
                id: profile.id,
                email: profile.emails[0].value,
                image: profile.photos[0].value
            }   
        });
        
        await newUser.save(); 
        done(null, newUser);
    } catch (error) {
        done(error, false, error.message);
    }
}));

// Local strategy configuration
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async(email, password, done)=> {
    try {
        // Find user by the given email
        const user = await User.findOne({'local.email': email});
        // If the user doesn't existe, handle it
        if(!user){
            console.log("There is no user");
            return done(null, false);
        }

        // else, check if the password is correct
        console.log("----"+ email +" : " + password);
        console.log(user.local.email);
        const isMatch = await user.isValidPassword(password);
        // if the password is wrong, handle it
        if(!isMatch){
            return done(null, false);
        }
        done(null, user);
    } catch (error) {
        done(error, false);
    }
}));

/* 
app secret: 9c3caee27c204b99c0afe463208b622e
app_id: 1232944663534222
*/