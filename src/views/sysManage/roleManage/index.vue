<template>
  <div class="authority">
    <div class="gva-table-box">
      <div class="gva-btn-list">
        <el-button size="small" type="primary" icon="plus" @click="addAuthority(0)">新增角色</el-button>
      </div>
      <el-table
        :data="tableData"
        row-key="roldId"
        style="width: 100%"
      >
        <el-table-column align="left" label="角色名称" min-width="180" prop="roleName" />
        <el-table-column align="left" label="操作" width="460">
          <template #default="scope">
            <el-button
              icon="edit"
              size="small"
              type="primary"
              link
              @click="editAuthority(scope.row)"
            >编辑</el-button>
            <el-button
              icon="delete"
              size="small"
              type="primary"
              link
              @click="deleteAuth(scope.row)"
            >删除</el-button>
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
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" autocomplete="off" />
        </el-form-item>
        <el-form-item label="查看的钓点等级" prop="selectBasanGrade">
          <el-checkbox-group v-model="form.selectBasanGrade">
            <el-checkbox label="1">等级一</el-checkbox>
            <el-checkbox label="2">等级二</el-checkbox>
            <el-checkbox label="3">等级三</el-checkbox>
            <el-checkbox label="4">等级四</el-checkbox>
            <el-checkbox label="5">等级五</el-checkbox>
            <el-checkbox label="6">等级六</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="角色说明" prop="roleRemark">
          <el-input v-model="form.roleRemark" type="area" placeholder="请输入角色说明" autocomplete="off" />
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
  getRoleList,
  addRole,
  updateRole,
  delRole,
} from './service'

import { ref } from 'vue'
import { cloneDeep } from 'lodash'
import { ElMessage, ElMessageBox } from 'element-plus'

const dialogType = ref('add')

const dialogTitle = ref('新增角色')
const dialogFormVisible = ref(false)
const apiDialogFlag = ref(false)

const form = ref({
  roleId: '',
  roleName: '',
  selectBasanGrade: [],
  roleRemark: ''
})
const rules = ref({
  roleName: [
    { required: true, message: '请输入角色名', trigger: 'blur' }
  ],
  selectBasanGrade: [
    { required: true, message: '请选择可查看钓点等级', trigger: 'blur' },
  ],
  roleRemark: [
    { required: true, message: '请输入角色说明', trigger: 'blur' },
  ]
})

const page = ref(1)
const total = ref(0)
const pageSize = ref(20)
const tableData = ref([])
const searchInfo = ref({})

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
  const [err, table] = await getRoleList({ pageNumber: page.value, pageSize: pageSize.value, ...searchInfo.value })
  if (err) return
  tableData.value = table.records
  total.value = table.total
  page.value = table.current
  pageSize.value = table.size
}

getTableData()

// 删除角色
const deleteAuth = (row) => {
  ElMessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async() => {
      const [err] = await delRole({ roleId: row.roleId })
      if (err) return
      ElMessage({
        type: 'success',
        message: '删除成功!'
      })
      if (tableData.value.length === 1 && page.value > 1) {
        page.value--
      }
      getTableData()
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除'
      })
    })
}
// 初始化表单
const authorityForm = ref(null)
const initForm = () => {
  if (authorityForm.value) {
    authorityForm.value.resetFields()
  }
  form.value = {
    roleId: '',
    roleName: '',
    selectBasanGrade: [],
    roleRemark: ''
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
      params.selectBasanGrade = params.selectBasanGrade.join(',')
      const fn = dialogType.value === 'add' ? addRole : updateRole
      const [err] = await fn(params)
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
// 增加角色
const addAuthority = () => {
  initForm()
  dialogTitle.value = '新增角色'
  dialogType.value = 'add'
  dialogFormVisible.value = true
}
// 编辑角色
const editAuthority = (row) => {
  dialogTitle.value = '编辑角色'
  dialogType.value = 'edit'
  for (const key in form.value) {
    if (key === 'selectBasanGrade') {
      form.value.selectBasanGrade = row.selectBasanGrade.split(',')
    } else {
      form.value[key] = row[key]
    }
  }
  dialogFormVisible.value = true
}

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
