<template>
  <transition name="slide">
    <music-list
      class="singerDetail"
      :backgroundImg = "singer.singer_pic"
      :songs = "songList"
      :title = "singer.singer_name"
    ></music-list>
  </transition>
</template>

<script>
import Model from 'api/singerDetail'
import { createSong } from 'common/js/song'
import { mapGetters } from 'vuex'
import MusicList from 'components/music-list/music-list'
export default {
  components: {
    MusicList
  },
  data () {
    return {
      singerDetail: {},
      songList: []
    }
  },
  computed: {
    ...mapGetters([
      'singer'
    ])
  },
  created () {
    this._initSingerDetail()
  },
  methods: {
    goBack () {
      this.$router.history.go(-1)
    },
    _initSingerDetail () {
      if (!this.singer.singer_mid) {
        this.$router.push('/singer')
        return
      }
      Model.getSingerDetail(this.singer.singer_mid).then((res) => {
        let songList = []
        if (res.code === 0 && res.message === 'succ') {
          const list = res.data.list
          for (let k in list) {
            songList.push(createSong(list[k]))
          }
        }
        this.songList = songList
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~common/scss/variable";
  .singerDetail{
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
