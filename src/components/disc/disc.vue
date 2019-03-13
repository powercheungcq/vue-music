<template>
  <transition name="slide">
    <music-list
      class="disc"
      :title="title"
      :backgroundImg="bgImage"
      :songs="songList"
    ></music-list>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import MusicList from 'components/music-list/music-list'
import { getDiscList } from 'api/disc'
import { createSong } from 'common/js/song'
import { SUCCESS_CODE } from 'api/config'
export default {
  components: { MusicList },
  data () {
    return {
      songList: []
    }
  },
  computed: {
    title () {
      return this.disc.dissname
    },
    bgImage () {
      return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
    ])
  },
  created () {
    this._initDisc(this.disc.dissid)
  },
  methods: {
    _initDisc (dissid) {
      if (!dissid) {
        this.$router.push('/recommend/')
        return
      }
      getDiscList(dissid).then(res => {
        if (res.data.code === SUCCESS_CODE) {
          const list = res.data.cdlist[0].songlist
          const newList = []
          for (let k in list) {
            newList.push(createSong({ musicData: list[k] }))
          }
          this.songList = newList
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~common/scss/variable";
  .disc{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .slide-enter-active, .slide-leave-active {
    transition: all 0.3s;
  }
  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>
