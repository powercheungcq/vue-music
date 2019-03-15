<template>
  <div>
    <div @click="selectSong(song, index)" class="songList" v-for="(song, index) in songs" :key="song.songmid">
      <div class="rank" v-show="isRank">
        <span :class="getRankCls(index)">{{getRankText(index)}}</span>
      </div>
      <div class="songDetail">
        <h3 class="songName" v-html="song.songname"></h3>
        <span class="songDes" :style="{'width': `${songDesWidth}px`}">{{song.singer}}·{{song.albumname && song.albumname}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      songs: {
        type: Array,
        default: () => []
      },
      isRank: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      songDesWidth () {
        return window.innerWidth - 60 - 55
      }
    },
    methods: {
      selectSong(item, index) {
        this.$emit('select', item, index)
      },
      getRankCls (index) {
        if (index <= 2) {
          return `icon icon${index}`
        } else {
          return 'text'
        }
      },
      getRankText (index) {
        if (index > 2) {
          return index
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
@import '~common/scss/variable';
@import '~common/scss/mixin';
.songList {
  display:flex;
  align-items: center;
  margin-top: 10px;
  .rank {
    width: 25px;
    margin-right: 30px;
    text-align:center;
    .icon{
      display: inline-block;
      width: 25px;
      height: 24px;
      background-size: 25px 24px;
      &.icon0 {
        @include bg-image('first');
      }
      &.icon1 {
        @include bg-image('second');
      }
      &.icon2 {
        @include bg-image('third');
      }
    }
    .text {
      font-size: $font-size-large;
      color: $color-theme;
    }

  }
  .songDetail {
    display: flex;
    flex-direction: column;
    .songName {
      font-size: $font-size-medium;
      color: $color-text
    }
    .songDes {
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 80%;
      font-size: $font-size-medium;
      color: $color-text-d;
    }
  }
}
</style>
