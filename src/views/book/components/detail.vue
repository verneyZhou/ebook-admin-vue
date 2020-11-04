<template>
  <el-form ref="postForm" :model="postForm" :rules="rulesForm">
    <!-- 吸顶 -->
    <sticky :class-name="`sub-navbar ${postForm.status}`">
      <el-button v-if="!isEdit" @click="showGuide">显示帮助</el-button>
      <el-button
        v-loading="loading"
        type="success"
        style="margin-left: 10px;"
        @click="submitForm"
      >
        {{ isEdit ? '编辑图书' : '新增图书' }}
      </el-button>
    </sticky>

    <div class="detail-container">
      <el-row>
        <Warning />
        <el-col :span="24">
          <!-- 上传组件 -->
          <ebook-upload
            :file-list="fileList"
            :disbled="!isEdit"
            @on-success="onUploadSuccess"
            @on-remove="onUploadRemove"
          />
        </el-col>
        <el-col :span="24">
          <!-- 表单控件的样式 -->
          <el-form-item prop="title">
            <MdInput v-model="postForm.title" :maxlength="100" name="name" required>书名</MdInput>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item prop="author" label="作者：" :label-width="labelWidth">
                <el-input
                  v-model="postForm.author"
                  placeholder="作者"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="publisher" label="出版社：" :label-width="labelWidth">
                <el-input
                  v-model="postForm.publisher"
                  placeholder="出版社"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item prop="language" label="语言：" :label-width="labelWidth">
                <el-input
                  v-model="postForm.language"
                  placeholder="语言"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="rootFile" label="根文件：" :label-width="labelWidth">
                <el-input
                  v-model="postForm.rootFile"
                  placeholder="根文件"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item prop="filePath" label="文件路径：" :label-width="labelWidth">
                <el-input
                  v-model="postForm.filePath"
                  placeholder="文件路径"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="unzipPath" label="解压路径：" :label-width="labelWidth">
                <el-input
                  v-model="postForm.unzipPath"
                  placeholder="解压路径"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item prop="coverPath" label="封面路径：" :label-width="labelWidth">
                <el-input
                  v-model="postForm.coverPath"
                  placeholder="封面路径"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="originalName" label="文件名称：" :label-width="labelWidth">
                <el-input
                  v-model="postForm.originalName"
                  placeholder="文件名称"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="cover" :label-width="labelWidth" label="封面：">
                <a v-if="postForm.cover" :href="postForm.cover" target="_blank">
                  <img :src="postForm.cover" class="preview-img">
                </a>
                <span v-else>无</span>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 目录 -->
          <el-row>
            <el-col :span="24">
              <el-form-item prop="contentsTree" label="目录：" :label-width="labelWidth">
                <div v-if="postForm.contentsTree && postForm.contentsTree.length" class="contents-wrapper">
                  <el-tree
                    :data="postForm.contentsTree"
                    @node-click="onMenuClick"
                  />
                </div>
                <span v-else>无</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </el-form>
</template>

<script>
import Sticky from '@/components/Sticky/index'
import Warning from './warning'
import EbookUpload from '@/components/EbookUpload/index'
import MdInput from '@/components/MDinput/index'
import { createBook, getBook, updateBook } from '@/api/book'

const defaultForm = {
  title: '',
  author: '',
  publisher: '',
  language: '',
  rootFile: '',
  cover: '',
  url: '',
  originalName: '',
  fileName: '',
  coverPath: '',
  filePath: '',
  unzipPath: '',
  contents: [],
  contentsTree: []
}

export default {
  components: {
    Sticky,
    Warning,
    EbookUpload,
    MdInput
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        // this.$message({
        //     message: rule.field + '为必传项',
        //     type: 'error'
        // })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    // const validateSourceUri = (rule, value, callback) => {
    //   if (value) {
    //     if (validURL(value)) {
    //       callback()
    //     } else {
    //       this.$message({
    //         message: '外链url填写不正确',
    //         type: 'error'
    //       })
    //       callback(new Error('外链url填写不正确'))
    //     }
    //   } else {
    //     callback()
    //   }
    // }
    return {
      postForm: Object.assign({}, defaultForm),
      rulesForm: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        author: [{ validator: validateRequire }],
        publisher: [{ validator: validateRequire }],
        language: [{ validator: validateRequire }]
        // source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      loading: false,
      fileList: [],
      labelWidth: '120'
    }
  },
  computed: {},
  watch: {},
  created() {
    if (this.isEdit) {
      const fileName = this.$route.params && this.$route.params.fileName
      console.log('====fileName', fileName)
      this.getBookData(fileName)
    }
  },
  mounted() {

  },
  // 方法集合
  methods: {
    setData(data) {
      const { title, author, publisher, language, rootFile, cover, url, originalName, contents, contentsTree, fileName, coverPath, filePath, unzipPath } = data
      this.postForm = {
        ...this.postForm,
        title, author, publisher, language, rootFile, cover, url, originalName, contents, contentsTree, fileName, coverPath, filePath, unzipPath
      }

      this.fileList = [{ name: originalName || fileName, url }]
      this.contentsTree = contentsTree
    },

    // 重置
    setDefault() {
      // this.postForm = Object.assign({}, defaultForm)
      this.fileList = []
      this.contentsTree = []
      this.$refs.postForm.resetFields() // 重置
    },
    showGuide() {

    },
    submitForm() {
      console.log('======this.postForm', this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          const book = Object.assign({}, this.postForm)
          // delete book.contents
          delete book.contentsTree
          if (!this.isEdit) {
            createBook(book)
              .then(response => {
                console.log('createBook', response)
                this.loading = false
                this.$notify({
                  title: '成功',
                  message: response.msg,
                  type: 'success',
                  duration: 2000
                })
                this.setDefault()
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            updateBook(book).then(response => {
              console.log('updateBook', response)
              this.loading = false
              this.$notify({
                title: '成功',
                message: response.msg,
                type: 'success',
                duration: 2000
              })
            }).catch(() => {
              this.loading = false
            })
          }
        } else {
          return false
        }
      })
    },

    onUploadSuccess(data) {
      console.log('=====onUploadSuccess', data)
      this.setData(data)
    },
    onUploadRemove() {
      console.log('====onUploadRemove')
      this.setDefault()
    },
    onMenuClick(data) {
      console.log('==onMenuClick==data', data)
      const { text } = data
      window.open(text)
    },

    // /// 获取电子书信息
    getBookData(fileName) {
      getBook(fileName).then(res => {
        console.log('====res', res)
        this.setData(res.data)
      }).catch(err => {
        console.log('====err', err)
      })
    }
  }
}
</script>
<style lang='scss' scoped>
    .detail-container {
        padding: 40px 50px 20px;
    }

</style>
