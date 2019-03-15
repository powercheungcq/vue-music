<template>
  <ul class="switches">
    <li class="item"
        :class="{'active':currentIndex === index}"
        v-for="(item, index) in switchesList"
        :key="item.name"
        @click="selectItem(index)"
    >{{item.name}}</li>
  </ul>
</template>

<script>

  export default {
    props: {
      switchesList: {
        type: Array,
        default: () => []
      },
      currentIndex: {
        type: Number,
        default: 0
      }
    },
    methods: {
      selectItem(index) {
        this.$emit('switch', index)
      }
    }
  }
</script>

<style lang="scss" scoped>
@import '~common/scss/variable';
.switches{
  width: 240px;
  list-style: none;
  display:flex;
  .item{
    flex: 1;
    border: 1px solid $color-highlight-background;
    text-align: center;
    padding: 8px;
    font-size: $font-size-medium;
    &.active{
      background: $color-highlight-background;
    }
  }
}
</style>
