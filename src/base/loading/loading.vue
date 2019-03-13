<template>
  <div class="loading">
    <div class="load-container">
      <img src="~common/image/loading.gif" alt="">
      <p>{{text}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '正在加载...'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~common/scss/variable';
.loading{
  position: relative;
  display:flex;
  height:100%;
  width:100%;
  justify-content:center;
  align-items:center;
  .load-container{
    text-align: center;
    img {
      width: 20px;
      height: auto;
    }
    p{color:$color-text-d;font-size:$font-size-medium;text-align: center}
  }
}
</style>
