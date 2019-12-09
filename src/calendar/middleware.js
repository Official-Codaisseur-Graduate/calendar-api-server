const { google } = require('googleapis');

const Config = require('../config/model');

let jwtClient = undefined;

const resetClient = () => {
    jwtClient = undefined;
};

const getCalendar = async (req, res, next) => {
    try {
        if (
            !jwtClient ||
            jwtClient.credentials.expiry_date < Date.now() + 10000
        ) {
            const client_email_entry = await Config.findOne({
                where: { key: 'client_email' },
            });
            if (!client_email_entry || !client_email_entry.data) {
                return res.status(503).send({
                    message: 'No Google API configuration set by admin.',
                });
            }

            const private_key_entry = await Config.findOne({
                where: { key: 'private_key' },
            });
            if (!private_key_entry || !private_key_entry.data) {
                return res.status(503).send({
                    message: 'No Google API configuration set by admin.',
                });
            }

            jwtClient = new google.auth.JWT(
                client_email_entry.data,
                null,
                private_key_entry.data,
                ['https://www.googleapis.com/auth/calendar.readonly']
            );

            await jwtClient.authorize();
        }

        req.calendar = google.calendar({
            auth: jwtClient,
            version: 'v3',
        });
        next();
    } catch (error) {
        return res.status(500).send({
            message: 'error getcalendar.',
        });
    }
};

const getCalendarId = async (req, res, next) => {
    try {
        const calendar_id_entry = await Config.findOne({
            where: { key: 'calendar_id' },
        });
        if (!calendar_id_entry || !calendar_id_entry.data) {
            return res.status(503).send({
                message: 'No Calendar ID configuration set by admin.',
            });
        }

        req.calendarId = calendar_id_entry.data;
        next();
    } catch (error) {
        return res.status(500).send({
            message: 'Internal server error.',
        });
    }
};

module.exports = { resetClient, getCalendar, getCalendarId };
