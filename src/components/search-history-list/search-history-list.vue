<template>
  <div class="search-history" v-show="searchHistory.length">
    <div class="head">
      <span class="title">搜索历史</span>
      <i class="icon icon-clear" @click.stop="clearSearches"></i>
    </div>
    <ul class="search-history-list">
      <li class="item" v-for="item in searchHistory" @click="selectItem(item)" :key="item">
        <span class="word" v-html="item"></span>
        <i class="icon icon-delete" @click.stop="delItem(item)"></i>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['searchHistory'])
  },
  methods: {
    selectItem(word) {
      this.$emit('selectItem', word)
    },
    delItem (word) {
      this.$emit('delSearch', word)
    },
    clearSearches () {
      this.$emit('clearSearches')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~common/scss/variable';
  .search-history{
    .head {
      display:flex;
      justify-content: space-between;
      .title {
        font-size: $font-size-large;
        color: $color-theme;
      }
      .icon {
        font-size: $font-size-large;
        color:$color-theme;
      }
    }
    .search-history-list{
      list-style: none;
      padding: 0;
      .item {
        margin: 10px 0;
        font-size: $font-size-large;
        color: $color-text-d;
        display: flex;
        justify-content: space-between;
        .icon-delete {
          font-size: $font-size-medium;
        }
      }
    }
  }
</style>
