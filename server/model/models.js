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

const TemplateDAO = mongoose.model('template', new Schema({
    name: {
        type: String,
    },
    value: String,
}))

module.exports = {
    UserDAO,
    PhotoDAO,
    AlbumDAO,
    TemplateDAO
}