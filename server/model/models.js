const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10;

const {
    Schema,
} = mongoose;

const UserSchema = new Schema({
    username: {
        type: String,
        trim: true,
        required: true,
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
});

UserSchema.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, saltRounds);
    next();
});

const UserDAO = mongoose.model('user', UserSchema)

const PhotoSchema = new Schema({
    path: String,
    hash: String,
})

// TODO: Create pre delete hooks

const PhotoDAO = mongoose.model('photo', PhotoSchema);

const AlbumDAO = mongoose.model('album', new Schema({
    name: String,
    coverIndex: Number,
    photos: [{
        type: PhotoSchema,
        ref: 'photo'
    }],
    date: Date,
    hidden: Boolean
}))

const SettingsDAO = mongoose.model('settings', new Schema({
    name: String,
    value: Object
}))

module.exports = {
    UserDAO,
    PhotoDAO,
    SettingsDAO,
    AlbumDAO,
}