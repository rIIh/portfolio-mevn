export async function getAlbums(axios) {
    const response = await axios.get("api/albums").catch(e => console.log(e));
    return response.data;
}

export async function updateAlbums(albums, axios) {
    const response = await axios.put("api/albums", albums);
    console.log(response);
}

export async function uploadAlbum(album, axios) {
    var form = new FormData();
    form.append("name", album.name);
    form.append("coverIndex", album.coverIndex);
    album.photos.forEach((e, i) => {
        console.log(e.file)
        form.append('files[' + i + ']', e.file);
    });
    console.log(album)
    for (var value of form.values()) {
        console.log(value);
    }
    const response = await axios.post("api/albums/", form, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response;
}