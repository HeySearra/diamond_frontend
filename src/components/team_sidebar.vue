<template>
  <div class="sidebar_menu">
    <el-row class="team_info">
      <el-col :span="8" class="avatar">
        <el-avatar></el-avatar>
      </el-col>
      <el-col :span="16" class="team_name">DiaDic团队1号</el-col>
    </el-row>
    <el-row class="new_buttons">
      <div class="button_container">
        <el-row>
          <el-button type="info">新建团队</el-button>
        </el-row>
        <!--"管理我的团队"仅仅在用户是团队创建者或管理员的情况下才会出现-->
        <!--el-row>
          <el-button type="info" @click="teamEdit = true">管理我的团队</el-button>
        </el-row-->
        <el-dialog
          :modal-append-to-body='false'
          title="设置团队管理员"
          :visible.sync="teamEdit"
          width="30%">
          <div style="border: solid 2px; height: 100px">
            <div class="member_container">
                <el-avatar></el-avatar>
                <el-avatar></el-avatar>
                <el-avatar></el-avatar>
                <el-avatar></el-avatar>
                <el-avatar></el-avatar>
                <el-avatar></el-avatar>
                <el-avatar></el-avatar>
                <el-avatar></el-avatar>
                <el-avatar></el-avatar>
                <el-avatar></el-avatar>
                <el-avatar></el-avatar>
                <el-avatar></el-avatar>
                <el-avatar></el-avatar>
                <el-avatar></el-avatar>
                <el-avatar></el-avatar>
                <el-avatar></el-avatar>
            </div>
          </div>
          <h3>管理员</h3>
          <div class="admin_list">
            <!--使用v-for-->
            <el-row class="admin">
              <el-col :span="8" class="avatar">
                <el-avatar :size="30"></el-avatar>
              </el-col>
              <el-col :span="16" class="admin_name">
                DiaDic团队x号
              </el-col>
            </el-row>
            <el-row class="admin">
              <el-col :span="8" class="avatar">
                <el-avatar :size="30"></el-avatar>
              </el-col>
              <el-col :span="16" class="admin_name">
                DiaDic团队x号
              </el-col>
            </el-row>
          </div>
          <div style="margin-top: 10px;">
            <!--"管理我的团队"仅仅在用户是团队创建者或管理员的情况下才会出现-->
            <el-row>
              <el-button type="danger">解散团队</el-button>
            </el-row>
            <el-row>
              <el-button type="primary" @click="teamEdit = false">
                确&nbsp;&nbsp;&nbsp;&nbsp;定
              </el-button>
            </el-row>
          </div>
        </el-dialog>
      </div>
    </el-row>
    <!--使用v-for-->
    <el-row class="function_buttons">
      <el-col :span="8" class="avatar">
        <el-avatar :size="30"></el-avatar>
      </el-col>
      <el-col :span="16" class="team_name">
        DiaDic团队x号
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {

  mounted() {
    this.init();
  },

  data() {
    return {
      teamEdit: false
      //data
    }
  },

  methods: {
    init() {
      this.apply_for_info();
    },

    apply_for_info() {
      //向后台请求一些内容
    },

    confirmDisband(done) {
      this.$confirm('确认解散团队？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
  }
}
</script>

<style scoped>
@import url("../assets/common.css");

.sidebar_menu {
  font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, PingFang SC, Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei, sans-serif !important;
  margin-top: 10px;
  width: 18vw;
  height: 100%;
  border: solid 2px;
  overflow: scroll;
}

.team_info {
  border: solid 2px;
  height: 60px;
  display: flex;
  align-items: center;
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
}

.team_name, .admin_name {
  display: flex;
  align-items: center;
}

.new_buttons {
  border: solid 2px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button_container {
  width: 90%;
  border: solid 2px;
}

.function_buttons, .admin{
  border: solid 2px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

}

.member_container{
  margin-top: 5px;
  margin-left: 15px;
  margin-right: 15px;
  height: 90px;
  overflow: scroll;
}

.admin_list {
  max-height: 200px;
  overflow: scroll;
}

.el-button {
  margin-top: 2px;
  margin-bottom: 2px;
  width: 100%;
}

</style>
