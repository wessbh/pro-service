const express = require('express');
const router = express.Router();
const CardsController = require('../controllers/cardsController');
const {validateBody, schemas} = require('../helpers/routeHelpers');

    router.route('/add_card')
        .post(validateBody(schemas.card_schema), CardsController.addCard);
        
module.exports = router;