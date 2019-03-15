<template>
  <div class="add-song" @click.stop v-if="showFlag">
    <top-tip ref="topTip" :text="tipMsg"></top-tip>
    <div class="head">
      <h2 class="title">添加歌曲到列表</h2>
      <i class="icon icon-delete" @click="hide"></i>
    </div>
    <div class="search-container">
      <search-box ref="searchBox" @searchWordChange="changeWord" placeholder="搜索歌曲"></search-box>
    </div>
    <div class="histories" v-show="!searchWord">
      <switches
        :switchesList="switchesList"
        :currentIndex="currentIndex"
        @switch="switchItem"
      ></switches>
      <div class="listenHistory" >
        <scroll :data = "listenHistory" v-if="currentIndex === 0">
          <song-list
            :songs="listenHistory"
            @select="selectSong"
          ></song-list>
        </scroll>
        <search-history-list
          @selectItem="selectSearchHistoryItem"
          @delSearch="deleteHistorySearch"
          @clearSearches="handleConfirm"
          v-if="currentIndex === 1" ></search-history-list>
        <Confirm ref="confirm"
                 text="确定清空搜索历史记录？"
                 @sure="clearHistorySearch"
        ></Confirm>
      </div>
    </div>
    <div class="search-result" v-show="searchWord">
      <search-list
        @selectSong="selectSong"
        @selectSinger="selectSinger"
        @saveSearch = 'saveSearch'
        :searchWord="searchWord"></search-list>
    </div>
  </div>
</template>

<script>
  import SearchBox from 'base/search-box/search-box'
  import SearchList from 'components/search-list/search-list'
  import { searchListMixin } from 'common/js/mixins'
  import Switches from 'components/switches/switches'
  import SearchHistoryList from 'components/search-history-list/search-history-list'
  import SongList from 'base/song-list/song-list'
  import Scroll from 'base/scroll/scroll'
  import { mapGetters } from 'vuex'
  import Confirm from 'base/confirm/confirm'
  import TopTip from 'base/top-tip/top-tip'
  export default {
    mixins: [ searchListMixin ],
    data () {
      return {
        showFlag: false,
        currentIndex: 0,
        tipMsg: '成功添加一首歌曲至播放列表.'
      }
    },
    components: {
      SearchBox,
      SearchList,
      Switches,
      SearchHistoryList,
      SongList,
      Scroll,
      Confirm,
      TopTip
    },
    created () {
      this.switchesList = [
        { name: '最近播放' },
        { name: '搜索历史' }
      ]
    },
    computed: {
      ...mapGetters([
        'listenHistory'
      ])
    },
    methods: {
      handleConfirm () {
        this.$refs.confirm.toggleShow()
      },
      selectSearchHistoryItem (word) {
        this.$refs.searchBox.setSearchWord(word)
      },
      delSearch (word) {
        this.delSearch()
      },
      switchItem (index) {
        this.currentIndex = index
      },
      changeWord (word) {
        this.searchWord = word
      },
      show () {
        this.showFlag = true
      },
      hide () {
        this.showFlag = false
      },
      showTopTip () {
        this.$refs.topTip.show()
      }
    }
  }
</script>

<style lang="scss" scoped>
@import '~common/scss/variable';
.add-song {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: $color-background;
  z-index: 199;
  .head {
    padding: 13px;
    box-sizing: border-box;
    position: relative;
    .title {
      text-align: center;
      font-size: $font-size-large;
      font-weight: normal;
    }
    .icon {
      font-size: $font-size-large;
      position: absolute;
      top: 13px;
      right: 13px;
    }
  }
  .search-container {
    padding: 10px 20px 0;
  }
  .search-result {
    position: fixed;
    top: 104px;
    bottom: 0;
    left: 0;
    padding: 10px 20px;
    width: 100%;
    box-sizing: border-box;
  }
  .histories {
    position: fixed;
    top: 104px;
    bottom: 0;
    left: 0;
    padding: 0px 20px 5px;
    width: 100%;
    box-sizing: border-box;
    .listenHistory {
      position: fixed;
      top: 154px;
      bottom: 0;
      width: 100%;
      overflow: hidden;
      left: 0;
      padding: 20px;
      box-sizing: border-box;
    }
    .switchBtn {
      width: 200px;
      height: 40px;
      border-radius: 25px;
      background: #666;
      margin: 10px auto;
      overflow: hidden;
      .play-history, .search-history {
        font-size: $font-size-medium;
        float: left;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50%;
        height: 100%;
        &.current {
          background: #333;
        }
      }
    }
    .history-content {
      position: fixed;
      top: 170px;
      left: 0;
      bottom: 0;
      width: 100%;
      padding: 10px;
      box-sizing: border-box;
    }
  }
}
</style>
