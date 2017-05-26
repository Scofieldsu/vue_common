<template>
  <section>
    <h3>子菜单2</h3>
    <el-col :span="24" class="toolbar">
      <el-col :span="12">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item>
            <span>请选择:</span>
            <el-select v-model="cluster_id" placeholder="请选择" @change="swarmSelect">
              <el-option
                v-for="item in swarmList"
                :label="item.cluster_name"
                :value="item.cluster_id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <el-button type="primary" @click="onAdd" style="float: right;margin-right: 20px;">创建</el-button>
      </el-col>
    </el-col>
    <el-table v-loading="listLoading" :data="tableData" border style="width: 100%;">
      <el-table-column prop="server_name_id"     label="名称/ID" width="150" fixed="left" show-overflow-tooltip>
        <template scope="props">
          <span style="font-size: 16px;">{{ props.row.service_name }}</span><br />
          <el-popover trigger="hover" placement="right">
            ID: {{ props.row.service_id }}
            <div slot="reference" class="name-wrapper">
              <div style="width: 100px;color: #aaa; overflow: hidden; text-overflow: ellipsis;white-space:nowrap;">{{ props.row.cluster_id }}</div>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="service_vip"         label="列1"></el-table-column>
      <el-table-column prop="image"               label="列2"></el-table-column>
      <el-table-column prop="overlay_nerwork"     label="列3"></el-table-column>
      <el-table-column prop="replicates"          label="列4"></el-table-column>
      <el-table-column label="列5" align="center">
        <el-table-column prop="ports"     label="列5-1"  width="100">
          <template scope="props">
            <span v-for="item in props.row.port" style="font-size: 16px;">{{ item.publish_port }}<br /></span>
          </template>
        </el-table-column>
        <el-table-column prop="ports"     label="列5-2" width="100">
          <template scope="props">
            <span v-for="item in props.row.port" style="font-size: 16px;">{{ item.target_port }}<br /></span>
          </template>
        </el-table-column>
        <el-table-column prop="ports"     label="列5-3" width="100">
          <template scope="props">
            <span v-for="item in props.row.port" style="font-size: 16px;">{{ item.protocol }}<br /></span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="status"      label="状态" width="80" align="center">
        <template scope="props">
          <el-popover trigger="hover" placement="top">
            <span style="font-size: 14px;">updata_message: {{ props.row.update_message }}</span>
            <div slot="reference" class="name-wrapper">
              <i v-if="props.row.status === 'Green' || props.row.status === 'completed'" class="fa fa-play-circle fa-lg" style="color:#13CE66"></i>
              <i v-else-if="props.row.status === 'Yellow'" class="fa fa-exclamation-circle  fa-lg" style="color:#F7BA2A"></i>
              <i v-else-if="props.row.status === 'paused'" class="fa fa-stop-circle fa-lg" style="color:#FF4949"></i>
            </div>
          </el-popover>

        </template>
      </el-table-column>
      <el-table-column inline-template :context="_self" label="操作"  width="120" align="center">
        <span>
          <el-dropdown trigger='click' menu-align='start' @command="handleCommand">
            <el-button type="primary" @click="handleManagerBtn($index,row)">
              管理<i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="update">更新</el-dropdown-item>
              <!--<el-dropdown-item command="addNode">修改</el-dropdown-item>-->
              <el-dropdown-item command="removeTheServer">删除该</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </el-table-column>

    </el-table>
    <el-col :span="24" class="toolbar" style="margin-top: 20px;padding-bottom:10px;">
			<el-pagination  :current-page="pageOption.CurrentPage"
                      :page-sizes="[10, 20, 30, 40]"
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :page-size="pageOption.PageSize" layout="total, sizes, prev, pager, next, jumper"
				              :total="totalList"
                      style="float:right"></el-pagination>
		</el-col>

    <!--点击下拉框弹出的对话框-->
    <el-dialog size="small" top="10%" :title="dialogFormTitle" v-model="dialogFormVisible" @close="dialogClose">
      <el-form :model="form" v-loading="loading" class="elform" ref="ruleForm" :label-width="formLabelWidth">
        <el-form-item label="名称:">
          <el-tag type="primary">{{ form.cluster_name }}</el-tag>
        </el-form-item>
        <!--<el-form-item label="ID:">
          <el-tag type="primary">{{ form.cluster_id }}</el-tag>
        </el-form-item>-->
        <el-form-item label="名称:">
          <el-tag type="primary">{{ form.service_name }}</el-tag>
        </el-form-item>
        <!--<el-form-item label="ID:">
          <el-tag type="primary">{{ form.service_id }}</el-tag>
        </el-form-item>-->

        <el-form-item label="ENV:" prop="env"  v-if="command === 'update'">
          <i class="fa fa-plus-circle fa-lg" @click="onAddNodes('addEnv')" style="cursor: pointer"></i>
          <div v-for="(item, key) in form.env" v-bind:key="key" style="margin-bottom:10px;">
            <el-input v-model.trim="item.key" style="width: 40%; margin-right: 20px;" placeholder="key"></el-input>
            <el-input v-model.trim="item.value" style="width: 40%;" placeholder="value"></el-input>
            <i class="fa fa-minus-circle fa-lg" @click="onRemoveNode('Env', key)"></i>
          </div>
        </el-form-item>
        <el-form-item label="列5" v-if="command === 'update'">
          <i class="fa fa-plus-circle fa-lg" @click="onAddNodes('addPortMapping')" style="cursor: pointer"></i>
          <table border="0" class="port-mapping" v-if="form.ports.Ports">
            <tr>
              <th>列5-1</th>
              <th>列5-2</th>
              <th>列5-3</th>
            </tr>
            <tr v-for="(item, key) in form.ports.Ports" v-bind:key="item">
              <td><el-input v-model.number.trim="item.PublishedPort" style="width:100px;" placeholder="e.g. 8080"></el-input><span>></span></td>
              <td><el-input v-model.number.trim="item.TargetPort" style="width:100px;" placeholder="e.g. 8080"></el-input><span>/</span></td>
              <td>
                <el-select v-model="item.Protocol" style="width:100px;" placeholder="请选择">
                  <el-option label="TCP" value="tcp"></el-option>
                  <el-option label="UDP" value="udp"></el-option>
                </el-select>
                <i class="fa fa-minus-circle fa-lg" @click="onRemoveNode('PortMapping', key)"></i>
              </td>
            </tr>
          </table>
          <span v-if="form.ports.Ports" style="color: #FF4949; font-weight: bold">提示语句</span>
        </el-form-item>
        <el-form-item label="并行更新数:" v-if="command === 'update'">
            <el-input-number v-model.number.trim="form.parallelism" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="任务数:" v-if="command === 'update'">
            <el-input-number v-model="form.replicates" :min="1" :max="50"></el-input-number>
        </el-form-item>
        <el-form-item label="更新延迟:" v-if="command === 'update'">
            <el-input v-model.number.trim="form.delay.hour" style="width:50px;"></el-input>
            <span>小时</span>
            <el-input v-model.number.trim="form.delay.minute" style="margin-left:10px;width:50px;"></el-input>
            <span>分钟</span>
            <el-input v-model.number.trim="form.delay.second" style="margin-left:10px;width:50px;"></el-input>
            <span>秒</span>
        </el-form-item>
        <el-form-item label="镜像" v-if="command === 'update'">
          <el-tag type="primary">{{ form.image }}</el-tag>
          <span style="margin-right: 10px;">版本</span>
          <el-select v-model="form.tag" placeholder="请选择">
            <el-option
              v-for="item in form.tagList"
              :label="item.tag_name"
              :value="item.tag_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="CMD" v-if="command === 'update'">
          <el-input v-model.trim="form.command" style="width: 90%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
  import { mapActions } from 'vuex'
  import qs from 'qs'
  export default {
    name: 'ServerManager',
    data () {
      return {
        formInline: {
          name: '',
          region: ''
        },
        loading: false,
        tableData: [],
        totalList: 0,
        listLoading: false,
        initLoading: false,
        swarmList: [{cluster_id: '', cluster_name: '未选择'}],
        cluster_id: '',
        dialogFormVisible: false,
        dialogFormTitle: '',
        formLabelWidth: '100px',
        command: '',
        form: {
          id: 0,
          cluster_name: '',
          cluster_id: '',
          service_name: '',
          service_id: '',
          replicates: 0,
          env: [],
          ports: {},
          image: '',
          tag: '',
          tagList: [],
          parallelism: 0,
          delay: {
            hour: 0,
            minute: 0,
            second: 0
          },
          command: ''
        },
        pageOption: {
          CurrentPage: 1,
          PageSize: 10
        }
      }
    },
    created () {
      let that = this
      console.log(this)
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

      this.axios.get('/services_list', {
        params: {
          cluster_id: '',
          current_page: that.pageOption.CurrentPage,
          page_size: that.pageOption.PageSize
        }
      })
        .then(function (res) {
          that.tableData = res.data.tableData
          that.totalList = res.data.total_page
        })
        .catch(function (err) {
          console.log(err)
        })
    },
    methods: {
      ...mapActions([
        'increment',
        'decrement',
        'addPageType'
      ]),

      // 初始化列表
      createdTable (that, title) {
        that.axios.get('/services_list', {
          params: {
            cluster_id: that.cluster_id,
            current_page: that.pageOption.CurrentPage,
            page_size: that.pageOption.PageSize
          }
        })
        .then(function (res) {
          that.tableData = res.data.tableData
          that.totalList = res.data.total_page
          if (title) {
            that.$notify({
              title: title,
              type: 'success',
              duration: 2000
            })
          }
        })
        .catch(function (err) {
          console.log(err)
        })
      },
      // 下拉框点击
      handleCommand (command) {
        console.log(command)
        this.command = command
        let that = this
        if (command === 'addNode') {
          this.dialogFormTitle = '修改任务数'
          this.dialogFormVisible = true
        } else if (command === 'removeTheServer') {
          this.$confirm('此操作将删除:' + this.form.service_name + ', 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.axios.post('/delete_service', qs.stringify({
              service_name: that.form.service_name,
              service_id: that.form.service_id,
              cluster_id: that.form.cluster_id
            }))
            .then(function (res) {
              if (res.data === 'success') {
                that.createdTable(that, '删除成功')
              } else {
                that.$notify.error({
                  title: '删除失败',
                  message: res.data,
                  duration: 4000
                })
              }
            })
            .catch(function (err) {
              console.error(err)
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        } else if (command === 'update') {
          this.dialogFormTitle = '更新'
          this.dialogFormVisible = true
          this.loading = true
          let that = this
          this.axios.post('/update_service', qs.stringify({
            service_id: that.form.service_id,
            cluster_id: that.form.cluster_id
          }))
          .then(function (res) {
            that.form.tagList = []
            that.form.env = res.data.env
            that.form.ports = res.data.ports
            that.form.image = res.data.image
            that.form.tag = res.data.tag
            for (let i of res.data.tags) {
              that.form.tagList.push({tag_name: i, tag_id: i})
            }
            // that.form.command = res.data.command.join(' ')
            if (res.data.command instanceof Array) {
              // that.form.command = '[' + res.data.command.join(' ') + ']'
              that.form.command = '['
              for (let i of res.data.command) {
                that.form.command += '"' + i + '",'
              }
              that.form.command = that.form.command.substr(0, that.form.command.length - 1) + ']'
            } else {
              that.form.command = res.data.command
            }
            console.log(res)
            that.loading = false
          })
          .catch(function (err) {
            console.error(err)
          })
        }
      },

      // 添加env节点
      onAddNodes (type) {
        if (type === 'addEnv') {
          this.form.env.push({key: null, value: null})
        } else if (type === 'addPortMapping') {
          this.form.ports.Ports.push({PublishedPort: null, TargetPort: null, Protocol: 'tcp'})
        }
      },
      onRemoveNode (type, key) {
        if (type === 'Env') {
          this.$confirm('删除该配置可能造成无法使用, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.form.env.splice(key, 1)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        } else if (type === 'PortMapping') {
          this.form.ports.Ports.splice(key, 1)
        }
      },

      // 点击管理按钮
      handleManagerBtn (index, row) {
        console.log(row)
        this.form.cluster_name = row.cluster_name
        this.form.cluster_id = row.cluster_id
        this.form.service_name = row.service_name
        this.form.service_id = row.service_id
        this.form.replicates = row.replicates
      },

      // 点击分页的触发方法
      handleSizeChange (val) {
        this.pageOption.PageSize = val
        console.log(`每页 ${val} 条`)
        this.createdTable(this)
      },

      handleCurrentChange (val) {
        this.pageOption.CurrentPage = val
        console.log(`当前页: ${val}`)
        this.createdTable(this)
      },

      // 点击添加按钮初始化表单
      onAdd () {
        this.addPageType({
          addPageType: 'addSwarmServer'
        })
        this.$router.push('/node/addForm')
      },

      // 对话框关闭后回调
      dialogClose () {
        this.form.id = 0
        this.form.cluster_name = ''
        this.form.cluster_id = ''
        this.form.server_name = ''
        this.form.service_id = ''
        this.form.replicates = 0
        this.form.env = []
        this.form.image = ''
        this.form.tag = ''
        this.form.tag = ''
        this.form.tagList = []
        this.form.parallelism = 0
        this.form.delay = {
          hour: 0,
          minute: 0,
          second: 0
        }
      },
      swarmSelect (value) {
        let that = this
        that.cluster_id = value
        this.axios.get('/services_list', {
          params: {
            cluster_id: that.cluster_id,
            current_page: that.pageOption.CurrentPage,
            page_size: that.pageOption.PageSize
          }
        })
            .then(function (res) {
              that.tableData = res.data.tableData
              that.totalList = res.data.total_page
            })
            .catch(function (err) {
              console.log(err)
            })
      },
      // 弹出表单点击确定后执行的方法
      editSubmit () {
        let that = this
        console.log('port', that.form.server_port)
        if (this.command === 'addNode') {
          this.axios.post('/update_replicates', qs.stringify({
            service_name: that.form.service_name,
            service_id: that.form.service_id,
            cluster_id: that.form.cluster_id,
            replicates: that.form.replicates
          }))
          .then(function (res) {
            if (res.data === 'Existed Configuration!') {
              that.$notify.error({
                title: '添加失败',
                message: '配置错误',
                duration: 4000
              })
            } else if (res.data === 'success') {
              that.createdTable(that, '添加成功')
              that.dialogFormVisible = false
            }
          })
          .catch(function (err) {
            console.error(err)
          })
        } else if (this.command === 'update') {
          that.form.delay.hour = that.form.delay.hour ? that.form.delay.hour : 0
          that.form.delay.minute = that.form.delay.minute ? that.form.delay.minute : 0
          that.form.delay.second = that.form.delay.second || 0
          this.axios.post('/update_service_assure', qs.stringify({
            service_id: that.form.service_id,
            cluster_id: that.form.cluster_id,
            image: that.form.image,
            tag: that.form.tag,
            env: JSON.stringify(that.form.env),
            ports: JSON.stringify(that.form.ports),
            replicates: that.form.replicates,
            delay: parseInt(that.form.delay.hour) * 3600 + parseInt(that.form.delay.minute) * 60 + parseInt(that.form.delay.second),
            parallelism: that.form.parallelism,
            command: that.form.command
          }))
          .then(function (res) {
            if (res.data === 'success') {
              that.createdTable(that, '更新成功')
              that.dialogFormVisible = false
            } else {
              that.$notify.error({
                title: '更新失败',
                message: '配置错误',
                duration: 4000
              })
            }
          })
          .catch(function (err) {
            console.error(err)
          })
        }
      }
    }
  }
</script>

<style scoped>
 h3 {
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
 }
 .elform {
   margin: 0 50px 0 20px;
 }

 .fa-minus-circle{
  margin-left: 20px;
  color: #FF4949;
}
.fa-plus-circle {
  color: #13CE66;
}

</style>
