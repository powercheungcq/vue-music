<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sgroup" >
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="item in dots" :key="item" :class="{active : currentPageIndex === item}"></span>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import { addClass } from 'common/js/dom'
  export default {
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      },
      showDots: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    mounted () {
      setTimeout(() => {
        this._autoSetSliderItemWidth()
        this._sliderInit()
        if (this.showDots) {
          this._initDots()
        }
        if (this.autoPlay) {
          this._play()
        }
      }, 20)
      window.addEventListener('resize', () => {
        this._autoSetSliderItemWidth(true)
        this.slider.refresh()
      })
    },
    methods: {
      _autoSetSliderItemWidth (isResize) {
        const iWidth = this.$refs.slider.clientWidth
        this.childrens = this.$refs.sgroup.children
        let sgWidth = 0
        for (let i = 0; i < this.childrens.length; i++) {
          const children = this.childrens[i]
          addClass(children, 'slider-item')
          children.style.width = iWidth + 'px'
          sgWidth += iWidth
        }
        if (this.loop && !isResize) {
          sgWidth += iWidth * 2
        }
        this.$refs.sgroup.style.width = sgWidth + 'px'
      },
      _sliderInit () {
        const sliderWrpper = this.$refs.slider
        this.slider = new BScroll(sliderWrpper, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          click: true,
          snap: {
            loop: this.loop,
            threshold: 0.2,
            speed: 400
          }
        })
        this.slider.on('scrollEnd', () => {
          this.currentPageIndex = this.slider.getCurrentPage().pageX
          if (this.autoPlay) {
            clearTimeout(this.timer)
            this._play()
          }
        })
      },
      _initDots () {
        const tempArr = []
        for (let i = 0; i < this.childrens.length - 2; i++) {
          tempArr[i] = i
        }
        this.dots = tempArr
      },
      _play () {
        this.timer = setTimeout(() => {
          this.currentPageIndex = this.currentPageIndex + 1
          this.slider.next()
        }, this.interval)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~common/scss/variable';
  @import '~common/scss/mixin';
  .slider {
    width: 100%;
    overflow: hidden;
    position: relative;
    .slider-group {
      position: relative;
      .slider-item {
        position: relative;
        float: left;
        img {width:100%;}
        .needsclick {
          width: 100%;
        }
      }
    }
    .dots {
      position: absolute;
      bottom: 10px;
      width: 100%;
      display: block;
      text-align: center;
      z-index: 19;
      .dot {
        display: inline-block;
        width: 6px;
        height: 6px;
        background: $color-dialog-background;
        margin: 0 3px;
        border-radius: 100%;
        &.active {
          background: $color-text-ll;
        }
      }
    }
  }
</style>
