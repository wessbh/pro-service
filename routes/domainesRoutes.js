const express = require('express');
const router = express.Router();
const domaineController = require('../controllers/domainesController');
const passport = require ('passport');
const passportJWT = passport.authenticate('jwt', { session: false });



router.route('/').get(passportJWT, domaineController.getAll);
router.route('/').post(passportJWT, domaineController.create);
router.route('/:domaineId').get(passportJWT, domaineController.getById);
router.route('/:domaineId').put(passportJWT, domaineController.updateById);
router.route('/:domaineId').delete(passportJWT, domaineController.deleteById);

module.exports = router;