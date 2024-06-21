const express = require('express');
const { TempMail } = require('1secmail-api');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

function generateRandomId() {
    var length = 6;
    var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var randomId = '';

    for (var i = 0; i < length; i++) {
        randomId += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return randomId;
}

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/generate-email', async (req, res) => {
    try {
        const mail = new TempMail(generateRandomId());
        mail.autoFetch();
        res.json({ email: mail.address });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/check-email', async (req, res) => {
    const emailId = req.query.id;
    try {
        const mail = new TempMail(emailId);
        const mails = await mail.getMail();
        const messages = mails.map(m => ({
            from: m.from,
            subject: m.subject,
            body: m.textBody,
            date: m.date
        }));
        res.json({ messages });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Serve index.html for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
