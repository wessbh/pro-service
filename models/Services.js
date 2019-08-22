const mongoose = require('mongoose');
//Define a schema
const Schema = mongoose.Schema;

const ServiceSchema = new Schema({
    libelle: {
        type: String,
        trim: true,
        required: true,
    },
    image: {
        type: String,
        trim: true,
        required: true
    },
    category: { type: Schema.Types.ObjectId, ref: 'Category' }
});
module.exports = mongoose.model('Service', ServiceSchema)