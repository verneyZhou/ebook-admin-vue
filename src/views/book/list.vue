<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="书名"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
        @blur="handleFilter"
      />
      <el-input
        v-model="listQuery.author"
        placeholder="作者"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
        @blur="handleFilter"
      />
      <el-select
        v-model="listQuery.category"
        placeholder="分类"
        clearable
        class="filter-item"
        @change="handleFilter"
      >
        <el-option v-for="item in categoryList" :key="item.value" :label="`${item.label}(${item.num})`" :value="item.value" />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        查询
      </el-button>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        新增
      </el-button>
      <el-checkbox
        v-model="showCover"
        class="filter-item"
        @change="changeShowCover"
      >
        显示封面
      </el-checkbox>
    </div>

    <!-- 表格 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :default-sort="defaultSort"
      @sort-change="sortChange"
    >
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
      />
      <el-table-column label="书名" width="150" align="center">
        <template slot-scope="{ row: { titleWrapper }}">
          <span v-html="titleWrapper" />
        </template>
      </el-table-column>
      <el-table-column label="作者" width="150" align="center">
        <template slot-scope="{ row: { authorWrapper }}">
          <span v-html="authorWrapper" />
        </template>
      </el-table-column>
      <el-table-column label="出版社" width="150" align="center" prop="publisher" />
      <el-table-column label="分类" width="100" align="center" prop="categoryText" />
      <el-table-column label="语言" align="center" prop="language" />
      <el-table-column v-if="showCover" label="封面" width="150" align="center">
        <template slot-scope="scope">
          <a :href="scope.row.cover" target="_blank">
            <img :src="scope.row.cover" style="width: 120px; height: 180px;" alt="">
          </a>
        </template>
      </el-table-column>
      <el-table-column label="文件名" prop="fileName" width="100" align="center" />
      <el-table-column label="文件路径" width="100" align="center">
        <template slot-scope="{ row: { filePath }}">
          <span>{{ filePath | valueFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="封面路径" width="100" align="center">
        <template slot-scope="{ row: { coverPath }}">
          <span>{{ coverPath | valueFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="解压路径" width="100" align="center">
        <template slot-scope="{ row: { unzipPath }}">
          <span>{{ unzipPath | valueFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上传人" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createUser | valueFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上传时间" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createDt | timeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120" fixed="right">
        <template slot-scope="{ row }">
          <!-- <PreviewDialog title="电子书信息" :data="row">
                <el-button type="text" icon="el-icon-view" />
            </PreviewDialog> -->
          <el-button type="text" icon="el-icon-edit" @click="handleUpdate(row)" />
          <el-button type="text" icon="el-icon-delete" style="color:#f56c6c" @click="handleDelete(row)" />
        </template>
      </el-table-column>

    </el-table>

    <!-- 页码 -->
    <pagination
      v-show="totalCount > 0"
      :total="totalCount"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="handleFilter"
    />
  </div>
</template>

<script>
import waves from '@/directive/waves'
import { parseTime } from '@/utils/index'
import Pagination from '@/components/Pagination/index'
import { getCategory, listBook, deleteBook } from '@/api/book'

export default {
  components: {
    Pagination
  },
  directives: { waves },
  filters: { // 过滤器
    timeFilter(time) {
      if (time) {
        return parseTime(time, '{y}-{m}-{d} {h}:{i}')
      } else {
        return '无'
      }
    },
    valueFilter(value) {
      return value || '无'
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      totalCount: 0,
      listLoading: true,
      listQuery: {},
      categoryList: [],
      showCover: false,
      defaultSort: {}
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getCategoryList()
    this.parseQuery()
  },
  mounted() {

  },
  // 方法集合
  methods: {
    parseQuery() {
      // 收集查询条件
      const query = Object.assign({}, this.$route.query)
      let sort = '+id' // 默认排序
      let listQuery = {
        page: 1,
        pageSize: 20,
        sort
      }
      if (query) {
        query.page && (query.page = +query.page)
        query.pageSize && (query.pageSize = +query.pageSize)
        query.category && (query.category = +query.category)
        query.sort && (sort = query.sort)
      }
      // // 排序
      const sortSymbol = sort[0]
      const sortColumn = sort.slice(1, sort.length)
      this.defaultSort = {
        prop: sortColumn,
        order: sortSymbol === '+' ? 'ascending' : 'descending'
      }
      // //

      listQuery = { ...listQuery, ...query }
      this.listQuery = listQuery

      this.getBookList()
    },
    getBookList() {
      this.listLoading = true
      listBook(this.listQuery).then(res => {
        console.log('=====booklist', res.data)
        const { page, pageSize, count, list } = res.data
        console.log('=====', page, pageSize)
        this.list = list
        this.totalCount = count
        this.listLoading = false

        // / 关键词高亮
        this.list.forEach(v => {
          this.$set(v, 'titleWrapper', this.wrapperKeyword('title', v.title))
          this.$set(v, 'authorWrapper', this.wrapperKeyword('author', v.author))
        })
        // /////
      })
    },
    // / 关键词高亮
    wrapperKeyword(k, v) {
      function highlight(val) {
        return `<span style="color: #1890ff">${val}</span>`
      }

      if (this.listQuery[k]) {
        return v.replace(new RegExp(this.listQuery[k], 'ig'), v => highlight(v))
      } else {
        return v
      }
    },
    // ////

    // //
    sortChange(data) {
      console.log('=====sortChange', data)
      const { prop, order } = data
      this.sortBy(prop, order)
    },
    sortBy(prop, order) {
      if (order === 'ascending') {
        this.listQuery.sort = `+${prop}`
      } else {
        this.listQuery.sort = `-${prop}`
      }
      this.handleFilter()
    },
    handleFilter() {
      console.log('====handleFilter', this.listQuery)
      this.listQuery.page = 1
      this.refresh()
    },
    refresh() {
      this.$router.push({
        path: '/book/list',
        query: this.listQuery
      })
    },
    handleCreate() {
      this.$router.push('/book/create')
    },
    changeShowCover(val) {
      this.showCover = val
    },
    getCategoryList() {
      getCategory().then(response => {
        console.log('=====categoryList', response.data)
        this.categoryList = response.data
      })
    },

    handleUpdate(row) {
      this.$router.push(`/book/edit/${row.fileName}`)
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该电子书, 是否继续?', '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        // 确定

        deleteBook(row.fileName).then(response => {
          this.$notify({
            title: '成功',
            message: response.msg || '删除成功',
            type: 'success',
            duration: 2000
          })
          this.listQuery.page = 1
          this.getBookList()
        })
      }).catch(err => {
        // 取消
        console.log('=====err', err)
      })
    }
  },
  beforeRouteUpdate(to, from, next) {
    console.log('=====beforeRouteUpdate')
    if (to.path === from.path) {
      const newQuery = Object.assign({}, to.query)
      const oldQuery = Object.assign({}, from.query)
      if (JSON.stringify(newQuery) !== JSON.stringify(oldQuery)) {
        this.getBookList()
      }
    }
    next()
  }
}
</script>
<style lang='scss' scoped>
 .filter-item {
    margin-right: 10px;
  }
</style>
