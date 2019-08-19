const mongoose = require('mongoose');
//Define a schema
const Schema = mongoose.Schema;
const DomaineSchema = new Schema({
 libelle: {
  type: String,
  trim: true,  
  required: true,
 },
 image: {
  type: String,
  trim: true,
  required: true
 }
});
module.exports = mongoose.model('Domaine', DomaineSchema)