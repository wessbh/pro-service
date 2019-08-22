const domaineModel = require('../models/Domaines');
const mongoose = require('mongoose');
var Domaine = mongoose.model('Domaine');
var Category = mongoose.model('Category');
var Service = mongoose.model('Service');
module.exports = {
  getById: function (req, res, next) {
    console.log(req.body);
    domaineModel.findById(req.params.domaineId, function (err, domaineInfo) {
      if (err) {
        next(err);
      } else {
        res.json({ status: "success", message: "Domaine found!!!", data: { domaines: domaineInfo } });
      }
    });
  },
  getAll: async (req, res, next) => {
    const all_domaines = await domaineModel.find();
    if (!all_domaines) {
      return res.status(403).json({ error: 'There is no users' });
    }
    return res.status(200).json(all_domaines);
  },
  updateById: function (req, res, next) {
    domaineModel.findByIdAndUpdate(req.params.domaineId, { libelle: req.body.libelle, image: req.body.image }, function (err, domaineInfo) {
      if (err)
        next(err);
      else {
        res.json({ status: "success", message: "Domaine updated successfully!!!", data: null });
      }
    });
  },
  deleteById: function (req, res, next) {
    domaineModel.findByIdAndRemove(req.params.domaineId, function (err, domaineInfo) {
      if (err)
        next(err);
      else {
        res.json({ status: "success", message: "Domaine deleted successfully!!!", data: null });
      }
    });
  },
  create: function (req, res, next) {
    domaineModel.create({ libelle: req.body.libelle, image: req.body.image }, function (err, result) {
      if (err)
        next(err);
      else
        res.json({ status: "success", message: "Domaine added successfully!!!", data: null });

    });
  },
  add_category: async (req, res, next) => {
    var id_domaine = req.body.domaineId;
    const { libelle, image } = { libelle: req.body.libelle, image: req.body.image }
    var domaine = await domaineModel.updateOne(
      { _id: id_domaine },
      {
        $push: {
          categories: {
            libelle: libelle,
            image: image
          }
        }
      }
    );
    if (!domaine) {
      res.status(404).json({ "message": "domaine not found" });
    }
    res.status(200).json({ "message": "category added" });
  },
  getCategory: async (req, res, next) => {
    var id_domaine = req.params.domaineId;
    var id_category = req.params.categoryId;
    const domaine = await domaineModel.findById(id_domaine);
    console.log(domaine);
    const category = await domaine.getSingleCategory(id_domaine, id_category);
    console.log(category);
    if (!(category)) {
      res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json(category);
  },
  getAllCategories: async (req, res, next) => {
    var id_domaine = req.params.domaineId;
    const domaine = await domaineModel.findById(id_domaine);
    const categories = await domaine.getAllCategories(id_domaine);
    if (!(categories)) {
      res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json(categories);
  },
  add_service: async (req, res, next) => {
    var id_domaine = req.body.domaineId;
    var id_category = req.body.categoryId;
    var domaine = await domaineModel.findById(id_domaine);
    var category_details = await domaine.getSingleCategory(id_domaine, id_category);
    var category = new Category();
    var service = new Service();
    category._id = category_details[0].categories[0]._id;
    category.libelle = category_details[0].categories[0].libelle;
    category.image = category_details[0].categories[0].image;
    var services_array = category_details[0].categories[0].services;
    service.libelle = req.body.libelle;
    service.image = req.body.image;
    services_array.push(service);
    category.services = services_array;

    await domaineModel.updateOne(
      { _id: id_domaine },
      {
        $pull: {
          categories: {
            _id: category._id,
          }
        }
      }
    );
    await domaineModel.updateOne(
      { _id: id_domaine },
      {
        $push: {
          categories: {
            _id: category._id,
            libelle: category.libelle,
            image: category.image,
            services: category.services
          }
        }
      }
    );
    res.status(200).json(category);
  },
  delete_service: async (req, res, next) => {
    var id_domaine = req.body.domaineId;
    var id_category = req.body.categoryId;
    var service_id = req.body.serviceId;
    var domaine = await domaineModel.findById(id_domaine);
    var category_details = await domaine.getSingleCategory(id_domaine, id_category);
    var category = new Category();
    var service = new Service();
    category._id = category_details[0].categories[0]._id;
    category.libelle = category_details[0].categories[0].libelle;
    category.image = category_details[0].categories[0].image;
    var services_array = category_details[0].categories[0].services;
    service._id = service_id
    service.libelle = req.body.libelle;
    service.image = req.body.image;
    var picked = services_array.find(s => s._id == service_id);
    services_array.pull(picked);
    category.services = services_array;
    // await category.updateOne({ _id: id_category },
    //   {
    //     $pull: {
    //       services: {
    //         _id: service_id
    //       }
    //     }
    //   }
    // );

    await domaineModel.updateOne(
      { _id: id_domaine },
      {
        $pull: {
          categories: {
            _id: category._id,
          }
        }
      }
    );
    await domaineModel.updateOne(
      { _id: id_domaine },
      {
        $push: {
          categories: {
            _id: category._id,
            libelle: category.libelle,
            image: category.image,
            services: category.services
          }
        }
      }
    );
    res.status(200).json(services_array);
  }

}
