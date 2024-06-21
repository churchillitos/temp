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
        if (mails.length > 0) {
            const b = mails[0];
            const message = `You have a message!\n\nFrom: ${b.from}\n\nSubject: ${b.subject}\n\nMessage: ${b.textBody}\nDate: ${b.date}`;
            res.json({ message });
            await mail.deleteMail();
        } else {
            res.json({ message: 'No new messages' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
