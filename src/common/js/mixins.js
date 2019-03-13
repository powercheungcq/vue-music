import { mapGetters, mapMutations, mapActions } from 'vuex'

export const playListMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted () {
    this.handlePlaylist(this.playList)
  },
  activated () {
    this.handlePlaylist(this.playList)
  },
  watch: {
    playList (newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist () {
      throw new Error('component use mixin must has handlePlaylist method')
    }
  }
}

export const searchListMixin = {
  data () {
    return {
      searchWord: ''
    }
  },
  methods: {
    saveSearch (word) {
      this.addHistorySearch(word)
    },
    selectSinger(singer) {
      this.setSinger(singer)
      this.$router.push(`/singer/${singer.singer_mid}`)
    },
    selectSong (song) {
      this.addSongToPlaylist(song)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER',
      setSearchHistory: 'SET_SEARCH_HISTORY'
    }),
    ...mapActions({
      addSongToPlaylist: 'addSongToPlaylist',
      addHistorySearch: 'addHistorySearch',
      deleteHistorySearch: 'deleteHistorySearch',
      clearHistorySearch: 'clearHistorySearch'
    })
  }
}
