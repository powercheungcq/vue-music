<template>
  <div class="banner" @touchstart="handleTS" @touchmove="handleTM" @touchend="handleTE">
    <div class="slider" :style="{width:sliderWidth}">
      <div class="slider-item" :style = "item.style" v-for="(item) in topSliders" :key="item.id" >
        <img class="needsclick" :src="item.picUrl" alt="" >
      </div>
    </div>
    <div class="pagination">
      <span v-for="(item, index) in sliders" :key="item.id" class="pagi-items" :class="{'pagi-active':index === activeIndex}"></span>
    </div>
  </div>
</template>

<script>
export default {
  created () {
    this.touches.tduration = 400
  },
  props: {
    sliders: {
      required: true,
      type: Array
    }
  },
  data () {
    return {
      activeIndex: 0,
      touches: {},
      clientWidth: 0,
      translateX: 0
    }
  },
  computed: {
    sliderWidth () {
      return `${this.clientWidth * this.sliders.length}px`
    },
    topSliders () {
      const temSlider = this.sliders
      const prevIndex = this.activeIndex === 0 ? this.sliders.length - 1 : this.activeIndex - 1
      const nextIndex = this.activeIndex === this.sliders.length - 1 ? 0 : this.activeIndex + 1
      temSlider.forEach((item, index) => {
        let style = `width:${this.clientWidth}px;left:-${index * this.clientWidth}px;`
        if (index === this.activeIndex) {
          style += `transform:translate(${this.translateX + 0}px,0) translateZ(0);z-index:9;transition-duration:${this.touches.tduration}ms;`
        } else if (index === nextIndex) {
          style += `transform:translate(${this.translateX + this.clientWidth}px,0) translateZ(0);z-index:0;transition-duration:${this.touches.tduration}ms;`
        } else if (index === prevIndex) {
          style += `transform:translate(${this.translateX - this.clientWidth}px,0) translateZ(0);z-index:0;transition-duration:${this.touches.tduration}ms`
        } else {
          style += `transform:translate(-${this.clientWidth}px,0) translateZ(0);z-index:0;transition-duration:400ms;`
        }
        item.style = style
        return item
      })
      return temSlider
    }
  },
  mounted () {
    this.clientWidth = document.body.clientWidth
    this.startInterval()
  },
  beforeDestroy () {
    this.stopInterval()
  },
  methods: {
    startInterval () {
      if (this.timer === null || this.timer === undefined) {
        this.timer = setInterval(() => {
          this.activeIndex = this.activeIndex === this.sliders.length - 1 ? 0 : this.activeIndex + 1
        }, 5000)
      }
    },
    stopInterval () {
      if (this.timer !== null && this.timer !== undefined) {
        clearInterval(this.timer)
        this.timer = null
      }
    },
    handleTS (e) {
      this.stopInterval()
      this.touches.touchStart = e.targetTouches[0].pageX
    },
    handleTM (e) {
      this.touches.touchEnd = e.changedTouches[0].pageX
      this.touches.tduration = 0
      this.translateX = this.touches.touchEnd - this.touches.touchStart
    },
    handleTE () {
      this.touches.tduration = 400
      if (this.translateX < -this.clientWidth / 5) {
        this.activeIndex = this.activeIndex === this.sliders.length - 1 ? 0 : this.activeIndex + 1
      } else if (this.translateX > this.clientWidth / 5) {
        this.activeIndex = this.activeIndex === 0 ? this.sliders.length - 1 : this.activeIndex - 1
      }
      this.translateX = 0
      this.startInterval()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~common/scss/variable.scss';
  .banner{
    width:100%;
    overflow: hidden;
    position: relative;
    .slider{
      position:relative;
      .slider-item{
        position: relative;
        float:left;
        .needsclick{
          width:100%;
        }
      }
    }
    .pagination{
      position:absolute;
      bottom: 10px;
      width:100%;
      display: block;
      text-align: center;
      z-index:19;
      .pagi-items{
        display:inline-block;
        width:6px;
        height:6px;
        background:$color-dialog-background;
        margin:0 3px;
        border-radius:100%;
        &.pagi-active{
          background:$color-text-ll;
        }
      }
    }
  }

</style>
