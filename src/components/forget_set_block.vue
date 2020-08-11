<template>
    <el-card class="box-card">
        <div>
            <h2><figure></figure></h2>
            <el-form :model="form" :rules="rules" ref="form" label-width="0">
                <el-form-item prop="account">
                    <el-input v-model="form.account" placeholder="请输入帐号" @keyup.enter.native="$refs.pas.focus()" maxLength="50">
                        <i slot="prefix" class="el-input__icon" :class='el-icon-message'></i>
                    </el-input>
                </el-form-item>
                    <el-form-item prop="password">
                    <el-input placeholder="请输入新密码" v-model="form.password" show-password ref="pas" @keyup.enter.native="submit('form')" maxLength="20">
                        <i slot="prefix" class="el-input__icon iconfont icon-lock-fill"></i>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input placeholder="请输入验证密文" v-model="form.key" show-password ref="pas" @keyup.enter.native="submit('form')" maxLength="20">
                        <i slot="prefix" class="el-input__icon iconfont icon-lock-fill"></i>
                    </el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="submit('form')">确认重置密码</el-button>
        </div>
        <a id='login' @click="to_register">注册</a>
        <a @click="to_login">登录</a>
    </el-card>
</template>

<script>
export default {
    data() {
        return {
            form:{
                account: '',
                password: '',
                password_confirm: '',
                key: '',
            },
            rules:{
                account:[
                    // {type:'email',required:true,message:'请输入邮箱',trigger:'blur'},
                    // { pattern:/^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/, message: "请输入合法手机号/电话号", trigger: "blur" }
                    { validator: this.check_account, trigger: 'blur'}
                ],
                password:[
                    {required:true, message:'请输入密码',trigger:'blur'},
                ],
            },
        }
    },

    methods:{
        getCookie (name) {
            var value = '; ' + document.cookie
            var parts = value.split('; ' + name + '=')
            if (parts.length === 2) return parts.pop().split(';').shift()
        },
        to_register(){
            $('#login').slideUp(200);
            let from = this.$route.query.from;
            if(from){
                this.$router.push({path:'/register',query:{from:from}});
            }
            else{
                this.$router.push({path:'/register'});
            }
        },
        to_login(){
            let from = this.$route.query.from;
            if(from){
                this.$router.push({path:'/login',query:{from:from}});
            }
            else{
                this.$router.push({path:'/login'});
            }
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
                    $.ajax({ 
                        type:'post', 
                        url:"/login/submit",
                        data: JSON.stringify(msg),
                        headers: {'X-CSRFToken': this.getCookie('csrftoken')}, 
                        processData: false,
                        contentType: false,
                        success:function (res){ 
                            if(res.status == 0){
                                let from = that.$route.query.from;
                                that.$router.push({path:from?from:'/index'});
                                that.login_manager.set(true);
                            }
                            else{
                                switch(res.status){
                                    case 1:
                                        that.alert_box.msg('登录失败', '这个账号不存在呢');
                                        break;
                                    case 2:
                                        that.alert_box.msg('登录失败', '你的密码不对，你今天已经输错了 '+res.count+' 次密码，输错 5 次的话今天就不能登录了哦');
                                        break;
                                    case 3:
                                        that.alert_box.msg('登录失败', '你今天输错密码次数太多了，明天再来登录吧');
                                        break;
                                    case 4:
                                        that.alert_box.msg('登录失败', '你的账号由于违反规则已被封锁，请联系管理员处理');
                                        break;
                                    default:
                                        that.alert_msg.error('登录出错啦');
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