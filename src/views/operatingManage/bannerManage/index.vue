<template>
  <div class="authority">
    <div class="gva-table-box">
      <div class="gva-btn-list">
        <el-button size="small" type="primary" icon="plus" @click="handleAdd">新增配置</el-button>
      </div>
      <el-table
        :data="tableData"
        row-key="roldId"
        style="width: 100%"
      >
        <el-table-column align="left" label="类型" min-width="180" prop="configType" />
        <el-table-column align="left" label="名称" min-width="180" prop="configValue" />
        <el-table-column align="left" label="操作" width="460">
          <template #default="scope">
            <el-button
              icon="edit"
              size="small"
              type="primary"
              link
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              icon="delete"
              size="small"
              type="primary"
              link
              @click="handleDel(scope.row)"
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
        <el-form-item label="配置类型" prop="configType">
          <el-select v-model="form.configType">
            <el-option
              v-for="item in DICT_TYPE_LIST"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="configValue">
          <el-input v-model="form.configValue" placeholder="请输入名称" autocomplete="off" />
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
  getDictList,
  addDict,
  updateDict,
  delDict,
} from './service'

import { ref } from 'vue'
import { cloneDeep } from 'lodash'
import { ElMessage, ElMessageBox } from 'element-plus'
import { DICT_TYPE_LIST } from './config'

const dialogType = ref('add')

const dialogTitle = ref('新增类型')
const dialogFormVisible = ref(false)
const apiDialogFlag = ref(false)

const form = ref({
  configId: '',
  configType: '',
  configValue: ''
})
const rules = ref({
  configType: [
    { required: true, message: '请输入配置类型', trigger: 'blur' }
  ],
  configValue: [
    { required: true, message: '请输入名称', trigger: 'blur' },
  ],
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
  const [err, table] = await getDictList({ pageNumber: page.value, pageSize: pageSize.value, ...searchInfo.value })
  if (err) return
  tableData.value = table.records
  total.value = table.total
  page.value = table.current
  pageSize.value = table.size
}

getTableData()

// 删除
const handleDel = (row) => {
  ElMessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async() => {
      const [err] = await delDict({ configId: row.configId })
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
    configKeyId: '',
    configType: '',
    configValue: ''
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
      const fn = dialogType.value === 'add' ? addDict : updateDict
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
// 增加
const handleAdd = (parentId) => {
  initForm()
  dialogTitle.value = '新增配置'
  dialogType.value = 'add'
  form.value.parentId = parentId
  dialogFormVisible.value = true
}
// 编辑
const handleEdit = (row) => {
  dialogTitle.value = '编辑配置'
  dialogType.value = 'edit'
  for (const key in form.value) {
    form.value[key] = row[key]
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
