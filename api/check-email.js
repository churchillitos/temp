const { TempMail } = require('1secmail-api');

export default async (req, res) => {
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
};
