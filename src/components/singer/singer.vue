<template>
  <div class="singer" ref="singer">
    <div class="ScrollWrapper">
      <Scroll :data ="singerList"
              class="scroll-content"
              :pullUpLoad="pullUpload"
              :listenScroll="listenScroll"
              :probeType="probeType"
              ref = "scroll"
              @pullingUp="pullingUp"
              @scroll="onScroll"
      >
        <div class="filter-prop" ref="filter">
          <div v-for="(tag, key) in tags" class="colum" :key="tag.name">
            <a href="javascript: void(0);" @click = "changeFilter(tag.name, item.id, key)" v-for="item  in tag.value" :key="item.id"
               class="filter-item" :class="{active: item.id === tag.active}">{{item.name}}</a>
          </div>
        </div>
        <div class="singerList" ref = "singers">
          <ul class="singerGroup"
              v-for="group in singerList"
              :key = "group.title"
              ref = "listGroup"
          >
            <h2 class="title">{{group.title}}</h2>
            <li class="singerItem"
                v-for="item in group.singers"
                :key="item.id"
                @click.stop.prevent="select(item)"
            >
              <div class="himg">
                <img v-lazy="item.singer_pic" alt="" :key="item.singer_pic" @load="onImgLoad" />
              </div>
              <h2 class="name">{{item.singer_name}}</h2>
            </li>
            <div style="clear:both;"></div>
          </ul>
        </div>
        <div class="loadingContainer" v-show="!singerList.length">
          <loading></loading>
        </div>
      </Scroll>
      <div class="fixedTitle" v-show="fixedTitle" ref="fixedTitle">
        <h2 class="title">{{fixedTitle}}</h2>
      </div>
    </div>
    <div class="singerTitles" ref="titMenu" :style="{'height': titleMenuHeight}">
      <div class="tit-item"
           :class="{'current' : index === currentIndex}"
           v-for="(item, index) in singerTitles"
           :key = "item" >
        <a
          :data-index="index"
          @touchstart.stop.prevent="onTouchStart"
          @touchmove.stop.prevent="onTouchMove">{{item}}</a>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  import Model from 'api/singer'
  import { SUCCESS_CODE } from 'api/config'
  import Scroll from 'base/scroll/scroll'
  import loading from 'base/loading/loading'
  import { getData } from 'common/js/dom'
  import { mapMutations } from 'vuex'
  import { playListMixin } from 'common/js/mixins'

  const TITLE_MENU_HEIGHT = 26
  const TITLE_HEIGHT = 30
  export default {
    mixins: [playListMixin],
    components: { Scroll, loading },
    data () {
      return {
        singerList: [],
        tags: [],
        singerTitles: [],
        cur_page: 1,
        sin: 0,
        total: 0,
        scrollY: -1,
        currentIndex: 0,
        diff: -1,
        firstBeforeHeight: -1
      }
    },
    computed: {
      titleMenuHeight () {
        const th = this.singerTitles.length * TITLE_MENU_HEIGHT
        return th > TITLE_MENU_HEIGHT * 16 ? TITLE_MENU_HEIGHT * 16 : th + 'px'
      },
      fixedTitle () {
        if (this.firstBeforeHeight === -1) {
          return ''
        }
        if (-this.scrollY < this.firstBeforeHeight) {
          return ''
        }
        return this.singerTitles[this.currentIndex]
      }
    },
    created () {
      this._initSingerList()
      this.listHeight = []
      this.probeType = 3
      this.pullUpload = { threshold: -30 }
      this.listenScroll = true
      this.$nextTick(() => {
        this.$refs.singer.style.height = `${window.innerHeight - 88}px`
        this.$refs.scroll.refresh()
      })
    },
    watch: {
      scrollY (newY) {
        const listHeight = this.listHeight
        for (let i = 0; i < listHeight.length; i++) {
          if (-newY > listHeight[i] && -newY < listHeight[i + 1]) {
            this.currentIndex = i
            this.diff = listHeight[i + 1] + newY
            break
          }
        }
      },
      diff (newDiff) {
        let fixedTop = (newDiff > 0 && newDiff < TITLE_HEIGHT) ? newDiff - TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixedTitle.style.transform = `translate3d(0, ${fixedTop}px, 0)`
      },
      listHeight () {
        console.log(this.listHeight)
      }
    },
    methods: {
      handlePlaylist (pl) {
        if (pl.length > 0) {
          // this.$refs.scroll.$el.style.bottom = `${bottom}px`
          this.$refs.scroll.$el.style.height = `${window.innerHeight - 88 - 60}px`
        } else {
          this.$refs.scroll.$el.style.height = ''
        }
        this.$refs.scroll.refresh()
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      select (singer) {
        this.setSinger(singer)
        this.$router.push(`/singer/${singer.singer_mid}`)
      },
      onTouchStart (e) {
        this.tsy = e.touches[0].pageY
        const index = getData(e.target, 'index')
        this.currentIndex = parseInt(index)
        const groups = this.$refs.singers.getElementsByTagName('ul')
        this.$refs.scroll.scrollToElement(groups[index], 0)
      },
      onTouchMove(e) {
        this.tse = e.touches[0].pageY
        const n = 0 | (this.tse - this.tsy) / TITLE_MENU_HEIGHT
        const index = getData(e.target, 'index')
        let tmpCurIndex = parseInt(index) + n
        const groups = this.$refs.singers.getElementsByTagName('ul')
        if (tmpCurIndex < 0) {
          tmpCurIndex = 0
        } else if (tmpCurIndex > (groups.length - 1)) {
          tmpCurIndex = groups.length - 1
        }
        this.currentIndex = tmpCurIndex
        this.$refs.scroll.scrollToElement(groups[parseInt(index) + n], 0)
      },
      pullingUp () {
        this._nextPage({ sin: this.sin + 80, cur_page: this.cur_page + 1 })
      },
      onScroll (pos) {
        this.scrollY = pos.y
      },
      onImgLoad () {
        if (!this.imgOnLoad) {
          this._calculateHeight()
          this.imgOnLoad = true
        }
      },
      _calculateHeight () {
        this.firstBeforeHeight = this.$refs.filter.clientHeight
        this.listHeight = []
        let height = this.firstBeforeHeight
        this.listHeight.push(height)
        const listGroup = this.$refs.listGroup
        for (let i = 0; i < listGroup.length; i++) {
          height += listGroup[i].clientHeight
          this.listHeight.push(height)
        }
      },
      _initSingerList (props) {
        Model.getSingerList(props).then((res) => {
          if (res.code === SUCCESS_CODE) {
            this.total = res.singerList.data.total
            const singers = this._formatSingerList(res.singerList.data.singerlist)
            this.singerList = singers.list
            this.singerTitles = singers.titList
            const tempTags = res.singerList.data.tags
            const tmpArr = []
            for (let k in tempTags) {
              tmpArr.push({
                name: k,
                value: tempTags[k],
                active: res.singerList.data[k]
              })
            }
            this.tags = tmpArr.sort((a, b) => {
              return b.value.length - a.value.length
            })
          }
        })
      },
      _nextPage (args) {
        const props = this.getProps(args)
        Model.getSingerList(props).then((res) => {
          const hasNext = this.total && Math.floor((this.total + 80 - 1) / 80) >= props['cur_page']
          if (hasNext) {
            if (res.code === SUCCESS_CODE) {
              const sl = this.singerList
              const singers = this._formatSingerList(res.singerList.data.singerlist, this.singerTitles[this.singerTitles.length - 1] + 1)
              this.imgOnLoad = false
              sl.push.apply(sl, singers.list)
              const singerTit = this.singerTitles
              singerTit.push.apply(singerTit, singers.titList)
              this.singerList = sl
              this.singerTitles = singerTit
              const tempTags = res.singerList.data.tags
              for (let k in tempTags) {
                this.tags[k] = {
                  value: tempTags[k],
                  active: res.singerList.data[k]
                }
              }
            } else {
              return false
            }
          }
          return hasNext
        }).then((dirty) => {
          this.$refs.scroll.finishPullUp(dirty)
        })
      },
      _formatSingerList (tempArray, lastTit = 1) {
        const tempSinger = tempArray
        const tempSingerTitles = []
        let j = lastTit - 1
        for (let i = 0; i < tempSinger.length; i++) {
          if (i % 10 === 0) {
            j = j + 1
            tempSingerTitles.push(j)
          }
          tempSinger[i].title = j
        }
        const tempSingerGroup = []
        for (let i = 0; i < tempSingerTitles.length; i++) {
          let tempItem = { title: tempSingerTitles[i], singers: [] }
          tempSingerGroup.title = tempSingerTitles[i]
          for (let k = 0; k < tempSinger.length; k++) {
            if (tempSinger[k].title === tempSingerTitles[i]) {
              tempItem.singers.push(tempSinger[k])
            }
          }
          tempSingerGroup.push(tempItem)
        }
        return { list: tempSingerGroup, titList: tempSingerTitles }
      },
      /*
       * 处理获取歌手数据参数
       * pro - object {index:a-z#, area: address, genre: music-style, sex: sex or team, sin: startNum, cur_page: active-page}
       * */
      getProps(pro) {
        const props = Object.assign({}, pro)
        if (Object.keys(this.tags).length !== 0) {
          for (let k in this.tags) {
            props[this.tags[k].name] = this.tags[k].active
          }
        }
        return props
      },
      filterSingerList () {
        const props = this.getProps()
        this._initSingerList(props)
      },
      changeFilter (methodName, id, key) {
        this['change' + methodName](id, key)
      },
      changeindex (index, key) {
        this.tags[key].active = index
        this.filterSingerList()
      },
      changearea (area, key) {
        this.tags[key].active = area
        this.filterSingerList()
      },
      changegenre (genre, key) {
        this.tags[key].active = genre
        this.filterSingerList()
      },
      changesex (sex, key) {
        this.tags[key].active = sex
        this.filterSingerList()
      }
    }
  }
</script>

<style lang="scss" scoped>
@import "~common/scss/variable";
.singer {
  box-sizing: border-box;
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .ScrollWrapper {
    overflow: hidden;
    height: 100%;
    width: 100%;
    position:relative;
    .fixedTitle {
      width: 100%;
      padding-right: 10%;
      box-sizing: border-box;
      position: absolute;
      top: 0;
      left: 0;
      .title{
        background:#333;
        padding: 4px 10%;
        box-sizing: border-box;
        font-size: $font-size-large-x;
      }
    }
  }
  .scroll-content {
    height: 100%;
    width: 100%;
    overflow: hidden;
    position:relative;
    .loadingContainer {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .filter-prop {
    padding: 10px;
    box-sizing: border-box;
    .colum {
      .filter-item {
        &.active {
          color: $color-theme;
          border-bottom: solid 1px $color-theme;
        }
        box-sizing: border-box;
        color: $color-text-d;
        text-decoration: unset;
        padding: 3px;
        margin: 3px 2px;
        display: inline-block;
      }
    }
  }
  .singerList {
    list-style: unset;
    .singerGroup {
      padding: 0 10% 0 0;
      margin: 0;
      display: block;
      .title{
        background:#333;
        padding: 4px 10%;
        box-sizing: border-box;
        font-size: $font-size-large-x;
      }
      .singerItem {
        width: 50%;
        float: left;
        padding: 10px 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .himg {
          width: 90%;
          height: auto;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .name {
          font-size: $font-size-medium-x;
          text-align: center;
          padding-top: 10px;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
  .singerTitles {
    display: block;
    position: absolute;
    width:10%;
    right: 0;
    top:0;
    bottom:0;
    margin:auto;
    overflow: hidden;
    box-sizing: border-box;
    list-style: none;
    .tit-item{
      display:block;
      width:100%;
      a{
        padding:5px 10px;
        text-align: left;
        display:block;
        font-size: $font-size-medium-x;
        width:100%;
        box-sizing: border-box;
      }
    }
    .current {
      color: $color-theme;
    }
  }
}
</style>
