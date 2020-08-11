<template>
    <el-card class="box-card">
        <div>
            <h2><figure></figure></h2>
            <el-form :model="form" :rules="rules" ref="form" label-width="0">
                <el-form-item prop="account">
                    <el-input v-model="form.account" disabled placeholder="请输入账号的邮箱" @keyup.enter.native="$refs.pas.focus()" maxLength="50">
                        <i slot="prefix" class="el-input__icon el-icon-message"></i>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input placeholder="请输入新密码" v-model="form.password" show-password ref="pas" @keyup.enter.native="submit('form')" maxLength="20">
                        <i slot="prefix" class="el-input__icon iconfont icon-lock-fill"></i>
                    </el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="submit('form')">重置密码</el-button>
        </div>
    </el-card>
</template>

<script>
export default {
    data() {
        return {
            form:{
                account:'',
                password: '',
                key:''
            },
            rules:{
                password:[
                    {required:true, message:'请输入密码',trigger:'blur'},
                ],
            },
        }
    },

    mounted(){
        this.init();
    },

    methods:{
        init(){
            this.form.account = this.$route.query.acc ? this.$route.query.acc : this.error();
            this.form.key = this.$route.query.key ? this.$route.query.key : this.error();
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
                    var msg = this.form;
                    
                }
                else{
                    return false;
                }
            })
            
        },
        error(){
            var that = this;
            this.alert_box.msg('错误', '信息加载错误', function(){
                that.$router.push({path:'/'});
            });
        }
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
        cursor: pointer;
    }

    .el-card a:hover{
        text-decoration: underline;
        color:hsl(1, 69%, 69%);
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