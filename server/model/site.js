const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const UserDAO = mongoose.model('user', new Schema({
    username: String,
    password: String,
    salt: String
}))

const PhotoSchema = new Schema({
    path: String,
    hash: String,
})

const PhotoDAO = mongoose.model('photo', PhotoSchema);

const AlbumDAO = mongoose.model('album', new Schema({
    name: String,
    cover: { type: PhotoSchema, ref: 'photo' },
    date: Date,
    photos: [{ type: PhotoSchema, ref: 'photo' }],
}))

module.exports = {
    UserDAO,
    PhotoDAO,
    AlbumDAO
}