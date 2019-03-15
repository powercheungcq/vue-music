<template>
  <div class="tab">
    <router-link tag="div" class="tab-item" to="/recommend">
      <span class="tab-link">首页</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/singer">
      <span class="tab-link">团队</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/rank">
      <span class="tab-link">排行</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/search">
      <span class="tab-link">搜索</span>
    </router-link>
  </div>
</template>

<script>
  export default {}
</script>

<style scoped lang="scss">
  @import '~common/scss/variable.scss';
.tab{
  display: flex;
  justify-content:center;
  height: 44px;
  line-height: 44px;
  font-size: $font-size-medium;
  background-color: $color-background-d;
  .tab-item{
    flex: 1;
    text-align:center;
    .tab-link{
      padding-bottom:5px;
      color:$color-text-l;
    }
    &.router-link-active .tab-link{
      color: $color-theme;
      border-bottom: 2px solid $color-theme;
    }
  }
}
</style>
