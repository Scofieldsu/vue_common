<template>
  <el-col :span="24" class="login-layout">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm login-form">
      <h3 class="title">登录系统</h3>
      <el-form-item label="" prop="name">
        <el-input v-model="ruleForm.name" class="login-input" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item label="" prop="password">
        <el-input v-model="ruleForm.password" class="login-input" placeholder="密码" type="password"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-checkbox label="" v-model="rememberPWD" name="rememberPWD" class="remember-pwd">记住密码</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')" class="login-btn">登录</el-button>
        <el-button @click="resetForm('ruleForm')" class="signin-btn">注册</el-button>
      </el-form-item>
    </el-form>
    <!--<pre>{{ $data }}</pre>-->
  </el-col>
</template>
<script>
  import commonJs from '../../../util/common'
  import qs from 'qs'
  import md5 from 'md5'
  export default {
    data () {
      return {
        rememberPWD: true,
        ruleForm: {
          name: '',
          password: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请填写密码', trigger: 'blur' }
          ]
        },
        token: ''
      }
    },
    methods: {
      submitForm (formName) {
        let cookieMaker = commonJs.cookieMaker
        let that = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // that.$router.push('/')
            console.log('login submit!')
            window.localStorage.setItem('ms_username', that.ruleForm.name)
            that.axios.post('/login', qs.stringify({
              name: that.ruleForm.name,
              password: md5(that.ruleForm.password)
            }))
            .then((res) => {
              console.log(res)
              if (res.data === 'success') {
                if (that.rememberPWD) {
                  cookieMaker.save('name', that.ruleForm.name, 30)
                  cookieMaker.save('password', md5(that.ruleForm.password), 30)
                  // cookieMaker.save('token', res.data.token, 7)
                }
                that.$router.push('/')
              } else {
                that.$notify({
                  title: '登录失败',
                  type: 'error',
                  duration: 2000
                })
              }
              if (res.data.SignIn === 'true') {
                window.sessionStorage['name'] = that.ruleForm.name
                window.sessionStorage['password'] = that.ruleForm.password
              }
            })
              .catch((err) => {
                console.error(err)
                that.$notify({
                  title: '登录失败',
                  type: 'error',
                  duration: 2000
                })
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
        this.$router.replace('/SignUp')
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
