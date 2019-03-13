export function shuffle (array) {
  let arr = array.slice()
  for (let i = 0; i < arr.length; i++) {
    const r = getRandomInt(0, i)
    let t = arr[r]
    arr[r] = arr[i]
    arr[i] = t
  }
  return arr
}
export function clone (target) {
  const targetClone = Array.isArray(target) ? [] : {}
  if (typeof target === 'object') {
    for (let k in target) {
      if (typeof target[k] === 'object') {
        targetClone[k] = clone(target[k])
      } else {
        targetClone[k] = target[k]
      }
    }
  }
  return targetClone
}

function getRandomInt (min, max) {
  return Math.floor(Math.random() * ((max - min) + min + 1))
}
