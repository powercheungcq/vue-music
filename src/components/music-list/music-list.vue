<template>
  <div ref="musicList">
    <div class="header">
      <span  class="goback icon-back" @click = "goback"></span>
      <h3 class="title" v-html="title"></h3>
    </div>
    <div class="singerBg" :style="{ 'background-image': singerBg, 'background-size': '100%' }"  ref="bgImage">
      <div class="playBtn" @click="randomPlaying" ref="playBtn" v-show="songs.length">
        <i class="icon-play"></i>
        随机播放全部
      </div>
      <div class="filter" ref="filter"></div>
   </div>
    <div class="list-layer" ref="listLayer"></div>
    <Scroll :data="songs"
            class="list"
            ref="list"
            :probeType="probeType"
            :listenScroll="listenScroll"
            @scroll="onScroll"
    >
      <div class="song-list-wrapper">
        <song-list @select="selectSong" :isRank="isRank" :songs="songs" ></song-list>
      </div>
      <div class="loadingContainer" v-show="!songs.length">
        <loading></loading>
      </div>
    </Scroll>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import loading from 'base/loading/loading'
import { prefixStyle } from 'common/js/dom'
import { mapActions } from 'vuex'
import { playListMixin } from 'common/js/mixins'

const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')
const HEAD_HEIGHT = 44
export default {
  mixins: [playListMixin],
  components: {
    Scroll, SongList, loading
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    backgroundImg: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: () => []
    },
    isRank: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      scrollY: 0
    }
  },
  created () {
    this.probeType = 3
    this.listenScroll = true
  },
  mounted () {
    this.imgHiehgt = this.$refs.bgImage.clientHeight
    this.minTranslateY = -this.imgHiehgt + HEAD_HEIGHT
    this.$refs.list.$el.style.top = `${this.imgHiehgt}px`
  },
  computed: {
    singerBg () {
      const bg = this.backgroundImg ? this.backgroundImg.replace('150x150', '300x300') : ''
      return `url('${bg}')`
    }
  },
  methods: {
    handlePlaylist (playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    selectSong (item, index) {
      this.addPlayList({ list: this.songs, index: index })
    },
    randomPlaying () {
      this.randomPlay(this.songs)
    },
    goback () {
      this.$router.back()
    },
    onScroll (pos) {
      this.scrollY = pos.y
    },
    ...mapActions({
      addPlayList: 'addPlayList',
      randomPlay: 'randomPlay'
    })
  },
  watch: {
    scrollY (newY) {
      const translateY = Math.max(this.minTranslateY, newY)
      let zIndex = 0
      let scale = 1
      let blur = 0
      const percent = Math.abs(newY) / this.imgHiehgt
      if (newY > 0) {
        scale = 1 + percent
        this.$refs.bgImage.style[transform] = `scale(${scale})`
        zIndex = 10
      } else {
        blur = Math.min(20, 20 * percent)
      }

      this.$refs.listLayer.style[transform] = `translate3d(0,${translateY}px,0)`
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`

      if (newY < translateY) {
        this.$refs.bgImage.style.paddingTop = `0`
        this.$refs.bgImage.style.height = `${HEAD_HEIGHT}px`
        this.$refs.playBtn.style.display = 'none'
        zIndex = 10
      } else {
        this.$refs.bgImage.style.paddingTop = `70%`
        this.$refs.bgImage.style.height = `0`
        this.$refs.playBtn.style.display = 'flex'
      }
      this.$refs.bgImage.style.zIndex = zIndex
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~common/scss/variable';
  .header{
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    height: 44px;
    position: absolute;
    z-index: 19;
    .goback {
      height: 100%;
      font-size: $font-size-large-x;
      position: absolute;
      color: $color-theme;
      display: flex;
      align-items: center;
      width: 50px;
      justify-content: center;
    }
    .title{
      text-align: center;
      width: 100%;
      font-weight: normal;
      font-size: $font-size-large-x;
    }
  }
  .singerBg {
    width: 100%;
    height: 0;
    padding-top: 70%;
    position: relative;
    transform-origin: top;
    .playBtn{
      width: 50%;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 30px;
      color: $color-theme;
      border: 1px solid $color-theme;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 20px;
      margin: auto;
      z-index: 19;
      .icon-play {
        margin-right: 10px;
      }
    }
    .filter {
      background-color: $color-background-d;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  .list-layer{
    position: relative;
    height: 100%;
    background: $color-background;
  }
  .list{
    position: fixed;
    top: 0;
    bottom: 0;
    height: auto;
    width: 100%;
    background: $color-background;
    .song-list-wrapper {
      padding: 20px 30px;
    }
    .loadingContainer {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
