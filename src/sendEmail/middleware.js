const nodemailer = require('nodemailer');

const Config = require('../config/model');

const getEmailCredentials = async (req, res, next) => {
    try {
        const send_email_entry = await Config.findOne({
            where: { key: 'send_email' },
        });
        if (!send_email_entry || !send_email_entry.data) {
            return res.status(503).send({
                message: 'No send email configuration set by admin.',
            });
        }

        const send_password_entry = await Config.findOne({
            where: { key: 'send_password' },
        });
        if (!send_password_entry || !send_password_entry.data) {
            return res.status(503).send({
                message: 'No send email configuration set by admin.',
            });
        }

        req.transport = await nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: send_email_entry.data,
                pass: send_password_entry.data,
            },
        });
        next();
    } catch (error) {
        return res.status(500).send({
            message: 'Internal server error.',
        });
    }
};

module.exports = { getEmailCredentials };
