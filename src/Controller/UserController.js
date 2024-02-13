const express = require('express')
const status = require('http-status')
const User = require('../Model/User')
const bcrypt = require('bcrypt')
const validator = require('validator')

class UserController {
    static async SignUp(req, res) {
        try {
            const user = new User(req.body)
            if (!validator.isEmail(req.body.email)) throw new Error('Invalid email address')
            const { token, expireTime } = await user.createToken()
            await user.save()
            res.send({ user: user, token: token, expireTime })
        }
        catch (err) {
            const errorMessage = err.message || 'An error occurred.';
            res.status(400).send({ error: errorMessage });
        }
    }

    static async Login(req, res) {
        try {
            const user = await User.findOne({ email: req.body.email })
            if (!user) throw new Error('Invalid Username or Password!')
            const verifyPassword = await bcrypt.compare(req.body.password, user.password)
            if (!verifyPassword) throw new Error('Invalid Username or Password!')
            const { token, expireTime } = await user.createToken()
            res.status(200).send({ user: user, token: token, expireTime: expireTime })
        }
        catch (err) {
            const errorMessage = err.message || 'An error occurred during login.';
            res.status(400).send({ error: errorMessage });
        }
    }


    static async logOut(req, res) {
        try {
            const filteredToken = req.user.tokens.filter((token) => token.token !== req.token)
            req.user.tokens = filteredToken;
            await req.user.save();
            res.send(req.user);
        }
        catch (err) {
            res.status(400).send(err.message)
        }
    }

    static async searchUser(req, res) {
        try {
            findUserByName(req.query.search, req.user._id)
                .then((result) => {
                    res.status(200).send(result)
                })
        }
        catch (err) {
            res.status(401).send(err.message)
        }
    }

}

const findUserByName = async (name, userId) => {
    try {
        const regex = new RegExp(name, 'i');
        const result = await User.aggregate([
            {
                $match: {
                    name: { $regex: regex },
                    _id: { $ne: userId }
                }
            },
            {
                $project: {
                    name: 1,
                    _id: 1
                }
            }
        ]);

        return result;
    } catch (error) {
        console.error('Error finding user by name:', error);
        throw error;
    }
};

module.exports = UserController