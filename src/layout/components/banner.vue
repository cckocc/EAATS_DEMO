<template>
  <div v-if="alwaysShowSwiper || (imgList && imgList.length > 0)" class="swiper">
    <el-carousel :interval="3000" type="" height="417px" arrow="never" loop>
      <el-carousel-item v-for="(item,index) in imgList" :key="index">
        <img :src="'data:image/png;base64,' + item.imageFileLinkUrl" style="width: 100%; height: 100%" alt="">
        <!--<div class="text">
          <span>一站式接口服务平台上线</span>
        </div>-->
      </el-carousel-item>
      <!--<el-carousel-item>
        <img src="@/assets/style/bg.png" alt="">
      </el-carousel-item>
      <el-carousel-item>
        <img src="@/assets/style/bg.png" alt="">
      </el-carousel-item>-->
    </el-carousel>
  </div>
</template>

<script>
import gripManageApi from '@/api/gripManageApi'
export default {
  data() {
    return {
      imgList: [],
      alwaysShowSwiper: true
    }
  },
  watch: {
    $route(route) {
      console.log(route)
      if (route.currentRoute.name === 'home') {
        this.alwaysShowSwiper = false
      } else {
        this.alwaysShowSwiper = true
      }
    }
  },
  created() {
    this.getAllCarousel()
    console.log(this.$router)
    if (this.$router.currentRoute.name === 'home') {
      this.alwaysShowSwiper = false
    } else {
      this.alwaysShowSwiper = true
    }
  },
  methods: {
    getAllCarousel() {
      gripManageApi.getAllCarousel().then(res => {
        if (res.code === 'ACK') {
          this.imgList = res.data
        } else if (res.code === 'NACK') {
          this.$router.push({
            path: '/login'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .swiper {
    ::v-deep.el-carousel__button {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    ::v-deep.el-carousel__item {
      .text {
        font-size: 50px;
        position: absolute;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        background-color: rgba(42, 115, 204, .5);
        width: 100%;
        height: 100%;

        span {
          letter-spacing: 5px;
        }
      }
    }

  }
</style>
