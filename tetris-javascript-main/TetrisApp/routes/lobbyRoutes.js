const express = require('express');
const { default: mongoose } = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB', err));
const Lobby = require('../models/Lobby');
const router = express.Router();


router.post('/create', async (req, res) => {
    try {
        const { lobby_name } = req.body;
        console.log('Received:', req.body);

        // TODO SAVE THE SCHEMA
        // Create a new lobby
        const newLobby = {
            name: lobby_name,
            current_users: 1
        };
        console.log('New lobby:', newLobby);
        // Save the lobby to the database
        const lobby = new Lobby(newLobby);
        await lobby.save();

        console.log('Lobby saved:', newLobby);

        // Associate the lobby with the user

        res.status(201).send({ message: 'Lobby created successfully', lobby: newLobby });
    } catch (error) {
        res.status(500).send({ message: 'Error creating lobby', error: error.message });
    }
});



router.get('/lobbies', async (req, res) => {
    try {
        const lobbys = await Lobby.find({ createdBy: req.userId });
        console.log('Lobbies:', lobbys);
        let html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Your Lobbies</title>
            </head>
            <body>
                <h1>Your Lobbies</h1>
                <ul>
        `;
        lobbys.forEach(lobby => {
            html += `<li><a href="${lobby._id}">${lobby.name}</a></li>`;
        });
        html += `
                </ul>
            </body>
            </html>
        `;
        res.status(200).send(html);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching lobbies', error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        console.log('Fetching lobby:', req.params);
        const lobby = await Lobby.findById(req.params.id);
        res.status(200).send(lobby);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching lobby', error: error.message });
    }
});

router.put('/:id', async (req, res) => {

    try {
        const lobby = await Lobby.findById(req.params.id);
        lobby.current_users += 1;
        await lobby.save();
        res.status(200).send(lobby);
    } catch (error) {
        res.status(500).send({ message: 'Error joining lobby', error: error.message });
    }
});

router.post('/join', async (req, res) => {
    try {
        const { lobby_id } = req.body;
        const lobby = await Lobby.findById(lobby_id);
        lobby.current_users += 1;
        await lobby.save();
        res.redirect('/lobby/' + lobby_id);
    } catch (error) {
        res.status(500).send({ message: 'Error joining lobby', error: error.message });
    }
});




module.exports = router;


