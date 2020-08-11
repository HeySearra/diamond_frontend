<template>
<el-container>
    <el-button size="mini" @click="visible">显示抽屉</el-button>
 <div v-if="drawerVisible" class="mask"></div>
<transition :name="this.direction=='left'?'slide-right':'slide-left'">
  <div v-if="drawerVisible" @click.stop=close class="drawer">
<div
 class="drawer_body"
 :style="{
  'right':direction=='right'?'0':'auto',
  'left':direction=='left'?'0':'auto',
  'width':width+'px',
  'background': background,
  'overflow-y':scroll?'scroll':'hidden'}"
>
  </div>
  </div>
</transition>
</el-container>
</template>

<script>
export default {
    props: {
        // 是否显示drawer
        drawerVisible: Boolean,
        // drawer方向
        direction: {
            type: String,
            default: 'right',
            validator(val) {
                return ["right", "left"].indexOf(val) !== -1;
            }
        },
        // drawer宽度
        width: {
            type: Number,
            default: 400
        },
        // drawer背景色
        background: {
            type: String,
            default: "#ffffff"
        },
        // 是否显示遮罩层
        mask: {
            type: Boolean,
            default: true
        },
        title: String,
        // 是否显示关闭按钮
        closeBtn: {
            type: Boolean,
            default: false
        },
         scroll: {
            type: Boolean,
            default: false
        }
    },
    methods:{
         visible() {
            this.drawerVisible = true;
            this.title = "123";
        },
         close() {
            this.drawerVisible = false;
            this.$emit("update:drawerVisible", false);
            this.$emit("close");
        }
    }
};
</script>

<style scoped>
    .drawer {
        position: absolute;
        height: 100vh;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        z-index: 1000000 !important;
    }
    .drawer .drawer_body {
        height: 100%;
        position: absolute;
        z-index: 1000001;
        background-color: #fff;
    }
    .mask {
        height: 100vh;
        width: 100vw;
        position: absolute;
        z-index: 1000000;
        top: 0;
        left: 0;
        background-color: #000;
        opacity: 0.3;
    }
    .slide-right-enter-active,
    .slide-right-leave-active,
    .slide-left-enter-active,
    .slide-left-leave-active {
        will-change: transform;
        transition: transform 400ms;
        position: absolute;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }
    .slide-right-enter,
    .slide-right-leave-active {
        transform: translate(-100%, 0);
    }
    .slide-left-leave-active,
    .slide-left-enter {
        transform: translate(100%, 0);
    }
</style>