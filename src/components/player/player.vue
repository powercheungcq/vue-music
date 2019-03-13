<template>
  <div class="playerContainer" v-show="playList.length">
    <transition name="normal"
                @enter = "enter"
                @after-enter = "afterEnter"
                @leave = "leave"
                @after-leave = "afterLeave"
    >
      <div class="normalPlayer" v-show="fullScreen">
        <div class="backgroundImg">
          <img :src="currentSong.image" alt="" width="100%" height="100%">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.songname"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle"
             @touchstart.prevent="touchStart"
             @touchmove.prevent="touchMove"
             @touchend.prevent="touchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">
                {{currentLyricLineTxt}}
              </div>
            </div>
          </div>
          <div class="middle-r">
            <Scroll ref="lyricScroll" :data="currentLyric && currentLyric.lines">
              <div class="lyric-wrapper" v-if="currentLyric">
                <p ref="lyricLines" class="text"
                   :class="{'current':currentLineNum === index}"
                   v-for="(line, index) in currentLyric.lines"
                   v-html="line.txt"
                   :key="index"
                   ></p>
              </div>
            </Scroll>
          </div>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentDot === 'cd'}"></span>
            <span class="dot" :class="{'active':currentDot === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{_format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" ref="progressBar" @progressClick="progressClick"></progress-bar>
            </div>
            <span class="time time-r">{{_format(currentSong.interval)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" >
              <i :class="iconMode" @click="changePlayMode"></i>
            </div>
            <div class="icon i-left">
              <i class="icon-prev" @click = "prevSong"></i>
            </div>
            <div class="icon i-center">
              <i :class="playIcon" @click = "togglePlaying"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-next" @click="nextSong"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon" >
          <img width="40" height="40" :src="currentSong.image" :class="cdCls">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.songname"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i class="icon-mini" :class="playIcon+'-mini'" @click.prevent.stop = "togglePlaying"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist" @click.stop="showPlayList"></i>
        </div>
      </div>
    </transition>
    <play-list ref="playList"></play-list>
    <audio @timeupdate="updateCurrentTime" @ended="end" ref="audio" :src="currentSongUrl"></audio>
  </div>
</template>

<script>
import LyricParser from 'lyric-parser'
import progressBar from 'base/progress-bar/progress-bar'
import progressCircle from 'base/progress-circle/progress-circle'
import singerDetailModel from 'api/singerDetail'
import animations from 'create-keyframe-animation'
import Scroll from 'base/scroll/scroll'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from 'common/js/config'
import { prefixStyle } from 'common/js/dom'
import PlayList from 'components/play-list/play-list'
import { createSong } from 'common/js/song'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')
export default {
  data () {
    return {
      currentSongUrl: '',
      currentTime: 0,
      radius: 30,
      currentLyric: null,
      currentLineNum: 0,
      currentLyricLineTxt: '',
      touch: {},
      currentDot: 'cd'
    }
  },
  computed: {
    percent () {
      return this.currentSong.interval ? this.currentTime / this.currentSong.interval : 0
    },
    cdCls () {
      return this.playing ? 'play' : 'play pause'
    },
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'fullScreen',
      'playList',
      'sequenceList',
      'currentSong',
      'playing',
      'currentIndex',
      'mode'
    ])
  },
  methods: {
    touchStart (e) {
      this.touch['initiated'] = true
      this.touch.moved = false
      const touch = e.touches[0]
      this.touch['x'] = touch.pageX
      this.touch['y'] = touch.pageY
    },
    touchMove (e) {
      if (!this.touch.initiated) {
        return
      }

      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.x
      const deltaY = touch.pageY - this.touch.y
      if (Math.abs(deltaX) < Math.abs(deltaY)) {
        return
      }
      this.touch.moved = true
      const left = this.currentDot === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(Math.max(-window.innerWidth, left + deltaX), 0)
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.lyricScroll.$el.style[transitionDuration] = '0ms'
      this.$refs.lyricScroll.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.middleL.style[transitionDuration] = `0ms`
      this.$refs.middleL.style['opacity'] = `${1 - this.touch.percent}`
    },
    touchEnd () {
      if (!this.touch.moved) {
        return
      }
      let offsetWidth
      let opacity
      if (this.currentDot === 'cd') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currentDot = 'lyric'
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0
          opacity = 1
          this.currentDot = 'cd'
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      const time = 300
      this.$refs.lyricScroll.$el.style[transitionDuration] = `${time}ms`
      this.$refs.lyricScroll.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.middleL.style[transitionDuration] = `${time}ms`
      this.$refs.middleL.style['opacity'] = `${opacity}`
    },
    progressClick (percent) {
      this.$nextTick(() => {
        const time = percent * this.currentSong.interval
        this.$refs.audio.currentTime = time
        this.currentLyric.seek(time * 1000)
      })
    },
    updateCurrentTime (e) {
      this.currentTime = e.target.currentTime
    },
    end () {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.nextSong()
        this.$refs.playList._scrollToSong()
      }
    },
    loop () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    prevSong () {
      this.currentTime = 0
      if (this.playList.length === 1) {
        this.loop()
      } else {
        if (this.currentIndex > 0 && this.currentIndex < this.playList.length) {
          this.setCurrentIndex(this.currentIndex - 1)
          this.setPlayingState(false)
        } else if (this.currentIndex === 0) {
          this.setCurrentIndex(this.playList.length - 1)
          this.setPlayingState(false)
        }
      }
    },
    nextSong () {
      this.currentTime = 0
      if (this.playList.length === 1) {
        this.loop()
      } else {
        if (this.currentIndex >= 0 && this.currentIndex < this.playList.length - 1) {
          this.setCurrentIndex(this.currentIndex + 1)
          this.setPlayingState(false)
        } else if (this.currentIndex === this.playList.length - 1) {
          this.setCurrentIndex(0)
          this.setPlayingState(false)
        }
      }
    },
    togglePlaying () {
      this.setPlayingState(!this.playing)
      this.currentLyric.togglePlay()
    },
    showPlayList () {
      this.$refs.playList.showPlayList()
    },
    enter (el, done) {
      const { x, y, scale } = this._getPosition()
      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter () {
      this.$refs.cdWrapper.style.animation = ''
      animations.unregisterAnimation('move')
    },
    leave (el, done) {
      const { x, y, scale } = this._getPosition()
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      this.$refs.cdWrapper.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave () {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style.transform = ''
    },
    back () {
      this.setFullScreen(false)
    },
    open () {
      this.setFullScreen(true)
      this.$nextTick(() => {
        this.$refs.progressBar._setProgressBar(this.percent)
      })
    },
    _getLyric () {
      let song = createSong({ musicData: this.currentSong })
      song.getLyric().then(lyric => {
        if (this.currentLyric) {
          this.currentLyric.stop()
          this.currentLyric = null
        }
        this.currentLyric = new LyricParser(lyric, this._handleLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
      }).catch(() => {
        this.currentLyric = null
        this.currentLineNum = 0
        this.currentLyricLineTxt = ''
      })
      song = null
    },
    _handleLyric ({ lineNum, txt }) {
      this.currentLineNum = lineNum
      this.currentLyricLineTxt = txt
      if (lineNum > 5) {
        const lineEL = this.$refs.lyricLines[lineNum - 5]
        this.$refs.lyricScroll.scrollToElement(lineEL, 1000)
      } else {
        this.$refs.lyricScroll.scrollTo(0, 0, 1000)
      }
    },
    _getNewCurrentIndex (list) {
      return list.findIndex(item => {
        return item.songmid === this.currentSong.songmid
      })
    },
    _getPosition () {
      const targetWidth = 40
      const paddingLeft = 40
      const paddingBottom = 30
      const paddingTop = 80
      const width = window.innerWidth * 0.8
      const x = -(width / 2 - paddingLeft)
      const y = window.innerHeight - paddingTop - paddingBottom - width / 2
      const scale = targetWidth / width
      return { x, y, scale }
    },
    _format(interval) {
      const min = interval / 60 | 0
      const second = this._pop(interval % 60 | 0)
      return `${min}:${second}`
    },
    _pop (num, n = 2) {
      while (num.toString().length < n) {
        num = '0' + num
      }
      return num
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAY_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAY_LIST'
    }),
    ...mapActions({
      changePlayMode: 'changePlayMode',
      addHistoryListen: 'addHistoryListen'
    })
  },
  watch: {
    songList () {
      this.setPlayingState(false)
    },
    currentSong (oldSong, newSong) {
      if (!this.currentSong.songmid) {
        return
      }
      if (oldSong.songmid === newSong.songmid) {
        return
      }

      const _self = this
      singerDetailModel.getSongUrl(this.currentSong.songmid).then(url => {
        if (url === 'error') {
          _self.nextSong()
        } else {
          this.currentSongUrl = url
        }
      })
    },
    currentSongUrl () {
      this.$nextTick(() => {
        this.$refs.audio.play()
        this.addHistoryListen(this.currentSong) // 添加歌曲到收听历史列表
        this.setPlayingState(true)
        this._getLyric()
      })
    },
    playing (newPlaying) {
      this.$nextTick(() => {
        const audio = this.$refs.audio
        newPlaying ? (audio.paused && audio.play()) : (!audio.paused && audio.pause())
      })
    }
  },
  components: {
    progressBar, progressCircle, Scroll, PlayList
  }
}
</script>

<style lang="scss" scoped>
  @import "~common/scss/variable";
  @import "~common/scss/mixin";
  .playerContainer {
    .normalPlayer {
      height: 100%;
      width: 100%;
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 29;
      background: $color-background;
      .backgroundImg {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px);
      }
      .top {
        height: 70px;
        position: relative;
        .back {
          position: absolute;
          top: 0;
          left: 6px;
          z-index: 50;
          .icon-back {
            display: block;
            padding: 9px;
            font-size: $font-size-large-x;
            color: $color-theme;
            transform: rotate(-90deg);
          }
        }
        .title {
          width: 70%;
          margin: 0 auto;
          line-height: 40px;
          text-align: center;
          @include no-wrap();
          font-size: $font-size-large;
          color: $color-text;
        }
        .subtitle {
          line-height: 20px;
          text-align: center;
          font-size: $font-size-medium;
          color: $color-text;
        }
      }
      .middle {
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 170px;
        white-space: nowrap;
        font-size: 0;
        overflow: hidden;
        .middle-l {
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;
          .cd-wrapper {
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            height: 100%;
            .cd {
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border: 10px solid rgba(255, 255, 255, 0.1);
              border-radius: 50%;
              &.play {
                animation: rotate 20s linear infinite
              }
              &.pause {
                animation-play-state: paused
              }
              .image {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }
          }
          .playing-lyric-wrapper {
            width: 80%;
            margin: 30px auto 0 auto;
            overflow: hidden;
            text-align: center;
            .playing-lyric {
              height: 20px;
              line-height: 20px;
              font-size: $font-size-medium;
              color: $color-text-l;
            }
          }
        }
        .middle-r {
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          .lyric-wrapper {
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;
            .text {
              line-height: 32px;
              color: $color-text-l;
              font-size: $font-size-medium;
              &.current {
                color: $color-text;
              }
            }
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-theme;
        }
        &.disable {
          color: $color-theme-d;
        }
        i {
          font-size: 30px;
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
    .mini-player {
      display: flex;
      align-items: center;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 180;
      width: 100%;
      height: 60px;
      background: $color-highlight-background;
      .icon-mini {
        position: absolute;
        left: 0;
      }
      .icon {
        flex: 0 0 40px;
        width: 40px;
        padding: 0 10px 0 20px;
        img {
          border-radius: 50%;
          &.play {
            animation: rotate 10s linear infinite;
          }
          &.pause{
            animation-play-state: paused;
          }
        }
      }
      .text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        .name {
          margin-bottom: 2px;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text;
        }
        .desc {
          @include no-wrap();
          font-size:$font-size-small;
          color:$color-text-d
        }
      }
      .control {
        flex: 0 0 30px;
        width: 30px;
        padding: 0 10px;
        .icon-play-mini, .icon-pause-mini, .icon-playlist{
          font-size: 30px;
          color: $color-theme-d;
        }
        .icon-mini {
          position: absolute;
          left: 0;
          top: 0;
        }
      }
    }
  }
.normal-enter-active, .normal-leave-active {
  transition: 0.4s all;
  .top, .bottom {
    transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
  }
}
.mini-enter-active, .mini-leave-active {
  transition: 0.4s all;
}
.normal-enter, .normal-leave-to {
  opacity: 0;
  .top {
    transform: translate3d(0, -100px, 0)
  }
  .bottom {
    transform: translate3d(0, 100px, 0)
  }
}
.mini-enter, .mini-leave-to {
  opacity: 0;
}

@keyframes rotate{
  0%{
   transform: rotate(0)
  }
  100%{
     transform: rotate(360deg)
  }
}
</style>
