const mongoose = require ('mongoose');
const bcrypt = require('bcryptjs'); 
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

//Create Card schema

const  cardSchema = new Schema({
    card_number: {
        type: Number,
        minlength: 16,
        maxlength: 16,
        unique: true
    },
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
    },
    card_type : {
        type : String,
        enum: ['credit', 'edinar']
    },
    expiration_date: String,
    cvv: Number,
    password_edinar: {
        type: Number,
        minlength: 8,
        maxlength: 8
    }
});
cardSchema.plugin(uniqueValidator);
// Create User Schema
const  userSchema = new Schema({
    method : {
        type : String,
        enum: ['local', 'facebook', 'google'],
        required: true
    },
    user_type : {
        type : String,
        enum: ['client', 'pro', 'admin', 'super_admin'],
        required: true
    },
    local: {

        email: {
            type: String,
            lowercase: true
        },
        password: {
            type: String,
            minlength: 4,
        },
        nom: {
            type: String,
            minlength: 4
        },
        prenom: {
            type: String,
            minlength: 4
        },
        num_portable: {
            type: Number,
            minlength: 8
        },
        num_fixe: {
            type: Number,
            minlength: 8
        },
        image: String,        
        horaire_travail: String,
        nb_jours_travail: Number,
        libele: {
            type: String
        },
        siteweb:{
            type: String
        }
    },
    cards: [cardSchema],
    google: {
        id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        },
        image: {
            type: String
        }
    },
    facebook: {
        id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        },
        image: {
            type: String
        },
        num_portable: {
            type: Number,
            minlength: 8
        },
        num_fixe: {
            type: Number,
            minlength: 8
        }
    },

});

// Hash password before saving the user
userSchema.pre('save', async function (next){
    try {
        if(this.method !== 'local'){
            next();
        }

        // Generate Salt for the password encryption
        const salt = await bcrypt.genSalt(15);
        // Generate a hashed password using Salt
        const passwordHash = await bcrypt.hash(this.local.password, salt);
        // Re-assign the hashed password to the user's acuatl password
        this.local.password = passwordHash;
        next();
        console.log ('Salt: '+ salt);
        console.log ('Original password: ' + this.local.password);
        console.log ('Hashed Password: ' +passwordHash);
    } catch (error) {
        next(error);
    }
});

// Compare hashedpassword vs password stored in db
userSchema.methods.isValidPassword  = async function(newPassword) {
    try {
        return await bcrypt.compare(newPassword, this.local.password);
    } catch (error) {
        throw new Error (error);
    }
}
 
// Create Module
const User = mongoose.model('user', userSchema);
// Export Module
module.exports = User;