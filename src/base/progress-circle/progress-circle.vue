<template>
  <div class="pregress-circle" ref="progressCircle" :style="{width: radius+'px', height: radius+'px'}">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle class="inner" cx="50" cy="50" r="50" fill="transparent"></circle>
      <circle class="progress" cx="50" cy="50" r="50" fill="transparent"
              :stroke-dasharray="dashArray"
              :stroke-dashoffset="dashOffset"
      ></circle>
    </svg>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    radius: {
      type: Number,
      default: 100
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      dashArray: Math.PI * 100
    }
  },
  computed: {
    dashOffset () {
      return this.dashArray * (1 - this.percent)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~common/scss/variable';
.pregress-circle {
  position: relative;
  circle {
    stroke-width: 8px;
    transform-origin: center;
    transform: scale(0.9);
    &.inner{
      stroke: $color-text-d;
    }
    &.progress {
      stroke: $color-theme;
      transform: scale(0.9) rotate(-90deg);
    }
  }
}
</style>
