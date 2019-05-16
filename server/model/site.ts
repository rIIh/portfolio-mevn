import * as mongoose from 'mongoose';
const {
    Schema,
} = mongoose;

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
    cover: {
        type: PhotoSchema,
        ref: 'photo'
    },
    date: Date,
    photos: [{
        type: PhotoSchema,
        ref: 'photo'
    }],
}))

const TemplateDAO = mongoose.model('template', new Schema({
    name: {
        type: String,
    },
    value: String,
}))

export default {
    UserDAO,
    PhotoDAO,
    AlbumDAO,
    TemplateDAO
}