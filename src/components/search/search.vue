<template>
    <div class="search" ref="search">
      <top-tip ref="topTip" :text="tipMsg"></top-tip>
      <search-box @searchWordChange="updateSearchWord" :placeholder="placeholder" ref="searchBox"></search-box>
      <div class="hotkey" v-show="!searchWord">
        <h1 class="title">热门搜索</h1>
        <ul class="hotKeyList">
          <li class="hk-item" @click="setSearchWord(item)" v-for="item in hotKey" :key="item.k">{{item.k}}</li>
        </ul>
      </div>
      <div class="history" v-show="!searchWord">
        <search-history-list
          @clearSearches="handleConfirm"
          @delSearch="deleteHistorySearch"
          @selectItem="selectHistory"
        ></search-history-list>
      </div>
      <Confirm ref="confirm"
               text="确定清空搜索历史记录？"
               @sure="clearHistorySearch"
      ></Confirm>
      <div class="searchResult" ref="searchResult" v-show="searchWord">
        <search-list
          @selectSong="selectSong"
          @selectSinger="selectSinger"
          @saveSearch = 'saveSearch'
          :zhida = 'zhida'
          :searchWord="searchWord"
          ref="searchList"
        ></search-list>
      </div>
    </div>
</template>

<script>
  import SearchBox from 'base/search-box/search-box'
  import hotKeyModel from 'api/hotKey'
  import { SUCCESS_CODE } from 'api/config.js'
  import { shuffle } from 'common/js/util.js'
  import SearchList from 'components/search-list/search-list'
  import SearchHistoryList from 'components/search-history-list/search-history-list'
  import Confirm from 'base/confirm/confirm'
  import { playListMixin, searchListMixin } from 'common/js/mixins.js'
  import TopTip from 'base/top-tip/top-tip'
  export default {
    mixins: [ playListMixin, searchListMixin ],
    components: { SearchBox, SearchList, SearchHistoryList, Confirm, TopTip },
    data() {
      return {
        hotKey: [],
        tipMsg: '成功添加一首歌曲至播放列表.'
      }
    },
    created () {
      this.placeholder = '搜索歌曲、歌手'
      this.zhida = true
      this._initHotKey()
    },
    methods: {
      handlePlaylist (playList) {
        this.$refs.searchResult.style.bottom = playList.length > 0 ? '60px' : '0'
        this.$refs.searchList.refresh()
      },
      handleConfirm () {
        this.$refs.confirm.toggleShow()
      },
      selectHistory (word) {
        this._setSearchBoxWord(word)
      },
      setSearchWord (item) {
        this._setSearchBoxWord(item.k)
      },
      updateSearchWord (word) {
        this.searchWord = word
      },
      showTopTip () {
        this.$refs.topTip.show()
      },
      _setSearchBoxWord (word) {
        this.$refs.searchBox.setSearchWord(word)
      },
      _initHotKey () {
        hotKeyModel.getHotKey().then(res => {
          if (res.code === SUCCESS_CODE) {
            this.hotKey = shuffle(res.data.hotkey.slice(0, 10))
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~common/scss/variable';
  .search {
    padding: 10px 20px;
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    overflow: hidden;
    box-sizing: border-box;
    .hotkey {
      display: flex;
      flex-direction: column;
      .title{
        font-weight: normal;
        color: $color-theme;
        font-size: $font-size-large;
      }
      .hotKeyList {
        display: flex;
        list-style: none;
        flex-wrap: wrap;
        padding: 0;
        .hk-item {
          font-size: $font-size-medium;
          padding: 7px 20px;
          margin: 5px;
          background: $color-text-d;
          display: inline-block;
          border-radius: 17px;
        }
      }
    }
    .searchResult {
      position: fixed;
      top: 148px;
      bottom: 0;
      left: 0;
      padding: 10px;
      box-sizing: border-box;
      width: 100%;
    }
  }
</style>
