<template>
  <transition name="tip" class="top-tip" >
    <div class="tipContent" @click="hide" v-if="tipFlag">
      <i class="icon-ok"></i>
      <span class="txt">{{text}}</span>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      text: {
        type: String,
        default: ''
      },
      delay: {
        type: Number,
        default: 2000
      }
    },
    data () {
      return {
        tipFlag: false
      }
    },
    methods: {
      show () {
        this.tipFlag = true
        clearTimeout(timer)
        const timer = setTimeout(() => {
          this.hide()
        }, this.delay)
      },
      hide() {
        this.tipFlag = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~common/scss/variable";
  .tipContent {
    z-index: 499;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    line-height: 60px;
    background: $color-dialog-background;
    color: $color-text;
    font-size: $font-size-large;
    text-align: center;
  }
  .tip-enter-active, .tip-leave-active {
    transition: all 0.3s ease-in;
    transform: translate3d(0, 0, 0);
  }
  .tip-enter, .tip-leave-to {
    transform: translate3d(0, -100%, 0);
  }
</style>
