const Card = require ('../models/Card');
module.exports = {
    addCard : async (req, res, next) => {
        if(req.body.card_type == 'credit'){

            const {id_user, card_number, expiration_date, cvv} = {
                id_user: req.body.id_user,
                card_number: req.body.card_number,
                expiration_date: req.body.expiration_date,
                cvv: req.body.cvv,
            }

            // Check if card exists
            const foundCard = await Card.findOne({'card_number': card_number});
            if(foundCard){
                return res.status(403).json({error : 'Card already exists'});
            }
            // Create a new card
            const newCard = new Card({
                card_type: 'credit',
                id_user: id_user,
                card_number: card_number,
                credit: {
                    expiration_date: expiration_date,
                    cvv: cvv,
                }
            });
            
        await newCard.save();
        
        return res.status(200).json({'message: ': 'Card added !'});
        }
    }
}