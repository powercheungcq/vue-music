<template>
  <transition name="slide">
    <music-list
      class="topList"
      :title="title"
      :backgroundImg="bgImage"
      :songs="songList"
      :isRank="true"
    ></music-list>
  </transition>
</template>

<script>
  import { mapGetters } from 'vuex'
  import MusicList from 'components/music-list/music-list'
  import topListModel from 'api/rank'
  import { createSong } from 'common/js/song'
  export default {
    components: { MusicList },
    data () {
      return {
        songList: []
      }
    },
    computed: {
      title () {
        return this.topList.topTitle
      },
      bgImage () {
        if (this.songList.length) {
          return this.songList[0].image
        }
        return ''
      },
      ...mapGetters([
        'topList'
      ])
    },
    created () {
      this._initTopListSongs()
    },
    methods: {
      _initTopListSongs() {
        if (!this.topList.id) {
          this.$router.push('/rank/')
          return
        }
        topListModel.getRankSongList(this.topList.id).then(res => {
          const songlist = res.data.songlist
          const topList = []
          for (let k in songlist) {
            topList.push(createSong({ musicData: songlist[k].data }))
          }
          this.songList = topList
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~common/scss/variable";
  .topList{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-size: 100%;
  }
  .slide-enter-active, .slide-leave-active {
    transition: all 0.3s;
  }
  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>
