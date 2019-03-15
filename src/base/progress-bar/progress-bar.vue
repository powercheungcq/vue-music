<template>
  <div class="progress-bar"
       ref="progressBar"
       @click="handleClick"
  >
    <div class="bar-inner" ref="innerBar" >
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn">
        <div class="progress-btn"
             @touchstart ="touchStart"
             @touchmove="touchMove"
             @touchend="touchEnd"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
  import { prefixStyle } from 'common/js/dom'

  const progressBtnWidth = 16
  const transform = prefixStyle('transform')
  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created () {
      this.touches = {}
    },
    methods: {
      touchStart (e) {
        this.touches.startX = e.touches[0].pageX
        this.touches.initiated = true
      },
      touchMove (e) {
        const newX = e.touches[0].pageX
        this.touches.moveWidth = this.$refs.progress.clientWidth + (newX - this.touches.startX)
        this.$refs.progressBtn.style[transform] = `translate3d(${this._getProgressWidth(this.touches.moveWidth)}px,0,0)`
      },
      touchEnd () {
        this.touches.initiated = false
        this.$emit('progressClick', (this._getProgressWidth(this.touches.moveWidth) / (this.$refs.progressBar.clientWidth - progressBtnWidth)))
      },
      handleClick (e) {
        const progressBarWidth = this.$refs.progressBar.clientWidth
        const progressBarLeftWidth = this.$refs.progressBar.getBoundingClientRect().left
        let x = this._getProgressWidth(e.pageX - progressBtnWidth / 2 - progressBarLeftWidth)
        this.$emit('progressClick', x / (progressBarWidth - progressBtnWidth))
      },
      _getProgressWidth (val) {
        return Math.min(Math.max(val, 0), this.$refs.progressBar.clientWidth - progressBtnWidth)
      },
      _setProgressBar (nPercent) {
        if (this.percent > 0 && !this.touches.initiated) {
          const pbWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          const progressWidth = nPercent * pbWidth
          const trans = this._getProgressWidth(progressWidth)
          this.$refs.progress.style.width = `${progressWidth}px`
          this.$refs.progressBtn.style[transform] = `translate3d(${trans}px,0,0)`
        }
      }
    },
    watch: {
      percent (newPercent) {
        this._setProgressBar(newPercent)
      }
    }
  }
</script>

<style lang="scss" scoped>
@import '~common/scss/variable';
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress{
      height: 100%;
      background: $color-theme;
      position: absolute;
    }
    .progress-btn-wrapper{
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>
