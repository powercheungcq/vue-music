<template>
  <div ref="wrapper" class="scroll-wrapper" v-show = "data">
    <div>
      <slot></slot>
      <slot name="pullup"
            :pullUpLoad="pullUpLoad"
            :isPullUpLoad="isPullUpLoad"
      >
        <div class="pullup-wrapper" v-if="pullUpLoad">
          <div class="before-trigger" v-if="!isPullUpLoad">
            <span v-show="data.length">{{pullUpTxt}}</span>
          </div>
          <div class="after-trigger" v-else>
            <loading></loading>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import Loading from 'base/loading/loading'
  export default {
    components: { Loading },
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default: () => []
      },
      pullUpLoad: {
        type: Object,
        default: null
      },
      listenScroll: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        isPullUpLoad: false,
        pullUpDirty: true
      }
    },
    computed: {
      pullUpTxt () {
        return this.pullUpDirty ? '上拉加载更多' : '我是有底线的'
      }
    },
    mounted () {
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    methods: {
      finishPullUp (dirty) {
        if (this.pullUpLoad && this.isPullUpLoad) {
          this.isPullUpLoad = false
          this.scroll.finishPullUp()
          this.pullUpDirty = dirty
          this.refresh()
        } else {
          this.scroll.refresh()
        }
      },
      scrollToElement (el, time = 0) {
        this.scroll.scrollToElement(el, time)
      },
      scrollTo (x, y, time = 0) {
        this.scroll.scrollTo(x, y, time)
      },
      _initScroll () {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click,
          pullUpLoad: this.pullUpLoad
        })
        if (this.pullUpLoad) {
          this.scroll.on('pullingUp', () => {
            this.isPullUpLoad = true
            this.$emit('pullingUp')
          })
        }
        if (this.listenScroll) {
          this.scroll.on('scroll', (pos) => {
            this.$emit('scroll', pos)
          })
        }
      },
      enable () {
        this.scroll && this.scroll.enable()
      },
      disable () {
        this.scroll && this.scroll.disable()
      },
      refresh () {
        this.scroll && this.scroll.refresh()
      }
    },
    watch: {
      data () {
        this.$nextTick(() => {
          this.refresh()
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~common/scss/variable";
  .scroll-wrapper {
    position:relative;
    height: 100%;
    .pullup-wrapper {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 16px 0;
      .before-trigger{
        span {
          font-size: $font-size-medium
        }
      }
    }
  }
</style>
