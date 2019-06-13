const axios = require("axios");

export async function getAlbums() {
    const response = await axios.get("api/albums").catch(e => console.log(e));
    return response.data;
}

export async function updateAlbums(albums) {
    const response = await axios.put("api/albums", albums);
    return response;
}

export async function updateAlbum(album) {
    return updateAlbums([album]);
}

export async function sendNewAlbumPhotos(id, files, onprogress) {
    var form = new FormData();
    files.forEach((f, i) => {
        form.append("files[" + i + "]", f);
    });
    var response = await axios.post("api/albums/" + id + "/photos_post", form, {
        headers: {
            "Content-Type": "multipart/form-data"
        },
        onUploadProgress: data => {
            let percent = Math.floor((data.loaded * 100) / data.total);
            onprogress(percent);
        }
    });
    return response;
}

export async function uploadAlbum(album, onprogress, explode) {
    var form = new FormData();
    form.append("name", album.name);
    form.append("coverIndex", album.coverIndex);
    if (explode) {
        album.photos.forEach((e) => {
            form.append("files[0]", e.file);
        });
    }
    album.photos.forEach((e, i) => {
        form.append("files[" + i + "]", e.file);
    });
    const response = await axios.post("api/albums/", form, {
        headers: {
            "Content-Type": "multipart/form-data"
        },
        onUploadProgress: data => {
            let percent = Math.floor(data.loaded / data.total);
            onprogress(percent);
        }
    });
    return response;
}

export async function removeAlbum(album) {
    var response = await axios.delete("api/albums/" + album.name);
    return response;
}