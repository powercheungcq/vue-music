<template>
  <div class="rank">
    <Scroll :data="topList" class="rlScroll" ref="rlScroll">
      <div class="rankList" v-for="item in topList" :key="item.id" @click="selectTopList(item)">
        <div class="rank-l">
          <img class="icon" v-lazy="item.picUrl" alt="item.topTitle" @load="onImgLoad">
        </div>
        <ul class="rank-r">
          <li class="title icon-back" v-html="item.topTitle"></li>
          <li class="songList" v-for="(it, index, key) in item.songList" :key="key" ref="songlist">
            {{index + 1}}&nbsp;&nbsp;{{it.songname}}&nbsp;-&nbsp;{{it.singername}}
          </li>
        </ul>
      </div>
    </Scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import Model from 'api/rank'
import Scroll from 'base/scroll/scroll'
import { playListMixin } from 'common/js/mixins.js'
import { mapMutations } from 'vuex'
export default {
  components: { Scroll },
  mixins: [ playListMixin ],
  data () {
    return {
      topList: []
    }
  },
  created () {
    this._initRankList()
  },
  methods: {
    handlePlaylist (list) {
      let bottom
      if (list.length > 0) {
        bottom = 80
      } else {
        bottom = 20
      }
      this.$refs.rlScroll.$el.style.height = `${innerHeight - 88 - bottom}px`
      this.$refs.rlScroll.refresh()
    },
    selectTopList (topList) {
      this.setTopList(topList)
      this.$router.push(`/rank/${topList.id}`)
    },
    onImgLoad () {
      this._setSongTitleWidth()
    },
    _setSongTitleWidth () {
      if (!this.loaded) {
        this.loaded = true
        const list = this.$refs.songlist
        for (let k in list) {
          list[k].style.width = `${window.innerWidth - 160}px`
        }
      }
    },
    _initRankList () {
      Model.getRankList().then(res => {
        this.topList = res.data.data.topList
      })
    },
    ...mapMutations({
      setTopList: 'SET_TOPLIST'
    })
  }
}
</script>

<style lang="scss" scoped>
@import "~common/scss/variable";
.rank {
  position: fixed;
  overflow: hidden;
  top: 88px;
  bottom: 0;
  left: 0;
  right: 0;
  .rankList{
    padding:0 10px;
    display: flex;
    margin: 10px 0;
    justify-content: stretch;
    &:last-child{
      margin-bottom: 10px;
    }
    .rank-l {
      height: 100px;
      width: 100px;
      background-color: $color-background-d;
      .icon {
        width: 100%;
        height: 100%;
      }
    }
    .rank-r {
      position: relative;
      flex: 1;
      display: flex;
      padding:5px 10px;
      margin: 0;
      height: 100px;
      list-style: none;
      box-sizing: border-box;
      flex-direction: column;
      background-color: $color-highlight-background;
      .title {
        font-size: $font-size-medium-x;
        color: $color-text;
        padding: 5px 0;
      }
      .icon-back::before {
        position: absolute;
        transform: rotate(180deg);
        top: 50%;
        margin-top: -8px;
        right: 5px;
        color: $color-theme;
      }
      .songList {
        font-size: $font-size-medium;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: $color-text;
        margin-top: 5px;
      }
    }
  }
}
</style>
