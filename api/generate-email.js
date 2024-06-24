const { TempMail } = require('1secmail-api');

function generateRandomId() {
    var length = 6;
    var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var randomId = '';
    for (var i = 0; i < length; i++) {
        randomId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomId;
}

export default async (req, res) => {
    try {
        const mail = new TempMail(generateRandomId());
        mail.autoFetch();
        res.json({ email: mail.address });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
