<template>
      <Scroll :data="searchResultList.list" class="search-list" ref="searchList">
        <ul class="search-container">
          <li class="search-list-item"
              :class="{'zhida':item.type === 'singer'}"
              @click="selectItem(item)"
              v-for="item in searchResultList.list"
              :key="item.songmid"
          >
            <i class="icon" :class="{'icon-music':!item.type}" v-html="getIcon(item)"></i>
            <div class="des">
              <span class="name" v-html="getName(item)"></span>
              <span class="songsDes" v-html="getDes(item)"></span>
            </div>
          </li>
        </ul>
      </Scroll>
</template>

<script>
  import hotKeyModel from 'api/hotKey'
  import { createSong } from 'common/js/song'
  import { clone } from 'common/js/util'
  import Scroll from 'base/scroll/scroll'
  const PER_PAGE = 20
  let PAGE_NUM = 1
  const TYPE_SINGER = 'singer'
  export default {
    components: { Scroll },
    props: {
      searchWord: {
        type: String,
        default: ''
      },
      zhida: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        searchResultList: {}
      }
    },
    created () {
      this.pullUpload = { threshold: -30 }
    },
    methods: {
      refresh () {
        this.$refs.searchList.refresh()
      },
      getIcon (item) {
        return item.type && item.type === TYPE_SINGER
          ? `<img style="width:100%;height: 100%" src="http://y.gtimg.cn/music/photo_new/T001R150x150M000${item.singermid}.webp" >`
          : ''
      },
      getName (item) {
        return item.type && item.type === TYPE_SINGER
          ? item.singername : item.songname
      },
      getDes (item) {
        return item.type && item.type === TYPE_SINGER
          ? `单曲：${item.songnum}&nbsp;&nbsp;&nbsp;&nbsp;专辑：${item.albumnum}`
          : item.singer
      },
      selectItem (item) {
        if (item.type && item.type === 'singer') {
          const singer = Object.assign(item, {
            singer_pic: `http://y.gtimg.cn/music/photo_new/T001R150x150M000${item.singermid}.webp`,
            singer_title: item.singername,
            singer_mid: item.singermid
          })
          this.$emit('selectSinger', singer)
        } else {
          this.$emit('selectSong', item)
        }
        this.$emit('saveSearch', this.searchWord)
      },
      _search (searchWord) {
        if (searchWord === '') {
          this.searchResultList = {}
        } else {
          hotKeyModel.searchSongandSinger({ word: searchWord, zd: this.zhida, perpage: PER_PAGE, page: PAGE_NUM }).then(res => {
            const searchResultList = {}
            const songList = []
            const list = res.data.data.song.list
            if (res.data.data.zhida.singermid) {
              songList.push({ ...res.data.data.zhida, ...{ type: TYPE_SINGER } })
            }
            searchResultList.searchWord = searchWord
            searchResultList.perpage = res.data.data.song.curnum
            searchResultList.curpage = res.data.data.song.curpage
            searchResultList.totalnum = res.data.data.song.totalnum
            for (let k in list) {
              songList.push(createSong({ musicData: list[k] }))
            }
            searchResultList['list'] = songList
            this.searchResultList = searchResultList
          })
        }
      },
      _nextPage () {
        if (((this.searchResultList.totalnum - 1) % PER_PAGE) >= PAGE_NUM) {
          PAGE_NUM++
          hotKeyModel.searchSongandSinger({ word: this.searchResultList.searchWord, zd: this.zhida, perpage: PER_PAGE, page: PAGE_NUM }).then(res => {
            const songList = []
            const list = res.data.data.song.list
            if (list.length < 1) {
              return false
            }
            for (let k in list) {
              songList.push(createSong({ musicData: list[k] }))
            }
            const tmp = clone(this.searchResultList)
            tmp.list = tmp.list.concat(songList)
            tmp.perpage = res.data.data.song.curnum
            tmp.curpage = res.data.data.song.curpage
            tmp.totalnum = res.data.data.song.totalnum
            this.searchResultList = {}
            this.searchResultList = tmp
            return true
          }).then(dirty => {
            this.$refs.searchScroll.finishPullUp(dirty)
          })
        } else {
          this.$refs.searchScroll.finishPullUp(false)
        }
      }
    },
    watch: {
      searchWord (newVal) {
        this._search(newVal)
      }
    }
  }
</script>

<style lang="scss" scoped>
@import '~common/scss/variable';
  .search-list {
    position: relative;
    width: 100%;
    padding: 0;
    overflow: hidden;
    box-sizing: border-box;
    .search-container {
      list-style: none;
      padding: 0;
      margin: 0;
      .search-list-item {
        display: flex;
        padding: 10px 0;
        border-bottom: 1px solid $color-text-d;
        &:last-child {
          border-bottom: none;
        }
        .icon{
          display: block;
          width: 50px;
          height: 50px;
          overflow: hidden;
          border-radius: 50%;
          margin-right: 20px;
          &.icon-music {
            text-align: center;
            line-height: 50px;
            font-size: $font-size-large;
            color: $color-theme;
          }
          img {
            width: 100%;
            height: 100%;
          }
        }
        .des {
          display: flex;
          flex-direction: column;
          justify-content: center;
          span{
            display: block;
            &.songsDes {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
            &.name {
              font-size: $font-size-large;
              color: $color-text;
              padding-bottom: 5px;
            }
          }
        }
      }
    }
  }
</style>
