<template>
  <transition name="plist">
    <div v-show="show" class="play-list-box" @click="hide">
      <AddSong ref="addSong"></AddSong>
      <div class="slide">
      <div class="play-list-container" @click.stop>
        <div class="play-list-head">
          <i class="icon play-mode" @click="changePlayMode" :class="getPlayIcon">{{playModeTxt}}</i>
          <i class="icon icon-clear" @click="clearConfirm"></i>
        </div>
        <Scroll ref="plistScroll" class="play-list-content" :data="sequenceList">
          <ul class="play-list">
            <li :class="{'icon-play':currentSong.songmid === item.songmid}"
                ref="listSongs"
                class="item"
                v-for="(item, index) in sequenceList"
                :key="item.songmid"
                @click="selectItem(item, index)"
            >
              <span class="name"
                    :class="{'current':currentSong.songmid === item.songmid}"
                    v-html="item.songname"
              ></span>
              <i class="icon icon-not-favorite"></i>
              <i class="icon icon-delete"
                 @click.stop="handleDel(item, index)"
              ></i>
            </li>
          </ul>
        </Scroll>
        <div class="icon-add add-song-btn" @click="addSongShow">添加歌曲到列表</div>
        <Confirm @sure="clearPlayList" text="确认要清空播放列表吗？" ref="clearConfirm"></Confirm>
      </div>
      <div class="btn-close" @click="hide">关闭</div>
      </div>
    </div>
  </transition>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import { playMode, playModeTxt } from 'common/js/config'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import Confirm from 'base/confirm/confirm'
import AddSong from 'components/add-song/add-song'
export default {
  components: { Scroll, Confirm, AddSong },
  data () {
    return {
      show: false
    }
  },
  computed: {
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'playList',
      'mode'
    ]),
    playModeTxt () {
      return `${playModeTxt[this.mode]}播放`
    },
    getPlayIcon () {
      let icon = ''
      if (this.mode === 0) {
        icon = 'icon-sequence'
      } else if (this.mode === 1) {
        icon = 'icon-loop'
      } else {
        icon = 'icon-random'
      }
      return icon
    }
  },
  methods: {
    hide () {
      this.show = false
    },
    showPlayList () {
      this.show = true
      this.$nextTick(() => {
        this.$refs.plistScroll.refresh()
        this._scrollToSong()
      })
    },
    selectItem (item, index) {
      if (this.mode === playMode.random) {
        const list = this.playList.slice()
        index = list.findIndex((song) => {
          return song.songmid === this.sequenceList[index].songmid
        })
      }
      if (this.playList[index].songmid === this.currentSong.songmid) {
        return false
      }
      this.setCurrentIndex(index)
    },
    handleDel (item, index) {
      this.delSongAtPlayList({ song: item, sequenceIndex: index })
    },
    clearConfirm () {
      this.$refs.clearConfirm.toggleShow()
    },
    addSongShow () {
      this.$refs.addSong.show()
    },
    _scrollToSong () {
      const index = this.sequenceList.findIndex(item => item.songmid === this.currentSong.songmid)
      this.$nextTick(() => {
        this.$refs.plistScroll.scrollToElement(this.$refs.listSongs[index])
      })
    },
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE'
    }),
    ...mapActions({
      delSongAtPlayList: 'delSongAtPlayList',
      changePlayMode: 'changePlayMode',
      clearPlayList: 'clearPlayList'
    })
  },
  watch: {
    currentSong () {
      this._scrollToSong()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~common/scss/variable';
.play-list-box{
  z-index: 189;
  position: fixed;
  bottom: 0;
  top: 0;
  width: 100%;
  background: $color-background-d;
  .icon {
    &::before {
      color: $color-theme;
      font-size: $font-size-medium;
    }
  }
  .slide {
    height: 100%;
  }
  .play-list-container {
    position: absolute;
    bottom: 50px;
    background: $color-highlight-background;
    width: 100%;
    padding: 20px 0;
    box-sizing: border-box;
    .play-list-head{
      padding: 0 20px 10px;
      display:flex;
      justify-content: space-between;
      align-items: center;
      height: 30px;
      .play-mode {
        color: $color-text;
        font-style: normal;
        display:flex;
        align-items: center;
        &::before{
          margin-right: 10px;
          font-size: $font-size-large-x;
        }
      }
    }
    .play-list-content {
      max-height: 240px;
      overflow: hidden;
      padding: 0 20px;
    }
    .play-list {
      list-style: none;
      padding: 0;
      .item{
        padding-left: 30px;
        display: flex;
        height: 30px;
        &.icon-play {
          font-size: $font-size-medium;
          color:$color-theme;
          &::before{
            position: absolute;
            left: 0;
          }
        }
        .name {
          height: 25px;
          width: 100%;
          padding-top: 1px;
          font-size: $font-size-medium;
          &.current {
            padding-top: 0;
            color: $color-theme;
          }
        }
        .icon {
          display: flex;
          align-items: center;
          margin-left: 5px;
        }
      }
    }
  }
  .add-song-btn {
    border: 1px solid #fff;
    font-size: $font-size-large;
    width: 200px;
    height: 32px;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px auto 0;
    &::before {
      margin-right: 10px;
    }
  }
  .btn-close{
    bottom: 0;
    position: absolute;
    height: 50px;
    width: 100%;
    background-color: $color-background;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: $font-size-large;
  }
}

.plist-enter-active, .plist-leave-active {
  transition: all 0.3s ease-in;
  .slide{
    transition: all 0.3s ease-in;
    transform: translate3d(0,0,0);
  }
}
.plist-enter, .plist-leave-to {
  background: transparent;
  .slide{
    transform: translate3d(0,100%,0);
  }
}
</style>
