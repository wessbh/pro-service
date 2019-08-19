const domaineModel = require('../models/Domaines');
module.exports = {
 getById: function(req, res, next) {
  console.log(req.body);
  domaineModel.findById(req.params.domaineId, function(err, domaineInfo){
   if (err) {
    next(err);
   } else {
    res.json({status:"success", message: "Domaine found!!!", data:{domaines: domaineInfo}});
   }
  });
 },
getAll: function(req, res, next) {
  let domainesList = [];
domaineModel.find({}, function(err, domaines){
   if (err){
    next(err);
   } else{
    for (let domaine of domaines) {
     domainesList.push({id: domaine._id, libelle: domaine.libelle, image: domaine.image});
    }
    res.json({status:"success", message: "Domaines list found!!!", data:{domaines: domainesList}});
       
   }
});
 },
updateById: function(req, res, next) {
  domaineModel.findByIdAndUpdate(req.params.domaineId,{libelle:req.body.libelle, image:req.body.image}, function(err, domaineInfo){
if(err)
    next(err);
   else {
    res.json({status:"success", message: "Domaine updated successfully!!!", data:null});
   }
  });
 },
deleteById: function(req, res, next) {
  domaineModel.findByIdAndRemove(req.params.domaineId, function(err, domaineInfo){
   if(err)
    next(err);
   else {
    res.json({status:"success", message: "Domaine deleted successfully!!!", data:null});
   }
  });
 },
create: function(req, res, next) {
  domaineModel.create({ libelle: req.body.libelle, image: req.body.image }, function (err, result) {
      if (err) 
       next(err);
      else
       res.json({status: "success", message: "Domaine added successfully!!!", data: null});
      
    });
 },


}
