<template lang="pug">
  #gal.home
    CAside
      nav(class="photo_nave" v-if="photos !== undefined")
        router-link(class="link" :to="'album_'+album.name" v-for="(album, index) in photos" :key="index" @mouseenter.native="openAndTop(index)" )
          a {{ album.name }}
    
    .photo_container
      div(v-for="(album, index) in photos" :key="index")
        router-link(:to="'album_'+album.name")
          img(:src="album.path")
    .photo_container_stack(ref="galleryStack")
      img(v-for="(album, index) in showQueue" :key="index" :src="album.path" ref="stackImg")

</template>

<script>
// @ is an alias to /src
import Axios from "axios";
import CAside from "@/components/CustomAside";
const axios = Axios.create();

export default {
  name: "home",
  data() {
    return {
      photos: [],
      scale: 2,
      showQueue: [],
      stack: {}
    };
  },
  computed: {
    assetsPath() {
      let path = process.env.VUE_APP_ASSETS_PATH;
      return path === undefined ? "" : path;
    }
  },
  updated() {
    this.position();
  },
  methods: {
    async getPhotos() {
      const response = await axios.get("api/photos");
      this.photos = response.data;
      this.photos.forEach(p => {
        p.path = this.assetsPath + p.path;
      });
    },
    handleResize() {
      var refs = this.$refs.galleryStack;
      this.stack = {
        width: refs.clientWidth,
        height: refs.clientHeight
      };
    },
    position() {
      var images = this.$refs.stackImg;
      if (images === undefined) return;

      images.forEach((t, index) => {
        //left
        var left =
          this.showQueue[index].position.left *
          (this.stack.width - t.clientWidth);
        //top
        var top =
          this.showQueue[index].position.top *
          (this.stack.height - t.clientHeight);

        t.style.left = Math.round(left).toString() + "px";
        t.style.top = Math.round(top).toString() + "px";
        console.log(t.style.left);
      });
    },
    openAndTop(id) {
      var target = this.photos[id];

      var was =
        this.showQueue.filter(v => v.name == target.name)[0] || undefined;
      var result = this.showQueue.filter(
        (val, i, arr) => val.name !== target.name
      );
      if (was !== undefined && was.position !== undefined) {
        result.push(was);
        this.showQueue = result;
        return;
      }

      // TODO figure out how to get screen and img dimensions
      var randLeft = Math.random();
      var randTop = Math.random();
      target.position = {
        left: randLeft,
        top: randTop
      };

      result.push(target);
      this.showQueue = result;
    }
  },
  mounted() {
    this.getPhotos();
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
  components: {
    CAside
  }
};
</script>

<style lang="scss">
$asideWidth: 100px;
$secondbreak: 512px;
$firstbreak: 1024px;
$photo_stack_height: 80vh;


section.has-text-centered {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}

@media screen and (max-width: $firstbreak) {
  .photo_container_stack {
    display: none;
  }
  .photo_container {
    width: 100vw;
    max-width: 100%;
    transition: 0.5s;
    column-gap: 0px;

    columns: 3;

    img {
      transition: 1s;
      padding: 3px;
      width: 100%;
    }
  }

  aside {
    display: none;

    * {
      display: none;
    }
  }
}

@media screen and (min-width: $firstbreak) {
  .photo_container {
    display: none;
  }
  .photo_container_stack {
    height: 100%;
    max-height: 95%;
    padding: 16px 32px;
    margin: 0px 32px;
    overflow: hidden;
    position: relative;
    img {
      position: absolute;
      max-width: 95%;
      max-height: 95%;
    }
  }

  aside {
    height: 100vh;
    width: $asideWidth;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    overflow-x: hidden;
    padding-top: 60px;
    transition: 0.5s;

    a {
      padding-right: 10px;
      padding-bottom: 10px;
      padding-left: 10px;
      text-decoration: none;
      font-size: 16px;
      color: grey;
      display: block;
      transition: 0.3s;
      text-align: start;

      &:hover {
        color: lightgrey;
        padding-left: 20px;
      }
      cursor: pointer;
    }

    .closebtn {
      position: absolute;
      top: 0;
      right: 25px;
      font-size: 36px;
      margin-left: 50px;
    }
  }
  .home {
    @media screen and (max-width: $firstbreak) {
      padding-left: 0;
    }
    height: 100vh;
    margin: 0px;

    padding-left: $asideWidth;
  }
}
</style>