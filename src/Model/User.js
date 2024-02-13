const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
        }
    }]
}, {
    timestamps: true
})


UserSchema.virtual('chats', {
    ref: 'Chat',
    localField: '_id',
    foreignField: 'users',
})

UserSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        const bcryptedPassword = await bcrypt.hash(user.password, 10)
        user.password = bcryptedPassword
    }
    next()
})

UserSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.tokens
    delete userObject.password
    return userObject
}

UserSchema.methods.createToken = async function () {
    const user = this
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECERT, { expiresIn: "7d" })
    user.tokens.push({ token: token })
    const expireTime = Date.now() + 604800000
    await user.save()
    return { token, expireTime }
}

UserSchema.post('save', (error, doc, next) => {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('Email is already in use'));
    } else {
        next(error);
    }
});

const User = mongoose.model('User', UserSchema)
module.exports = User