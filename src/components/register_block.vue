<template>
    <el-card class="box-card">
        <div>
            <h2><figure></figure></h2>
            <el-form :model="form" :rules="rules" ref="form" label-width="0">
                <el-form-item prop="name">
                    <el-input v-model="form.name" placeholder="请输入昵称" @keyup.enter.native="$refs.account.focus()" maxLength="20">
                        <i slot="prefix" class="el-input__icon el-icon-edit"></i>
                    </el-input>
                </el-form-item>
                <el-form-item prop="account">
                    <el-input v-model="form.account" placeholder="请输入邮箱" ref="account" @keyup.enter.native="$refs.pas.focus()" maxLength="50">
                        <i slot="prefix" class="el-input__icon el-icon-message"></i>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input placeholder="请输入密码" v-model="form.password" show-password ref="pas" @keyup.enter.native="submit('form')" maxLength="20">
                        <i slot="prefix" class="el-input__icon iconfont icon-lock-fill"></i>
                    </el-input>
                </el-form-item>
                <el-form-item prop="ver_code">
                    <el-input v-model="form.ver_code" placeholder="请输入验证码" ref="ver_code" maxLength="6" style="width:56%">
                        <i slot="prefix" class="el-input__icon el-icon-magic-stick"></i>
                    </el-input>
                    <el-button :disabled="ver_code_disabled" style="width:40%; height:40px; float:right; letter-spacing:0; padding:0; text-indent:0; text-align:center" @click="get_ver_code">{{ver_code_disabled ? '重发 ('+ rest_time + ' s)' : '获取验证码'}}</el-button>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="submit('form')">注册</el-button>
        </div>
        <router-link :to="{path:'/login', query:from}">已有账号？立即登录</router-link>
    </el-card>
</template>

<script>
export default {
    data() {
        return {
            form:{
                name: '',
                account: '',
                password: '',
                ver_code:''
            },
            rules:{
                name:[
                    {required:true, message:'请输入昵称', trigger:'blur'},
                    {min:1,max:16,message:'长度在 1 到 16 个字符',trigger:'blur'}
                ],
                password:[
                    {required:true,message:'请输入密码',trigger:'blur'},
                    {min:6,max:16,message:'长度在 6 到 16 个字符',trigger:'blur'}
                ],
                account:[
                    { validator: this.check_account, trigger: 'blur'}
                ],
                ver_code:[
                    {required:true, message:'请输入验证码', trigger:'blur'},
                    {min:6,max:6,message:'请输入 6 位验证码',trigger:'blur'}
                ]
            },
            from:'',
            ver_code_disabled: false,
            rest_time:0,
            rest_timer:undefined
        }
    },

    mounted(){

        //this.init();
    },

    methods:{
        init(){
            this.from = this.$route.query.from ? this.$route.query.from : '';
            if(localStorage.getItem('res_time')){
                this.rest_time = ((new Date(new Date(localStorage.getItem('res_time'))).getTime() + 60000) - new Date()) / 1000;
                if(this.rest_time > 1){
                    this.rest_time = parseInt(this.rest_time);
                    this.ver_code_disabled = true;
                    var that = this;
                    this.rest_timer = setInterval(function(){
                        that.rest_time--;
                        if(that.rest_time == 0){
                            that.ver_code_disabled = false;
                            that.rest_timer ? clearInterval(that.rest_timer) : '';
                            localStorage.removeItem('res_time');
                        }
                    }, 1000);
                }
            }
        },
        getCookie (name) {
            var value = '; ' + document.cookie
            var parts = value.split('; ' + name + '=')
            if (parts.length === 2) return parts.pop().split(';').shift()
        },
        submit:function(formname){
            var that = this;
            this.$refs[formname].validate((valid) => {
                if(valid){
                    let msg = {
                        acc: this.form.account,
                        ver_code: this.form.ver_code,
                        pwd: this.form.password,
                        name: this.form.name,
                    };
                    $.ajax({
                        type:'post',
                        url:"/user/register/submit",
                        data: JSON.stringify(msg),
                        headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                        processData: false,
                        contentType: false,
                        success:function (res){
                            if(that.console_debug){
                                console.log("(post)/register/submit"+ " : " +res.status);
                            }
                            if(res.status == 0){
                                function _ok(that){
                                    var from = that.$route.query.from;
                                    that.$router.push({path:from?from:'/workbench/recent'});
                                }
                                that.alert_box.msg('提示', '注册成功', _ok(that));
                            }
                            else{
                                switch(res.status){
                                    case 4:
                                        that.alert_box.msg('注册失败', '验证码错误');
                                        break;
                                    case 2:
                                        that.alert_box.msg('注册失败', '邮箱不合法');
                                        break;
                                    case 3:
                                        that.alert_box.msg('注册失败', '密码长度应为6-32个字符，必须包含数字、小写字母、大写字母、特殊字符中至少两种');
                                        break;
                                    case 5:
                                        that.alert_box.msg('注册失败', '昵称不合法，昵称不能超过32个字符');
                                        break;
                                    case 6:
                                        that.alert_box.msg('注册失败', '该账户已存在');
                                        break;
                                    case 7:
                                        that.alert_box.msg('注册失败', '验证码已过期');
                                    default:
                                        that.alert_box.msg('注册失败', '请检查你所填写的信息');
                                        break;
                                }
                                //that.alert_msg.normal('error:'+res.status);
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
        check_account(rule, value, callback){
            const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
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
        get_ver_code(){
            var that = this;
            let msg = {acc :that.form.account,}
            $.ajax({
                type:'get',
                url:"/user/register/submit?acc=" + msg.acc,
                data: JSON.stringify(msg),
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                processData: false,
                contentType: false,
                success:function (res){
                    if(that.console_debug)console.log("(post)/register/submit"+ " : " +res.status);
                    if(res.status == 0){
                        that.alert_box.msg('提示', '验证码发送成功');
                        that.ver_code_disabled = true;
                        that.rest_time = 60;
                        that.rest_timer = setInterval(function(){
                            that.rest_time--;
                            if(that.rest_time == 0){
                                that.ver_code_disabled = false;
                                that.rest_timer ? clearInterval(that.rest_timer) : '';
                                localStorage.removeItem('res_time');
                            }
                        }, 1000);
                        localStorage.setItem('res_time', new Date());
                    }
                    else{
                        that.alert_box.msg('验证码发送失败，请重试');
                    }
                },
                error:function(){
                    that.alert_msg.error('连接失败');
                }
            });
        }
    },
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
        letter-spacing: 2em;
        text-indent: 2em;
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
        background-size: 118px;
        background-position: center;
        background-repeat: no-repeat;
        transition:0.1s linear opacity, 0.3s ease background-size;
    }

    h2>figure:hover{
        background-size: 130px;
    }
</style>
