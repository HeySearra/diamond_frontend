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
                account:[
                     {type:'email',required:true,message:'请输入邮箱',trigger:'blur'},
                    // { pattern:/^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/, message: "请输入合法手机号/电话号", trigger: "blur" }
                    { validator: this.check_account, trigger: 'blur'}
                ]
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
                    var msg = {
                        acc: this.form.account,
                        pwd: this.form.password,
                        key: this.form.key,
                    }
                    $.ajax({
                        type:'post',
                        url:"/user/forget/set_pwd",
                        data: JSON.stringify(msg),
                        headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                        async:false, 
                        success:function (res){
                            if(that.console_debug)console.log("(post)/forget/set_pwd"+ " : " +res.status);
                            if(res.status == 0){
                                function _ok(that){
                                    var from = that.$route.query.from;
                                    that.$router.push({name:'login'});
                                }
                                that.alert_box.msg('提示', '密码已重置', _ok(that));
                                that.login_manager.set(true, that.form.account, that.form.name, '');
                            }
                            else{
                                switch(res.status){
                                    case 4:
                                        that.alert_box.msg('重置失败', '密文不正确');
                                        break;
                                    case 2:
                                        that.alert_box.msg('注册失败', '账号不存在');
                                        break;
                                    case 3:
                                        that.alert_box.msg('注册失败', '密码长度应为6-32个字符，必须包含数字、小写字母、大写字母、特殊字符中至少两种');
                                        break;
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
