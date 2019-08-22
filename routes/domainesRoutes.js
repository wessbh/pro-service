const express = require('express');
const router = express.Router();
const domaineController = require('../controllers/domainesController');
const passport = require('passport');
const passportJWT = passport.authenticate('jwt', { session: false });



router.route('/').get(passportJWT, domaineController.getAll);
router.route('/').post(passportJWT, domaineController.create);
router.route('/:domaineId').get(passportJWT, domaineController.getById);
router.route('/:domaineId').put(passportJWT, domaineController.updateById);
router.route('/:domaineId').delete(passportJWT, domaineController.deleteById);
router.route('/add_category').post(passportJWT, domaineController.add_category);
router.route('/getCategory/:domaineId/:categoryId').get(passportJWT, domaineController.getCategory);
router.route('/get_all_categories/:domaineId').get(passportJWT, domaineController.getAllCategories);
router.route('/add_service').post(passportJWT, domaineController.add_service);
router.route('/delete_service').post(passportJWT, domaineController.delete_service);

module.exports = router;