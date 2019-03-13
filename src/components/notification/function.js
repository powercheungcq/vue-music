import Vue from 'vue'
import Component from './func-notification'

const NotificationConstructor = Vue.extend(Component)

let flag = 0
const notify = (options) => {
  console.log(options.content)
  if (Vue.prototype.$isServer) {
    return false
  }
  const { autoColse, ...props } = options
  const instance = new NotificationConstructor({
    propsData: {
      ...props
    },
    data () {
      return {
        autoColse: autoColse === undefined ? 3000 : autoColse
      }
    },
    mounted () {
      console.log(this)
    }
  })

  instance.id = `notification${flag++}`
  instance.$mount()
  document.body.appendChild(instance.$el)
}

export default notify
