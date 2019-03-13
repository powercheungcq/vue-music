import { playMode } from 'common/js/config'
import { getSearchHistory, getListenHistory } from 'common/js/cache'
export default {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {},
  topList: {},
  searchHistory: getSearchHistory(),
  listenHistory: getListenHistory()
}
