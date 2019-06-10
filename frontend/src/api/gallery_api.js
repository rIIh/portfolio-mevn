const axios = require('axios')

export async function getAlbums() {
    const response = await axios.get("api/albums").catch(e => console.log(e));
    return response.data;
}

export async function updateAlbums(albums) {
    const response = await axios.put("api/albums", albums);
    console.log(response);
}

export async function updateAlbum(album, was) {
    var form = new FormData();
    form.append("name", album.name);
    form.append("coverIndex", album.coverIndex);
    album.photos.forEach((e, i) => {
        console.log(e.path)
        if (e.file === undefined)
            form.append('photos[' + i + ']', e.path);
        else form.append('files[' + i + ']', e.file)
    });
    // form.append('photos', album.photos);
    const response = await axios.put("api/albums/" + was.name, form, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    console.log(response);
    return response
}

export async function uploadAlbum(album) {
    var form = new FormData();
    form.append("name", album.name);
    form.append("coverIndex", album.coverIndex);
    album.photos.forEach((e, i) => {
        console.log(e.file)
        form.append('files[' + i + ']', e.file);
    });
    const response = await axios.post("api/albums/", form, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response;
}

export async function removeAlbum(album) {
    var response = await axios.delete('api/albums/' + album.name);
    return response
}