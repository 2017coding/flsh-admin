
<template>
  <div>
    <el-upload
      v-model="fileList"
      list-type="picture-card"
      :action="`${SERVICE_API}/manage/uploadFile/uploadFile`"
      :headers="{ 'token': userStore.token }"
      :data="uploadParams"
      :on-success="handleImageSuccess"
      :before-upload="beforeImageUpload"
      :limit="1"
    >
      <el-icon><Plus /></el-icon>
      <!-- <el-button size="small" type="primary">上传文件</el-button> -->
    </el-upload>
  </div>
</template>

<script setup>
import ImageCompress from '@/utils/image'
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/pinia/modules/user'
import { SERVICE_API } from '@/config'

const emit = defineEmits(['on-success', 'input', 'change', 'on-change'])
const props = defineProps({
  fileList: {
    type: Array,
    default: () => ([])
  },
  imageUrl: {
    type: String,
    default: ''
  },
  fileSize: {
    type: Number,
    default: 2048 // 2M 超出后执行压缩
  },
  uploadParams: {
    type: Object,
    default: () => ({})
  },
  maxWH: {
    type: Number,
    default: 1920 // 图片长宽上限
  }
})

watch(() => props.fileList, val => {
  console.log('val', val)
}, { immediate: true, deep: true })

const path = ref(import.meta.env.VITE_BASE_API)

const userStore = useUserStore()

const fileList = computed(() => {
  return props.fileList.map(item => {
    return {
      ...item,
      url: item.filePath
    }
  })
})


const beforeImageUpload = (file) => {
  const isJPG = file.type === 'image/jpeg'
  const isPng = file.type === 'image/png'
  if (!isJPG && !isPng) {
    ElMessage.error('上传图片只能是 jpg或png 格式!')
    return false
  }

  const isRightSize = file.size / 1024 < props.fileSize
  if (!isRightSize) {
    // 压缩
    const compress = new ImageCompress(file, props.fileSize, props.maxWH)
    return compress.compress()
  }
  return isRightSize
}

const handleImageSuccess = (res) => {
  const { data } = res
  emit('on-input', data)
  emit('change', data)
  emit('on-change', data)
}

</script>

<script>

export default {
  name: 'UploadImage',
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.image-uploader {
  border: 1px dashed #d9d9d9;
  width: 180px;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.image-uploader {
  border-color: #409eff;
}
.image-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.image {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
