<template>
 <view class="weui-switch" :class="{'weui-switch-on' : isChecked}" :value="value" @tap="toggle"></view>
</template>

<script>
    export default {
        props: {
          value: {
            type: Boolean,
            default: true
          }
        },
        data () {
            return {
                isChecked: this.value
            }
        },
        watch: {
          value (val) {
            this.isChecked = val
          },
          isChecked(val) {
            this.$emit('input', val);
          }
        },
        methods: {
          toggle() {
            this.isChecked = !this.isChecked;
          }
        }
    }    
</script>
<style lang="scss" scoped>
    .weui-switch {
        display: block;
        position: relative;
        width: 80rpx;
        height: 48rpx;
        outline: 0;
        border-radius: 30rpx;
        box-sizing: border-box;
        background-color: #CCCCCC;
        /* transition: background-color 0.1s, border 0.1s; */
        /* cursor: pointer; */
    }
  .weui-switch:before {
        content: " ";
        position: absolute;
        top: 0;
        left: 0;
        width: 80rpx;
        height: 48rpx;
        border-radius: 30rpx;
        background-color: #CCCCCC;
        transition: transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
    }
   .weui-switch:after {
        content: " ";
        position: absolute;
        top: 50%;
        left: 7rpx;
        width: 36rpx;
        height: 36rpx;
        border-radius: 50%;
        background-color: #FFFFFF;
		transform: translateY(-50%);
        box-shadow: 0px 6px 16px 0px rgba(0,0,0,0.05); 
        transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
    }
   .weui-switch-on:before {
        background-color: $color-primary;
        background-color: $color-primary;
    }
    .weui-switch-on:after {
        transform: translate(33rpx,-50%);
    }
</style>
</style>
