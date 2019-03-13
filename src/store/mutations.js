import * as Type from './mutationTypes'
// import { clone } from 'common/js/util'
// import Vue from 'vue'
export default {
  [Type.SET_SINGER] (state, singer) {
    state.singer = singer
  },
  [Type.SET_PLAY_STATE] (state, flag) {
    state.playing = flag
  },
  [Type.SET_FULL_SCREEN] (state, flag) {
    state.fullScreen = flag
  },
  [Type.SET_PLAY_LIST] (state, list) {
    state.playList = list
  },
  [Type.SET_SEQUENCE_LIST] (state, list) {
    state.sequenceList = list
  },
  [Type.SET_PLAY_MODE] (state, mode) {
    state.mode = mode
  },
  [Type.SET_CURRENT_INDEX] (state, index) {
    state.currentIndex = index
  },
  [Type.SET_CURRENT_SONG_URL] (state, url) {
    state.currentSongUrl = url
  },
  [Type.SET_DISC] (state, disc) {
    state.disc = disc
  },
  [Type.SET_TOPLIST] (state, topList) {
    state.topList = topList
  },
  [Type.SET_SEARCH_HISTORY] (state, list) {
    state.searchHistory = list
  },
  [Type.SET_LISTEN_HISTORY] (state, list) {
    state.listenHistory = list
  }
}
