export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.toString().split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}
export function hasClass(el, className) {
  const regex = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return regex.exec(el.className)
}
export function getData (el, name, value) {
  name = 'data-' + name
  if (value) {
    el.setAttribute(name, value)
  } else {
    return el.getAttribute(name)
  }
}

export function prefixStyle (style) {
  const prefix = (() => {
    const prefixes = {
      Moz: 'MozTransition',
      webkit: 'webkitTransition',
      ms: 'msTransition',
      O: 'OTransition',
      normal: 'transition'
    }
    const el = document.createElement('div')
    for (let k in prefixes) {
      if (el.style[prefixes[k]] !== undefined) {
        return k
      }
    }
    return false
  })()
  if (!prefix) {
    return false
  } else if (prefix === 'normal') {
    return style
  } else {
    return prefix + style.charAt(0).toUpperCase() + style.substr(1)
  }
}
