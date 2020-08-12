<template>
    <div>
        <template-display-block></template-display-block>
        <div class="clear_both divide_type"></div>
        <template-display-block 
            title="学习" 
            context="official" 
            :list="[ {
                tid: '1',
                src: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                name: '退学专用模板'
            },]"></template-display-block>
    </div>
</template>

<script>
export default {
    data () {
        return {
            list:[

            ]
        }
    },

    mounted(){
        this.init();
    },

    methods:{
        init(){

        }
    }
}
</script>


<style scoped>
@import url("../assets/common.css");

.divide_type{
    height:30px;
}

</style>
