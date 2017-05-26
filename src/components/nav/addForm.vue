<template>
  <div>
    <el-button type="primary" @click="onReturnManager" style="float: left;">返回</el-button>
    <br />
    <h3 style="margin-top: 40px; ">{{ pageTitle }}</h3>
    <el-col :span="15" >
      <el-form ref="formServer" :model="formServer" label-width="100px">
        <el-form-item label="请选择" prop="cluster_id" :rules="rules.node_role">
          <el-select v-model="formServer.cluster_id" placeholder="请选择" @change="swarmSelect">
            <el-option
              v-for="item in swarmList"
              :label="item.cluster_name"
              :value="item.cluster_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字段1" prop="cluster_id" :rules="rules.requiredItem">
          <el-input v-model.trim="formServer.cluster_id"></el-input>
        </el-form-item>
        <el-form-item label="切换?">
          <el-switch
            v-model="isNewNetwork"
            on-text="Yes"
            off-text="No"
            @change="isNewNetworkBtn"
          >
          </el-switch>
        </el-form-item>
        <el-form-item v-if="isNewNetwork" label="字段2" prop="network_name" :rules="rules.requiredItem">
          <el-input v-model.trim="formServer.network_name"></el-input>
        </el-form-item>
        <el-form-item v-else label="overlay名称">
          <el-select v-model="formServer.network_name" placeholder="请选择">
            <el-option
              v-for="item in network_name_select"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="isNewNetwork" label="ip字段" prop="subnet" :rules="rules.requiredItem">
          <el-input placeholder="192.168.0.0/16" v-model.trim="formServer.subnet"></el-input>
        </el-form-item>
        
        <el-form-item label="ENV" prop="env">
          <i class="fa fa-plus-circle fa-lg" @click="onAddNodes('addEnv')" style="cursor: pointer"></i>
          <div v-for="(item, key) in formServer.env" v-bind:key="key" style="margin-bottom:10px;">
            <el-input v-model.trim="item.key" style="width: 200px; margin-right: 20px;" placeholder="key"></el-input>
            <el-input v-model.trim="item.value" style="width: 200px;" placeholder="value"></el-input>
            <i class="fa fa-minus-circle fa-lg" @click="onRemoveNode('Env', key)"></i>
          </div>
        </el-form-item>

        <!--<el-form-item v-if="isNewNetwork" label="ip范围">
          <el-input placeholder="192.168.10.0/24" v-model.trim="formServer.iprange"></el-input>
        </el-form-item>-->
        <!--<el-form-item v-if="isNewNetwork" label="网关">
          <el-input placeholder="192.168.1.1" v-model.trim="formServer.gateway"></el-input>
        </el-form-item>-->
        <el-form-item label="端口映射">
          <i class="fa fa-plus-circle fa-lg" @click="onAddNodes('addPortMapping')" style="cursor: pointer"></i>
          <table border="0" class="port-mapping" v-if="formServer.port_mapping[0]">
            <tr>
              <th>主机端口</th>
              <th>容器端口</th>
              <th>协议</th>
            </tr>
            <tr v-for="(item, key) in formServer.port_mapping" v-bind:key="item">
              <td><el-input v-model.number.trim="item.publish_port" style="width:100px;" placeholder="e.g. 8080"></el-input><span>></span></td>
              <td><el-input v-model.number.trim="item.target_port" style="width:100px;" placeholder="e.g. 8080"></el-input><span>/</span></td>
              <td>
                <el-select v-model="item.protocol" style="width:100px;" placeholder="请选择">
                  <el-option label="TCP" value="tcp"></el-option>
                  <el-option label="UDP" value="udp"></el-option>
                </el-select>
                <i class="fa fa-minus-circle fa-lg" @click="onRemoveNode('PortMapping', key)"></i>
              </td>
            </tr>
          </table>
          <span v-if="formServer.port_mapping[0]" style="color: #FF4949; font-weight: bold">注意: 提示语句</span>
        </el-form-item>
        <el-form-item label="计数" prop="replicas" :rules="rules.requiredNumItem">
          <el-input-number v-model.number.trim="formServer.replicas" :min="1" :max="50"></el-input-number>
        </el-form-item>
        <el-form-item label="选择" prop="image" :rules="rules.node_role">
          <el-select v-model="formServer.image" placeholder="请选择" @change="imageChange" style="margin-right: 20px;">
            <el-option
              v-for="item in imageList"
              :label="item.image_name"
              :value="item.image_id">
            </el-option>
          </el-select>
          <span style="margin-right: 10px;">版本</span>
          <el-select v-model="formServer.tag" placeholder="请选择">
            <el-option
              v-for="item in tagList"
              :label="item.tag_name"
              :value="item.tag_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="CMD" :rules="rules.requiredItem">
          <el-input v-model.trim="formServer.command" style="width: 90%"></el-input>
          <el-popover
            ref="popover5"
            placement="top"
            width="600"
            v-model="visible2">
            <p style="font-size: 14px;line-height:22px;">提示性语句</p>
          </el-popover>
          <el-button class="fa fa-question-circle" v-popover:popover5></el-button>
        </el-form-item>
        <el-col :span="24">
          <el-form-item>
            <el-button type="primary" @click="onSubmit('formServer')">创建</el-button>
            <el-button @click="onCancel">取消</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-col>
    <!--创建服务 end-->
    <el-col :span="6">
      <!--<pre>{{ $data }}</pre>-->
    </el-col>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import qs from 'qs'
  export default {
    name: 'Form',
    data () {
      // 服务器名称输入判断,10个以内的中文或20个以内的英文
      let validateName = (rule, value, callback) => {
        let realLength = 0
        let len = value.length
        let charCode = -1
        for (let i = 0; i < len; i++) {
          charCode = value.charCodeAt(i)
          if (charCode >= 0 && charCode <= 128) {
            realLength += 1
          } else {
            // 如果是中文则长度加2
            realLength += 2
          }
        }
        if (value === '') {
          callback(new Error('请输入服务器名称'))
        } else if (realLength > 20) {
          callback(new Error('请输入10个以内的中文字符或20个以内的英文字符'))
        } else {
          callback()
        }
      }

      // ip输入判断规则
      let validateIP = (rule, value, callback) => {
        let re = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
        if (value === '') {
          callback(new Error('请输入服务器ip'))
        } else if (!re.test(value)) {
          console.log(value)
          callback(new Error('服务器ip格式不正确'))
        } else {
          callback()
        }
      }

      // 服务名称输入判断
      let validateServerName = (rule, value, callback) => {
        let that = this
        that.axios.post('/services_name', qs.stringify({
          cluster_id: that.formServer.cluster_id,
          service_name: that.formServer.service_name
        }))
        .then(function (res) {
          console.log('validateServerName', res)
          if (that.formServer.service_name === '') {
            callback(new Error('请输入服务名称'))
          } else if (res.data === 'repeated') {
            console.log(res)
            callback(new Error('服务重名'))
          } else {
            callback()
          }
        })
        .catch(function (err) {
          console.error(err)
        })
      }

      return {
        rules: {
          cluster_name: [
            { required: true, validator: validateName, trigger: 'blur' }
          ],
          IP: [
            { required: true, validator: validateIP, trigger: 'blur' }
          ],
          node_role: [
            { required: true, message: '必选项', trigger: 'change' }
          ],
          server_name: [
            { required: true, validator: validateServerName, trigger: 'blur' }
          ],
          requiredItem: [
            { required: true, message: '必填项', trigger: 'blur' }
          ],
          requiredNumItem: [
            { required: true, message: '必填项' },
            { type: 'number', message: '只能填写数字', trigger: 'blur' }
          ]
        },
        // 创建集群表单
        form: {
          cluster_name: '',
          IP: '',
          node_role: '',
          nodes: [
            {
              node_name: '',
              node_ip: '',
              node_role: ''
            }
          ]
        },
        // 创建服务表单
        swarmList: [],
        serverNameAllow: true,
        formServer: {
          service_name: '',
          cluster_id: '',
          network_name: '',
          env: [],
          subnet: '',
          // iprange: '',
          // gateway: '',
          leader_ip: '',
          port_mapping: [],
          replicas: null,
          image: '',
          tag: '',
          command: ''
        },
        isNewNetwork: false,
        network_name_select: [],
        imageList: [],
        tagList: [],
        visible2: false
      }
    },
    computed: {
      ...mapGetters([
        'getCount',
        'getAddPageType'
      ]),
      ...mapGetters({
        swarmInfo: 'getSwarmInfo'
      }),
      pageTitle () {
        if (this.getAddPageType === 'addSwarmServer') {
          return '新建'
        } else {
          if (this.swarmInfo === null) {
            return '新建2'
          } else {
            return '新建3'
          }
        }
      }
    },
    created () {
      let that = this
      this.axios.get('/cluster_list')
            .then(function (res) {
              console.log(res.data.tableData)
              for (let i of res.data.tableData) {
                that.swarmList.push({cluster_id: i.cluster_id, cluster_name: i.cluster_name})
              }
            })
            .catch(function (err) {
              console.log(err)
            })
      if (this.getAddPageType === 'addSwarmServer') {
        this.axios.get('/image_list')
            .then(function (res) {
              console.log(res.data)
              for (let i of res.data) {
                that.imageList.push({image_name: i, image_id: i})
              }
            })
            .catch(function (err) {
              console.log(err)
            })
      }
    },
    methods: {
      // 添加Node节点
      onAddNodes (type) {
        if (type === 'addNode') {
          this.form.nodes.push({node_name: '', node_ip: '', node_role: ''})
        } else if (type === 'addPortMapping') {
          this.formServer.port_mapping.push({publish_port: null, target_port: null, protocol: 'tcp'})
        } else if (type === 'addEnv') {
          this.formServer.env.push({key: null, value: null})
        }
      },
      onRemoveNode (type, key) {
        if (type === 'node') {
          this.form.nodes.splice(key, 1)
        } else if (type === 'PortMapping') {
          this.formServer.port_mapping.splice(key, 1)
        } else if (type === 'Env') {
          this.formServer.env.splice(key, 1)
        }
      },
      isNewNetworkBtn () {
        this.formServer.network_name = ''
      },
      swarmSelect (value) {
        let that = this
        that.formServer.network_name = ''
        that.serverNameAllow = false
        that.formServer.service_name = ''
        console.log(value)
        that.axios.post('/overlay_list', qs.stringify({
          cluster_id: value
        }))
        .then(function (res) {
          console.log(res)
          that.network_name_select = []
          for (let i of res.data) {
            that.network_name_select.push({value: i, label: i})
          }
        })
        .catch(function (err) {
          console.error(err)
        })
      },
      imageChange (value) {
        console.log(value)
        let that = this
        that.axios.post('/image_tag_list', qs.stringify({
          repo_name: value
        }))
        .then(function (res) {
          console.log(res.data)
          that.tagList = []
          that.tagList.push({tag_name: 'latest', tag_id: ''})
          for (let i of res.data) {
            if (i === 'latest') {
              continue
            } else {
              that.tagList.push({tag_name: i, tag_id: i})
            }
          }
        })
        .catch(function (err) {
          console.error(err)
        })
      },
      onSubmit (formName) {
        let that = this
        console.log(that.form.nodes)
        if (this.getAddPageType === 'addSwarm') {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              that.axios.post('/init_swarm', qs.stringify({
                cluster_name: that.form.cluster_name,
                ip: that.form.nodes[0].node_ip,
                node_role: that.form.nodes[0].node_role
              }))
              .then(function (res) {
                console.log(res)
                if (res.data === 'success') {
                  that.$notify({
                    title: '创建成功',
                    type: 'success'
                  })
                } else {
                  that.$notify({
                    title: '创建失败',
                    message: res.data,
                    type: 'error'
                  })
                }
              })
              .catch(function (err) {
                console.log(err)
              })
            } else {
              console.log('error submit!!')
              return false
            }
          })
        } else if (this.getAddPageType === 'addSwarmNode') {
          console.log('add new nodes')
          this.$refs[formName].validate((valid) => {
            if (valid) {
              that.axios.post('/join_swarm', qs.stringify({
                cluster_id: that.swarmInfo.cluster_id,
                nodes: JSON.stringify(that.form.nodes)
              }))
              .then(function (res) {
                console.log(res)
                let temp = ''
                for (let i of res.data) {
                  if (i.response === 'failed') {
                    temp = temp + i.ip + '  '
                  }
                }
                if (temp === '') {
                  that.$notify({
                    title: '成功',
                    type: 'success'
                  })
                } else {
                  that.$notify({
                    title: '失败',
                    message: temp + '添加失败',
                    type: 'error'
                  })
                }
              })
              .catch(function (err) {
                console.log(err)
              })
            } else {
              console.log('error submit!!')
              return false
            }
          })
        } else {
          console.log('add new server')
          this.$refs[formName].validate((valid) => {
            if (valid) {
              that.axios.post('/create_service', qs.stringify({
                service_name: that.formServer.service_name,
                cluster_id: that.formServer.cluster_id,
                network_name: that.formServer.network_name,
                subnet: that.formServer.subnet,
                // iprange: that.formServer.iprange,
                // gateway: that.formServer.gateway,
                env: JSON.stringify(that.formServer.env),
                port_mapping: JSON.stringify(that.formServer.port_mapping),
                // leader_ip: that.formServer.leader_ip,
                // publish_port: that.formServer.publish_port,
                // target_port: that.formServer.target_port,
                replicas: that.formServer.replicas,
                image: that.formServer.image,
                tag: that.formServer.tag,
                command: that.formServer.command
              }))
              .then(function (res) {
                console.log(res)
                if (res.data === 'success') {
                  that.$notify({
                    title: '成功',
                    type: 'success'
                  })
                } else {
                  that.$notify({
                    title: '失败',
                    message: res.data,
                    type: 'error'
                  })
                }
              })
              .catch(function (err) {
                console.log(err)
              })
            }
          })
        }
      },
      onReturnManager () {
        this.$router.go(-1)
      },
      onCancel () {
        this.$router.go(-1)
      }
    }
  }
</script>

<style scoped>
.fade-addPage-enter-active {
  transition: all 1s
}
.fade-addPage-leave-active {
  transition: all .3s
}
.fade-addPage-enter, .fade-addPage-leave-active {
  opacity: 0
}
.fade-addPage-move {
  transform: transform .5s
}
.port-mapping .el-input{
  width: 200px;
}
.port-mapping th {
  text-align: left;
}
.port-mapping span {
  margin: 0 20px;
}
.port-mapping i {
  cursor: pointer;
}
.fa-minus-circle{
  margin-left: 20px;
  color: #FF4949;
}
.fa-plus-circle {
  color: #13CE66;
}
</style>
