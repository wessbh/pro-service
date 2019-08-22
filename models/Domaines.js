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
    }
});
const CategorySchema = new Schema({
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
    services: [ServiceSchema]
});
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
    },
    categories: [CategorySchema]
});

DomaineSchema.methods.getSingleCategory = async function (id_domaine, id_category) {
    try {
        return await domaineModel.find({ _id: id_domaine },
            { categories: { $elemMatch: { _id: id_category } } });
    } catch (error) {
        throw new Error(error);
    }
}
DomaineSchema.methods.getAllCategories = async function (id_domaine) {
    try {
        return await domaineModel.find({ _id: id_domaine }).select('categories');
    } catch (error) {
        throw new Error(error);
    }
}
CategorySchema.methods.getSingleCat = async function (id_category) {
    try {
        return await categoryModel.find({ _id: id_category });
    } catch (error) {
        throw new Error(error);
    }
}
const domaineModel = mongoose.model('Domaine', DomaineSchema);
const categoryModel = mongoose.model('Category', CategorySchema);
const serviceModel = mongoose.model('Service', ServiceSchema);
module.exports = domaineModel;
