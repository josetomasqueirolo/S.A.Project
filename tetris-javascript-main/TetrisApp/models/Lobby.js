const moongose = require('mongoose');  
const Schema = new moongose.Schema({
    name: { type: String, required: true },
    current_users: { type: Number, required: true }
});

module.exports = moongose.model('Lobby', Schema);