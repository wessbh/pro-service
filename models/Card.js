const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const  cardSchema = new Schema({
    card_number: {
        type: Number,
        minlength: 16,
        maxlength: 16
    },
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
    },
    card_type : {
        type : String,
        enum: ['credit', 'edinar']
    },
    credit: {
        expiration_date: String,
        cvv: Number
    },
    edinar: {
        password: {
            type: Number,
            minlength: 8,
            maxlength: 8
        }
    }
});

// Create Module
const Card = mongoose.model('card', cardSchema);
// Export Module
module.exports = Card;