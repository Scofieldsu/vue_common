<template>
  <section>
    <h3>子菜单1</h3>
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
    </el-col>
    <el-table v-loading="listLoading" :data="tableData" border style="width: 100%;">
      <el-table-column prop="server_name_id"     label="名称/ID" width="150" fixed="left" show-overflow-tooltip>
        <template scope="props">
          <span style="font-size: 16px;">{{ props.row.node_name }}</span><br />
          <el-popover trigger="hover" placement="right">
            ID: {{ props.row.node_id }}
            <div slot="reference" class="name-wrapper">
              <div style="width: 100px;color: #aaa; overflow: hidden; text-overflow: ellipsis;white-space:nowrap;">{{ props.row.cluster_id }}</div>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="node_ip"             label="列1"></el-table-column>
      <el-table-column prop="node_role"           label="列2"></el-table-column>
      <!--<el-table-column prop="node_vip"            label="列3"></el-table-column>-->
      <el-table-column prop="docker_version"      label="列4"></el-table-column>
      <el-table-column prop="node_if_leader"      label="列5"></el-table-column>
      <el-table-column inline-template :context="_self" label="操作"  width="120" align="center">
        <span>
          <el-dropdown trigger='click' menu-align='start' @command="handleCommand">
            <el-button type="primary" @click="handleManagerBtn($index,row)">
              管理<i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="leaveSwarm">离开</el-dropdown-item>
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
    <el-dialog size="tiny" top="10%" :title="dialogFormTitle" v-model="dialogFormVisible" @close="dialogClose">
      <el-form :model="form" class="elform" ref="ruleForm" :label-width="formLabelWidth">
        <el-form-item label="ID:">
          <el-tag type="primary">{{ form.cluster_id }}</el-tag>
        </el-form-item>
        <el-form-item label="名称:">
          <el-tag type="primary">{{ form.cluster_name }}</el-tag>
        </el-form-item>
        <el-form-item label="名称:">
          <el-tag type="primary">{{ form.service_name }}</el-tag>
        </el-form-item>
        <el-form-item label="ID:">
          <el-tag type="primary">{{ form.service_id }}</el-tag>
        </el-form-item>
        <el-form-item label="任务数:">
            <el-input-number v-model="form.replicates" :min="1"></el-input-number>
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
        tableData: [],
        totalList: 0,
        listLoading: false,
        initLoading: false,
        swarmList: [{cluster_id: '', cluster_name: '未选择'}],
        cluster_id: '',
        dialogFormVisible: false,
        dialogFormTitle: '',
        formLabelWidth: '100px',
        form: {
          id: 0,
          cluster_name: '',
          cluster_id: '',
          service_name: '',
          service_id: '',
          node_role: '',
          node_id: '',
          node_ip: '',
          replicates: 0,
          delete_force: ''
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

      this.axios.get('/node_list', {
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
        that.listLoading = true
        that.axios.get('/node_list', {
          params: {
            cluster_id: that.cluster_id,
            current_page: that.pageOption.CurrentPage,
            page_size: that.pageOption.PageSize
          }
        })
        .then(function (res) {
          that.listLoading = false
          console.log('then')
          let temp = []
          for (let i of res.data.tableData) {
            i.initLoading = false
            temp.push(i)
          }
          that.tableData = temp
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
          that.listLoading = false
          console.log(err)
        })
      },
      // 下拉框点击
      handleCommand (command) {
        console.log(command)
        let that = this
        if (command === 'addNode') {
          this.dialogFormVisible = true
        } else if (command === 'leaveSwarm') {
          this.$confirm('是否离开', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            that.form.delete_force = 'yes'
            this.axios.post('/leave_swarm', qs.stringify({
              cluster_id: that.form.cluster_id,
              node_id: that.form.node_id,
              node_ip: that.form.node_ip
            }))
            .then(function (res) {
              if (res.data === 'success') {
                that.createdTable(that, '离开成功')
              } else {
                that.$notify.error({
                  title: '离开失败',
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
        }
      },

      // 点击管理按钮
      handleManagerBtn (index, row) {
        console.log(row)
        this.dialogFormTitle = '编辑'
        this.form.cluster_name = row.cluster_name
        this.form.cluster_id = row.cluster_id
        this.form.service_name = row.service_name
        this.form.service_id = row.service_id
        this.form.replicates = row.replicates
        this.form.node_role = row.node_role
        this.form.node_id = row.node_id
        this.form.node_ip = row.node_ip
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

      // 对话框关闭后回调
      dialogClose () {
        this.form.server_name = ''
        this.form.addr = ''
        this.form.server_port = 0
        this.form.server_status = false
        this.form.server_identifier = ''
      },
      swarmSelect (value) {
        let that = this
        that.cluster_id = value
        that.pageOption.CurrentPage = 1
        that.listLoading = true
        that.axios.get('/node_list', {
          params: {
            cluster_id: that.cluster_id,
            current_page: that.pageOption.CurrentPage,
            page_size: that.pageOption.PageSize
          }
        })
            .then(function (res) {
              that.listLoading = false
              that.tableData = res.data.tableData
              that.totalList = res.data.total_page
            })
            .catch(function (err) {
              that.listLoading = false
              console.log(err)
            })
      },
      // 弹出表单点击确定后执行的方法
      editSubmit () {
        let that = this
        console.log('port', that.form.server_port)
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

</style>
