<template>
  <div class="recommend">
    <Scroll :data="discList" ref="scroll" class="recommend-content">
      <div>
        <Slider v-if="sliders.length">
          <div v-for="item in sliders" :key="item.id">
            <a :href="item.linkUrl">
              <img @load="imgLoad" :src ="item.picUrl" alt="">
            </a>
          </div>
        </Slider>
        <div class="recommendList">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li class="discItem" @click="selectItem(item)" v-for="item in discList" :key="item.dissid">
              <div class="icon">
                <img v-lazy ="item.imgurl" alt="">
                <span class="listennum icon-music">
                  {{item.listennum}}
                </span>
                <span class="icon-play">
                </span>
              </div>
              <div class="disc">
                <h2>{{item.dissname}}</h2>
                <p class="name">{{item.creator.name}}</p>
              </div>
            </li>
            <div style="clear:both;"></div>
          </ul>
        </div>
      </div>
    </Scroll>
    <Loading v-if="!discList.length"></Loading>
    <router-view></router-view>
  </div>
</template>

<script>
  import recommendModel from 'api/recommend'
  import { SUCCESS_CODE } from 'api/config'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import Slider from 'base/slider/slider'
  import { playListMixin } from 'common/js/mixins'
  import { mapMutations } from 'vuex'
  export default {
    mixins: [playListMixin],
    components: { Slider, Scroll, Loading },
    created () {
      this._getRecommend()
      this._getDiscList()
    },
    data () {
      return {
        sliders: [],
        discList: []
      }
    },
    methods: {
      handlePlaylist (playList) {
        if (playList.length > 0) {
          this.$refs.scroll.$el.style.height = `${window.innerHeight - 88 - 60}px`
        } else {
          this.$refs.scroll.$el.style.bottom = ''
        }
        this.$refs.scroll.refresh()
      },
      selectItem (item) {
        this.setDisc(item)
        this.$router.push(`/recommend/${item.dissid}`)
      },
      _getDiscList () {
        recommendModel.getDiscList(0, 29).then((res) => {
          res.data.list.map((item) => {
            const changedItem = item
            changedItem.listennum = changedItem.listennum > 10000 ? Math.ceil(changedItem.listennum / 1000) / 10 + '万' : Math.ceil(changedItem.listennum / 100) * 100
            return changedItem
          })
          this.discList = res.data.list
        })
      },
      _getRecommend () {
        recommendModel.getRecommend().then(res => {
          if (res.code === SUCCESS_CODE) {
            const slidersData = res.data.slider
            this.sliders = slidersData
          }
        })
      },
      imgLoad () {
        if (this.checkLoad) {
          this.$refs.scroll.refresh()
          this.checkLoad = true
        }
      },
      ...mapMutations({
        setDisc: 'SET_DISC'
      })
    }
  }
</script>

<style lang="scss" scoped>
  @import '~common/scss/variable.scss';
  .recommend{
    width:100%;
    position: fixed;
    top: 88px;
    bottom: 0;
    .recommend-content{
      height:100%;
      overflow: hidden;
    }
    .recommendList{
      .list-title{
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }
      ul{
        margin:0;
        padding:0;
        .discItem{
          list-style: none;
          width: 50%;
          box-sizing: border-box;
          float:left;
          padding: 10px;
          .icon{
            width:100%;
            height:auto;
            position:relative;
            &::before {
              content:"";
              display:block;
              padding-top:100%;
            }
            &::after {
              content:"";
              display:block;
              position:absolute;
              bottom:0;
              left:0;
              height:42px;
              background:url("~common/image/shadow_rp.png") repeat-x;
              width:100%;
              background-size:1px 42px;
            }
            img{
              width: 100%;
              position:absolute;
              top:0;
              left:0;
            }
            .listennum {
              display:block;
              line-height:1.3;
              bottom:7px;
              left:7px;
              position:absolute;
              z-index:9;
            }
            .icon-play{
              display:block;
              position: absolute;
              right:7px;
              bottom:7px;
              line-height:1.3;
              z-index:9;
            }
          }
          .disc {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            line-height: 20px;
            overflow: hidden;
            font-size: $font-size-medium;
            h2{
              color: $color-text;
              font-size: $font-size-medium;
              font-weight:normal;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }
            .name{
              color: $color-text-d;
            }
          }
        }
      }
    }
  }

</style>
