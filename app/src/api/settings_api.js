const axios = require("axios");
const api_path = "api/settings/";

export async function getValue(name) {
    const response = await axios.get(api_path + name).catch(e => console.log(e));
    return response.data;
}

export async function setValue(name, value) {
    const response = await axios
        .put(api_path + name, value)
        .catch(e => console.log(e));
    return response;
}

export async function removeValue(name) {
    const response = await axios
        .delete(api_path + name)
        .catch(e => console.log(e));
    return response;
}

export async function setValueWithFile(name, type, file, payload) {
    var form = new FormData();
    form.append("type", type);
    if (payload) {
        form.append("payload", JSON.stringify(payload));
        console.log(JSON.stringify(payload));
    }
    form.append("files[0]", file);

    const response = await axios
        .post(api_path + name, form, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        .catch(e => console.log(e));
    return response;
}