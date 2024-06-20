const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const CACHE_PATH = path.join(__dirname, 'cache', 'spotify.mp3');

// Ensure cache directory exists
if (!fs.existsSync(path.join(__dirname, 'cache'))) {
    fs.mkdirSync(path.join(__dirname, 'cache'));
}

app.use(express.static('public'));
app.use(express.json());

app.post('/spotify', async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) return res.status(400).send({ error: 'Missing title of the song' });

        const searchResponse = await axios.get(`https://lyrist.vercel.app/api/${encodeURI(query)}`);
        const { lyrics, title } = searchResponse.data;
        
        // Assuming an alternative way to get song URL and download link
        // const songUrl = ...;
        // const downloadResponse = ...;

        // Instead of using spotifydl, we use axios directly if we have the URL
        const songData = (await axios.get(songUrl, { responseType: 'arraybuffer' })).data;

        fs.writeFileSync(CACHE_PATH, Buffer.from(songData, 'utf-8'));

        res.send({
            title,
            lyrics,
            downloadLink: songUrl, // Change this to the actual download link
            audioFile: '/cache/spotify.mp3'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred while processing your request.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
