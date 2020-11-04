<template>
  <div class="upload-container">
    <el-upload
      :action="action"
      :headers="headers"
      :multiple="false"
      :limit="1"
      :before-upload="beforeUpload"
      :on-success="onSuccess"
      :on-error="onError"
      :on-remove="onRemove"
      :file-list="fileList"
      :on-exceed="onExceed"
      :disabled="disabled"
      drag
      show-file-list
      accept="application/epub+zip"
      class="image-upload"
    >
      <i class="el-icon-upload" />
      <div v-if="fileList.length === 0" class="el-upload__text">
        请将电子书拖入或 <em>点击上传</em>
      </div>
      <div v-else class="upload__text">图书已上传</div>
    </el-upload>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'

export default {
  components: {},
  props: {
    fileList: {
      type: Array,
      default: () => {
        return []
      }
    },
    disabled: {
      type: Boolean,
      defaut: false
    }
  },
  data() {
    return {
      action: `${process.env.VUE_APP_BASE_API}/book/upload`
    }
  },
  computed: {
    headers() {
      return {
        Authorization: `Bearer ${getToken()}`
      }
    }
  },
  watch: {},
  created() {

  },
  mounted() {

  },
  // 方法集合
  methods: {
    beforeUpload(file) {
      console.log('======before upload file:', file)
    },
    onSuccess(res, file) {
      console.log('=====upload success', res, file)
      const { code, msg, data } = res
      if (code === 0) {
        this.$message({
          message: msg,
          type: 'success'
        })
        this.$emit('on-success', data)
      } else {
        this.$message({
          message: msg || '上传失败',
          type: 'warning'
        })
        this.$emit('on-error', msg)
      }
    },
    onError(err) {
      const errMsg = err.message && JSON.parse(err.message)
      this.$message({
        message: (errMsg && errMsg.msg && `上传失败：${errMsg.msg}`) || '上传失败',
        type: 'error'
      })

      this.$emit('on-error', err)
    },
    onRemove() {
      this.$message({
        message: '电子书删除成功！',
        type: 'success'
      })
      this.$emit('on-remove')
    },
    onExceed() {
      this.$message({
        message: '每次只能上传一本电子书',
        type: 'warning'
      })
    }
  }
}
</script>
<style lang='scss' scoped>

</style>
