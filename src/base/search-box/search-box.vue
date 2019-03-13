<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input type="text" @click.stop="handleClick" v-model="searchWord" class="search-input" :placeholder="placeholder">
    <i class="icon-dismiss" v-show="searchWord" @click.stop="handleClear"></i>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      searchWord: ''
    }
  },
  methods: {
    handleClear () {
      this.searchWord = ''
    },
    handleClick (e) {
      e.target.focus()
    },
    setSearchWord(searchWord) {
      this.searchWord = searchWord.trim()
    },
    searching (w) {
      this.$emit('searchWordChange', w)
    }
  },
  created () {
    this.$watch('searchWord', (newVal) => {
      this.searching(newVal)
    })
  }
}
</script>

<style lang="scss" scoped>
@import '~common/scss/variable';
.search-box {
  height: 50px;
  padding: 0 25px;
  margin-bottom: 10px;
  display:flex;
  justify-content: space-between;
  align-items: center;
  background: $color-background-d;
  border-radius: 25px;
  i {
    font-size: $font-size-large;
  }
  .search-input {
    background: transparent;
    color: $color-text;
    border:none;
    outline: none;
    font-size: $font-size-large;
    padding: 0 10px;
    box-sizing: border-box;
    height: 100%;
    width:100%;
  }
}

</style>
