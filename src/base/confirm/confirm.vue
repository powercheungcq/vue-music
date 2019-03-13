<template>
  <transition name="confirm">
    <div class="confirm-box" v-show="show">
      <div class="confirm-container">
        <p class="text">{{text}}</p>
        <div class="btn">
          <span class="cancel" @click="handleCancel">{{cancel}}</span>
          <span class="confirm" @click="handleSure">{{confirm}}</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    cancel: {
      type: String,
      default: '取消'
    },
    confirm: {
      type: String,
      default: '确认'
    }
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    handleCancel () {
      this.toggleShow()
      this.$emit('cancel')
    },
    handleSure () {
      this.toggleShow()
      this.$emit('sure')
    },
    toggleShow() {
      this.show = !this.show
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~common/scss/variable';
.confirm-box {
  transition: all 0.2s ease-in-out;
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  .confirm-container{
    width: 200px;
    height: 100px;
    background: #333333;
    display:flex;
    flex-direction: column;
    justify-content: space-around;
    margin: 0 auto;
    position: relative;
    .text{
      text-align: center;
      flex: 1;
      padding: 20px 10px 40px;
    }
    .btn {
      display:flex;
      justify-content: space-around;
      font-size: $font-size-medium;
      width: 100%;
      height: 40px;
      bottom: 0;
      position: absolute;
      span{
        display:inline-block;
        width: 50%;
        line-height:40px;
        text-align: center;
        background: #333333;

      }
    }
  }
}
.confirm-enter-active, .confirm-leave-active{
  opacity: 1;
  transform: scale(1.1);
}
.confirm-enter, .confirm-leave-to{
  opacity: 0;
  transform: scale(0);
}
</style>
