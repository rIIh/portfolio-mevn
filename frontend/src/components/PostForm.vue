<template lang="pug">
  .upload-box
    form(role="form" enctype="multipart/form-data" @submit.prevent="onSubmit")
      label.pr-4(for="name") Album name
      input#items(name="name" v-model="album_meta.name" placeholder="name" required autofocus)
      br
      .upload-box-main(v-if="!itemsAdded")
        .form-group
          .drop-area(@ondragover="onChange" :class="dragging ? 'drop-area-dragging' : ''" @dragenter="dragging=true" @dragend="dragging=false" @dragleave="dragging=false")
            h3 Drop files to upload
            input(type="file" id="items" name="items[]" required multiple @change="onChange")
            p.help-block instant upload enabled
          button(@click="upload({name: 'test'})") upload
      .upload-box-main(v-else)
        p
          strong message
        v-item-group
          v-container(grid-list-md)
            v-layout(row)
              v-flex(v-for="n in 3" :key="n" xs12 md4)
                v-item
                  v-card.d-flex.align-center(slot-scope="{ active, toggle }" :color="active ? 'primary' : ''" dark height=250 @click="toggle")
                    .display-3.text-xs-center(v-if="active")


</template>

<script>
const api = require("../api/gallery_api");

export default {
  data() {
    return {
      album_meta: {
        name: "",
        cover_id: ""
      },

      dragging: false,
      items: [],
      itemsAdded: "",
      itemsNames: [],
      itemsSizes: [],
      itemsTotalSize: "",
      formData: "",
      successMsg: "",
      errorMsg: "",
      isLoaderVisible: false
    };
  },
  methods: {
    upload: api.uploadAlbum,
    // http://scratch99.com/web-development/javascript/convert-bytes-to-mb-kb/
    bytesToSize(bytes) {
      const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      if (bytes === 0) return "n/a";
      let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      if (i === 0) return bytes + " " + sizes[i];
      return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
    },
    onChange(e) {
      console.log("changed");
      this.errorMsg = "";
      this.formData = new FormData();
      let files = e.target.files || e.dataTransfer.files;
      this.itemsAdded = files.length;
      let fileSizes = 0;
      for (let x in files) {
        if (!isNaN(x)) {
          this.items = e.target.files[x] || e.dataTransfer.files[x];
          this.itemsNames[x] = files[x].name;
          this.itemsSizes[x] = this.bytesToSize(files[x].size);
          fileSizes += files[x].size;
          this.formData.append("items[]", this.items);
        }
      }
      this.itemsTotalSize = this.bytesToSize(fileSizes);
    }
  }
};
</script>

 <style lang="scss">
.upload-box {
  position: relative;
  align-items: center;
  margin: 1em;
  h3 {
    padding: 0.5ex;
  }
}
.upload-box .upload-box-main {
  position: relative;
}
/* Drag and drop */
.upload-box .drop-area {
  position: relative;
  width: 100%;
  height: 300px;
  border: 5px dashed lightgrey;
  text-align: center;
  font-size: 2em;
  padding-top: 80px;
}
.upload-box .drop-area input {
  position: absolute;
  cursor: pointer;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}
/* End drag and drop */
/* Loader */
.upload-box .loader {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  opacity: 0.9;
}
.upload-box .loaderImg {
  border: 9px solid #eee;
  border-top: 9px solid #00adce;
  border-radius: 50%;
  width: 70px;
  height: 70px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
/* End Loader */
.upload-box .errorMsg {
  font-size: 2em;
  color: #a94442;
}
.upload-box .successMsg {
  font-size: 2em;
  color: #3c763d;
}
</style>
