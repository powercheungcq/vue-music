<template>
  <div class="notifi">
    <span class="content">{{content}}</span>
    <a href="javascript:void(0);">{{btn||'colse'}}</a>
  </div>
</template>

<script>
  export default {
    props: {
      content: {
        type: String,
        required: true
      },
      btn: {
        type: String
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~common/scss/variable.scss";
  @import "~common/scss/mixin.scss";
  .notifi{
    display:flex;
    background-color: $color-dialog-background;
  }
</style>
