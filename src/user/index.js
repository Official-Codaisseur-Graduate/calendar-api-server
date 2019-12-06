const { Router } = require('express');
const Sequelize = require('sequelize');

const User = require('./model');
const { checkInteger } = require('../checkData');
const { beAssistantRequest } = require('../sendEmail/index');
const { getEmailCredentials } = require('../sendEmail/middleware');
const router = new Router();

router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'email', 'name', 'profilePic', 'rank'],
            where: { password: { [Sequelize.Op.ne]: null } },
        });
        return res.send({
            users,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            message: 'Internal server error.',
        });
    }
});

router.put('/userrank/:id', async (req, res) => {
    try {
        if (req.user.rank < 3) {
            return res.status(403).send({
                message:
                    'Only admin users and teacher users can set ' +
                    'user ranks.',
            });
        }

        if (!checkInteger(parseFloat(req.params.id), 1)) {
            return res.status(400).send({
                message: 'User ID must be a positive round number.',
            });
        }

        if (req.user.id === parseInt(req.params.id)) {
            return res.status(403).send({
                message: 'You cannot adjust your own user rank.',
            });
        }

        if (!checkInteger(parseFloat(req.body.rank), 0, 4)) {
            return res.status(400).send({
                message: "'rank' must be a round number between 0 and 4.",
            });
        }

        const user = await User.findByPk(parseInt(req.params.id));
        if (!user || !user.password) {
            return res.status(404).send({
                message: 'User ID not found.',
            });
        }

        if (req.user.rank < 4 && parseInt(user.rank) > 2) {
            return res.status(403).send({
                message:
                    'Only admin users can change the rank of an ' +
                    'admin or a teacher.',
            });
        }

        if (req.user.rank < 4 && parseInt(req.body.rank) > 2) {
            return res.status(403).send({
                message:
                    "Only admin users can set a user's rank to " +
                    'admin or teacher.',
            });
        }

        user.update({
            rank: parseInt(req.body.rank),
        });
        return res.send({
            updateUser: {
                id: user.id,
                email: user.email,
                name: user.name,
                profilePic: user.profilePic,
                rank: user.rank,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            message: 'Internal server error.',
        });
    }
});

router.patch('/editProfile', async (req, res, next) => {
    const user = req.user;
    const { name, profilePic } = req.body;

    if (!name && profilePic) {
        const updatedUser = await user.update({ profilePic });
        res.status(200).send({
            message: 'Your profile pic is updated!',
            updatedUser,
        });
    }
    if (name && !profilePic) {
        const updatedUser = await user.update({ name });
        res.status(200).send({
            message: 'Your name is updated!',
            updatedUser,
        });
    }
    if (name && profilePic) {
        const updatedUser = await user.update({ name, profilePic });
        res.status(200).send({
            message: 'Your profile is updated!',
            updatedUser,
        });
    }
});

router.post('/assistant-request', getEmailCredentials, async (req, res) => {
    const user = req.user;
    console.log('REQ.TRANSPORT: ', req.transport);
    console.log('REQ BODY', req.body);
    try {
        await beAssistantRequest(
            req.transport,
            req.body.teacherEmail,
            req.body.event,
            user
        );
        return res.send({
            message:
                'Request email sent. Now wait for a teacher to accept your request.',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            message: 'Internal server error.',
        });
    }
});

module.exports = router;
