const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const express = require('express');
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
});
const PhotoDAO = mongoose.model('photo', PhotoSchema);

const AlbumScheme = new Schema({
    name: String,
    coverIndex: Number,
    photos: [{
        type: PhotoSchema,
        ref: 'photo'
    }],
    date: Date,
    hidden: Boolean
});
AlbumScheme.post('remove', function(doc) {
    console.log('Remove post hook for album', doc)
    var fs = require('fs');
    doc.photos.forEach(photo => {
        fs.unlink('resources/' + photo.path, (err, res) => console.log(err,res));
    });
    //fs.unlink(filePath, callbackFunction)
});
async function inspectStorage(oldValue, newValue){
    var fs = require('fs');
    var deletedPhotos = oldValue.photos.filter(oldPhoto => 
        newValue.photos.filter(newPhoto => newPhoto._id == oldPhoto._id).length === 0
    );
    deletedPhotos.forEach(photo => {
        fs.unlink('resources/' + photo.path, (err, res) => console.log(err,res));
    });
}
const AlbumDAO = mongoose.model('album', AlbumScheme)

const SettingsDAO = mongoose.model('settings', new Schema({
    name: String,
    value: Object
}))

module.exports = {
    UserDAO,
    PhotoDAO,
    SettingsDAO,
    AlbumDAO,
    inspectStorage
}