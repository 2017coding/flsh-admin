<template>
  <div class="authority">
    <div class="gva-table-box">
      <el-table
        :data="tableData"
        row-key="roldId"
        style="width: 100%"
      >
        <el-table-column align="left" label="用户名称" min-width="180" prop="uName" />
        <el-table-column align="left" label="绑定角色" min-width="180" prop="roleName" />
        <el-table-column align="left" label="操作" width="460">
          <template #default="scope">
            <el-button
              icon="edit"
              size="small"
              type="primary"
              link
              @click="handleBindRole(scope.row)"
            >绑定角色</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="gva-pagination">
        <el-pagination
          :current-page="page"
          :page-size="pageSize"
          :page-sizes="[10, 30, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
    <!-- 新增角色弹窗 -->
    <el-dialog v-model="dialogFormVisible" :title="dialogTitle">
      <el-form ref="authorityForm" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="form.roleId">
            <el-option
              v-for="item in roleList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" @click="closeDialog">取 消</el-button>
          <el-button size="small" type="primary" @click="enterDialog">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  getUserList,
  bindRole,
  getRoleList,
} from './service'

import { onMounted, ref } from 'vue'
import { cloneDeep } from 'lodash'
import { ElMessage, ElMessageBox } from 'element-plus'

const dialogType = ref('add')

const dialogTitle = ref('新增角色')
const dialogFormVisible = ref(false)
const apiDialogFlag = ref(false)

const form = ref({
  roleId: '',
  roleName: '',
  uId: ''
})
const rules = ref({
  roleId: [
    { required: true, message: '请选择角色名', trigger: 'blur' }
  ],
})

const page = ref(1)
const total = ref(0)
const pageSize = ref(20)
const tableData = ref([])
const searchInfo = ref({})
const roleList = ref([])

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getTableData()
}

const handleCurrentChange = (val) => {
  page.value = val
  getTableData()
}

// 查询
const getTableData = async() => {
  const [err, table] = await getUserList({ pageNumber: page.value, pageSize: pageSize.value, ...searchInfo.value })
  if (err) return
  tableData.value = table.records
  total.value = table.total
  page.value = table.current
  pageSize.value = table.size
}

getTableData()

// 初始化表单
const authorityForm = ref(null)
const initForm = () => {
  if (authorityForm.value) {
    authorityForm.value.resetFields()
  }
  form.value = {
    roleId: '',
    roleName: '',
    uId: ''
  }
}

// 关闭窗口
const closeDialog = () => {
  initForm()
  dialogFormVisible.value = false
  apiDialogFlag.value = false
}

// 确定弹窗
const enterDialog = () => {
  authorityForm.value.validate(async valid => {
    if (valid) {
      const params = cloneDeep(form.value)
      const [err] = await bindRole(params)
      if (err) return
      ElMessage({
        type: 'success',
        message: '操作成功!'
      })
      getTableData()
      closeDialog()
      initForm()
      dialogFormVisible.value = false
    }
  })
}

// 绑定角色
const handleBindRole = (row) => {
  dialogTitle.value = '绑定角色'
  dialogType.value = 'bind'
  for (const key in form.value) {
    form.value[key] = row[key]
  }
  dialogFormVisible.value = true
}

async function handleGetRoleList() {
  const [err, data] = await getRoleList({ pageNumber: 1, pageSize: 999 })
  if (err) return
  roleList.value = data.records.map(item => {
    return {
      label: item.roleName,
      value: item.roleId,
    }
  })
}

onMounted(() => {
  handleGetRoleList()
})

</script>

<script>

export default {
  name: 'Authority'
}
</script>

<style lang="scss">
.authority {
  .el-input-number {
    margin-left: 15px;
    span {
      display: none;
    }
  }
}
.role-box {
  .el-tabs__content {
    height: calc(100vh - 72px);
    overflow: auto;
  }
}
</style>
