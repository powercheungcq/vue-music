import * as Type from './mutationTypes'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import { setSearchHistory, delSearches, setListenHistory } from 'common/js/cache'

function findIndex (list, song) {
  return list.findIndex((item) => {
    return item.songmid === song.songmid
  })
}

export default {
  addPlayList ({ commit, state }, { list, index }) {
    if (state.mode === playMode.random) {
      let randomList = shuffle(list)
      index = findIndex(randomList, list[index])
      commit(Type.SET_PLAY_LIST, randomList)
    } else {
      commit(Type.SET_PLAY_LIST, list)
    }
    commit(Type.SET_SEQUENCE_LIST, list)
    commit(Type.SET_CURRENT_INDEX, index)
    commit(Type.SET_FULL_SCREEN, true)
  },
  randomPlay ({ commit }, list) {
    commit(Type.SET_SEQUENCE_LIST, list)
    const randomList = shuffle(list)
    commit(Type.SET_PLAY_LIST, randomList)
    commit(Type.SET_CURRENT_INDEX, 0)
    commit(Type.SET_PLAY_MODE, playMode.random)
    commit(Type.SET_FULL_SCREEN, true)
  },
  addSongToPlaylist ({ commit, state }, song) {
    const list = state.playList.slice()
    let index = findIndex(list, song)
    if (index === -1) {
      list.push(song)
      index = findIndex(list, song)
    }
    if (state.mode === playMode.random) {
      let randomList = shuffle(list)
      index = findIndex(randomList, song)
      commit(Type.SET_PLAY_LIST, randomList)
    } else {
      commit(Type.SET_PLAY_LIST, list)
    }
    commit(Type.SET_SEQUENCE_LIST, list)
    commit(Type.SET_CURRENT_INDEX, index)
    commit(Type.SET_FULL_SCREEN, true)
  },
  addHistorySearch ({ commit }, word) {
    commit(Type.SET_SEARCH_HISTORY, setSearchHistory(word))
  },
  deleteHistorySearch ({ commit }, word) {
    commit(Type.SET_SEARCH_HISTORY, delSearches(word))
  },
  clearHistorySearch ({ commit }) {
    delSearches()
    commit(Type.SET_SEARCH_HISTORY, [])
  },
  delSongAtPlayList ({ state, commit }, { song, sequenceIndex }) {
    const playList = state.playList.slice()
    const sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex
    const pIndex = findIndex(playList, song)
    playList.splice(pIndex, 1)
    sequenceList.splice(sequenceIndex, 1)
    if (currentIndex > pIndex) {
      currentIndex--
    }
    commit(Type.SET_SEQUENCE_LIST, sequenceList)
    commit(Type.SET_PLAY_LIST, playList)
    commit(Type.SET_CURRENT_INDEX, currentIndex)
    if (!playList.length) {
      commit(Type.SET_PLAY_STATE, false)
    }
  },
  changePlayMode ({ state, commit }) {
    let mode = (state.mode + 1) % 3
    let playList = state.playList.slice()
    let currentSong = playList[state.currentIndex]
    if (mode === playMode.random) {
      playList = shuffle(playList)
    } else {
      playList = state.sequenceList.slice()
    }
    const index = playList.findIndex(item => item.songmid === currentSong.songmid)
    commit(Type.SET_PLAY_MODE, mode)
    commit(Type.SET_PLAY_LIST, playList)
    commit(Type.SET_CURRENT_INDEX, index)
  },
  clearPlayList ({ state, commit }) {
    commit(Type.SET_SEQUENCE_LIST, [])
    commit(Type.SET_PLAY_LIST, [])
    commit(Type.SET_CURRENT_INDEX, -1)
    commit(Type.SET_PLAY_STATE, false)
  },
  addHistoryListen ({ commit }, song) {
    commit(Type.SET_LISTEN_HISTORY, setListenHistory(song))
  }
}
