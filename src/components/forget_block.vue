<template>
    <el-card class="box-card">
        <div>
            <h2><figure></figure></h2>
            <el-form :model="form" :rules="rules" ref="form" label-width="0">
                <el-form-item prop="account">
                    <el-input v-model="form.account" placeholder="请输入账号的邮箱" @keyup.enter.native="submit('form')" maxLength="50">
                        <i slot="prefix" class="el-input__icon el-icon-message"></i>
                    </el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="submit('form')">找回密码</el-button>
        </div>
        <router-link :to="{path:'/login'+(from!=''?'?from='+from:'')}">返回登录</router-link>

    </el-card>
</template>

<script>
export default {
    name: 'forget',

    data() {
        return {
            form:{
                account: '',
            },
            rules:{
                account:[
                    { validator: this.check_account, trigger: 'blur'}
                ]
            },
            from:''
        }
    },

    mounted(){
        this.init();
    },

    methods:{
        init(){
            this.from = this.$route.query.from ? this.$route.query.from : '';
        },
        getCookie (name) {
            var value = '; ' + document.cookie
            var parts = value.split('; ' + name + '=')
            if (parts.length === 2) return parts.pop().split(';').shift()
        },
        check_account(rule, value, callback){
            const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+\.([a-zA-Z0-9_-])+/;
            if (!value) {
                return callback(new Error('请输入邮箱'))
            }
            setTimeout(() => {
                if (mailReg.test(value)) {
                    callback();
                }
                else{
                    callback(new Error('请输入正确的邮箱'));
                }
            }, 30)
        },
        submit:function(formname){
            this.$refs[formname].validate((valid) => {
                if(valid){
                    var that = this;
                    $.ajax({
                        type:'get',
                        url:"/user/forget/send_email?acc="+that.form.account,
                        headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                        processData: false,
                        contentType: false,
                        success:function (res){
                            if(that.console_debug){
                                console.log("(get)/forget/send_email"+ " : " +res.status);
                            }
                            if(res.status == 0){
                                that.alert_box.msg('提示', '验证链接发送成功，请到注册邮箱中点击链接重置密码');
                            }
                            else{
                                switch(res.status){
                                    case 2:
                                        that.alert_msg.error('账号不合法，请检查您输入的信息');
                                        break;
                                    case 3:
                                        that.alert_msg.error('账号不存在');
                                        break;
                                    default:
                                        that.alert_msg.error('请检查您输入的信息并重试')
                                }
                            }
                        },
                        error:function(){
                            that.alert_msg.error('连接失败');
                        }
                    });
                }
                else{
                    return false;
                }
            })

        },
    }

}
</script>

<style scoped>
    h2{
        text-align: center;
        letter-spacing: 2px;
        margin:0;
    }

    .el-card{
        margin:0 auto 0;
        position: relative;
        padding-bottom:20px;
        box-shadow: 0 2px 12px 1px rgba(0, 0, 0, 0.3);
    }

    .el-card>div>div{
        width:250px;
        margin:0 auto;
        line-height: 56px;
    }

    .el-card a{
        display: block;
        width:auto;
        font-size: 13px;
        position: absolute;
        bottom:6px;
        right:10px;
        text-decoration: none;
        color:#333;
        cursor: pointer;
    }

    .el-card a:hover{
        text-decoration: underline;
        color:rgb(88, 99, 120);
    }

    .el-button{
        width:100%;
        height:35px;
        letter-spacing: 3px;
        text-align: center;
        padding:0;
    }

    .box-card {
        width: 360px;
    }

    .iconfont{
        margin-left:5px;
    }

    h2>figure{
        background-image: url("../assets/logo.png");
        height:50px;
        background-image: url("../assets/logo.png");
        background-size: 118px;
        background-position: center;
        background-repeat: no-repeat;
        transition:0.1s linear opacity, 0.3s ease background-size;
    }

    h2>figure:hover{
        background-size: 130px;
    }

    #login{
        margin-right: 40px;
    }
</style>
