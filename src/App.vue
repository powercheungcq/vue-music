<template>
  <div id="app" class="wrap">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <Player></Player>
  </div>
</template>
<script>
import MHeader from 'components/m-header/m-header'
import Tab from './components/tab/tab'
import Player from './components/player/player'
export default {
  components: { Tab, MHeader, Player }
}
</script>

<style lang="scss">
  .wrap{
    width:100%;
   // overflow: hidden;
  }
</style>
