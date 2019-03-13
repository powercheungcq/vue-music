import storage from 'good-storage'

const SEARCH_STORAGE_KEY = '__search__'
const LISTEN_STORAGE_KEY = '__listen__'
const MAX_LENGTH = 15
const LISTEN_MAX_LENGTH = 20

function handleHistory(val, list, maxLength, filterMethod) {
  const index = list.findIndex(filterMethod)
  if (index === 0) {
    return
  }
  if (index > 0) {
    list.splice(index, 1)
  }
  list.unshift(val)
  if (list.length > maxLength) {
    list.pop()
  }
}

export function setSearchHistory (val) {
  const list = storage.get(SEARCH_STORAGE_KEY, [])
  handleHistory(val, list, MAX_LENGTH, (item) => item === val)
  storage.set(SEARCH_STORAGE_KEY, list)
  return list
}

export function getSearchHistory () {
  return storage.get(SEARCH_STORAGE_KEY, [])
}

export function delSearches(val) {
  let list = storage.get(SEARCH_STORAGE_KEY, [])
  if (!val) {
    storage.remove(SEARCH_STORAGE_KEY)
    list = []
  } else {
    const index = list.findIndex(item => {
      return item === val
    })
    list.splice(index, 1)
    storage.set(SEARCH_STORAGE_KEY, list)
  }
  return list
}

export function getListenHistory () {
  return storage.get(LISTEN_STORAGE_KEY, [])
}

export function setListenHistory (song) {
  const list = storage.get(LISTEN_STORAGE_KEY, [])
  handleHistory(song, list, LISTEN_MAX_LENGTH, (item) => item.songmid === song.songmid)
  storage.set(LISTEN_STORAGE_KEY, list)
  return list
}
