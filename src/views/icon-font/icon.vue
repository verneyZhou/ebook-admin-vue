<template>
  <div class="app-container">
    <div>
      <p>1.unicode引入</p>
      <ul>
        <i class="iconfont">&#xe6eb;</i>
        <i class="iconfont">&#xe6ef;</i>
        <i class="iconfont">&#xe6f0;</i>
        <i class="iconfont">&#xe6f2;</i>
        <i class="iconfont">&#xe6f3;</i>
      </ul>
    </div>
    <div>
      <p>2.font-class引入</p>
      <ul>
        <i class="iconfont icon-auto" />
        <i class="iconfont icon-all" />
        <i class="iconfont icon-bussiness-man" />
        <i class="iconfont icon-component" />
        <i class="iconfont icon-code" />
      </ul>
    </div>
    <div>
      <p>3.symbol引入</p>
      <ul>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-auto" />
        </svg>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-all" />
        </svg>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-bussiness-man" />
        </svg>
      </ul>
    </div>
    <div>
      <p>3.svg-sprite</p>
      <ul>
        <svg-icon icon-class="404" class="mr-l-10" />
        <svg-icon icon-class="bug" class="mr-l-10" />
        <svg-icon icon-class="chart" class="mr-l-10" />
        <svg-icon icon-class="clipboard" class="mr-l-10" />
        <svg-icon icon-class="dashboard" class="mr-l-10" />
      </ul>
    </div>
  </div>
</template>

<script>

import '@/assets/iconfonts/iconfont.js'

export default {
  components: {},
  data() {
    return {

    }
  },
  computed: {},
  watch: {},
  created() {

  },
  mounted() {

  },
  // 方法集合
  methods: {

  }
}
</script>
<style lang='scss' scoped>
    ul {
        font-size: 32px;
        i {
            margin-right: 10px;
            font-size: inherit;
        }

    }
    .icon {
       width: 1em;
       height: 1em;
       vertical-align: -0.15em;
       fill: currentColor;
       overflow: hidden;
    }
    .mr-l-10 {
        margin-left: 10px;
    }
</style>
