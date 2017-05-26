<template>
  <el-col :span="24" class="login-layout">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm login-form">
      <h3 class="title">注 册</h3>
      <el-form-item label="" prop="name">
        <el-input v-model="ruleForm.name" class="login-input" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item label="" prop="password">
        <el-input v-model="ruleForm.password" class="login-input" type="password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item label="" prop="passwordComfirm">
        <el-input v-model="ruleForm.passwordComfirm" class="login-input" type="password" placeholder="确认密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')" class="signin-btn">注册</el-button>
        <el-button @click="resetForm('ruleForm')" class="login-btn">返回登录</el-button>
      </el-form-item>
    </el-form>
  </el-col>
</template>
<script>
  import qs from 'qs'
  import md5 from 'md5'
  export default {
    data () {
      var validatePassComfirm = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }
      return {
        ruleForm: {
          name: '',
          password: '',
          passwordComfirm: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请填写密码', trigger: 'blur' }
          ],
          passwordComfirm: [
            {required: true, validator: validatePassComfirm, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      resetForm (formName) {
        console.log('submit!')
        this.$router.replace('/Login')
      },
      submitForm (formName) {
        var that = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(that)
            that.axios.post('/signup', qs.stringify({
              name: that.ruleForm.name,
              password: md5(that.ruleForm.password)
            }))
            .then((res) => {
              console.log(res)
              if (res.data === 'repeatUsername') {
                that.$notify({
                  title: '注册失败,重名了',
                  type: 'error',
                  duration: 2000
                })
              } else if (res.data.username) {
                that.$notify({
                  title: '注册成功',
                  type: 'success',
                  duration: 2000
                })
              }
            })
            .catch((err) => {
              console.error(err)
              that.$notify({
                title: '注册失败',
                type: 'error',
                duration: 2000
              })
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>
<style scoped>
  h3 {
    margin: 0;
    padding: 0;
  }
  .login-form {
    position: relative;
    top: 40%;
    height: 320px;
    width: 400px;
    background: #EFF0F4;
    padding: 30px;
    margin: -160px auto 0;
  }
  .title {
    color: #1F2D3D;
    text-align: center;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    margin-bottom: 20px;
  }
  .login-layout {
    position: absolute;
    background: #1F2D3D;
    height: 100%;
  }
  .login-input {
    width: 100%;
  }
  .remember-pwd{
    padding-bottom: 20px;
  }
  .login-btn, .signin-btn {
    width: 100%;
    margin: 0 0 10px 0;
  }
</style>