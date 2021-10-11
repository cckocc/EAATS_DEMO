<template>
  <div class="marquee-panel">
    <div class="top">
      <!-- 至少两张跑马灯，推荐图片大小不超过500K10M（实际最大限制100M），推荐尺寸1920*417（实际无限制） -->
      <span>注：至少两张跑马灯，推荐图片大小不超过</span>
      <span style="color: #206AC4FF; line-height: 30px">10M</span>
      <span>（实际最大限制100M），推荐尺寸</span>
      <span style="color: #206AC4FF">1920*417px</span>
      <span>（实际无限制）</span>
    </div>
    <div class="body">
      <el-form
        ref="imgForm"
        :rules="rules"
        :data="imgDataForm"
        class="form-img"
      >
        <el-form-item prop="img1">
          <el-upload
            ref="uploadFile1"
            class="upload-demo"
            action="fakeaction"
            :show-file-list="false"
            :http-request="uploadFile1"
            :before-upload="beforeImgUpload"
            accept=".jpg,.jpeg,.png"
          >
            <img v-if="imgDataForm.img1" :src="imgDataForm.img1" class="img">
            <div v-else>
              <span class="img-title img-title-validate">图片1</span>
              <div class="el-upload__text">点击上传图片</div>
            </div>
          </el-upload>
          <div v-if="imgDataForm.img1" class="delete-panel">
            <el-button v-preventReClick icon="el-icon-delete" class="delete" @click="deleteImg('img1')" />
          </div>
        </el-form-item>

        <el-form-item prop="img2">
          <el-upload
            class="upload-demo"
            action="fakeaction"
            :show-file-list="false"
            :http-request="uploadFile2"
            :before-upload="beforeImgUpload"
            accept=".jpg,.jpeg,.png"
          >
            <img v-if="imgDataForm.img2" :src="imgDataForm.img2" class="img">
            <div v-else>
              <span class="img-title img-title-validate">图片2</span>
              <div class="el-upload__text">点击上传图片</div>
            </div>
          </el-upload>
          <div v-if="imgDataForm.img2" class="delete-panel">
            <el-button v-preventReClick icon="el-icon-delete" class="delete" @click="deleteImg('img2')" />
          </div>
        </el-form-item>

        <el-form-item prop="img3">
          <el-upload
            class="upload-demo"
            action="fakeaction"
            :show-file-list="false"
            :http-request="uploadFile3"
            :before-upload="beforeImgUpload"
            accept=".jpg,.jpeg,.png"
          >
            <img v-if="imgDataForm.img3" :src="imgDataForm.img3" class="img">
            <div v-else>
              <span class="img-title">图片3</span>
              <div class="el-upload__text">点击上传图片</div>
            </div>
          </el-upload>
          <div v-if="imgDataForm.img3" class="delete-panel">
            <el-button v-preventReClick icon="el-icon-delete" class="delete" @click="deleteImg('img3')" />
          </div>
        </el-form-item>

        <el-form-item prop="img4">
          <el-upload
            action="fakeaction"
            class="upload-demo"
            :show-file-list="false"
            :http-request="uploadFile4"
            :before-upload="beforeImgUpload"
            accept=".jpg,.jpeg,.png"
          >
            <img v-if="imgDataForm.img4" :src="imgDataForm.img4" class="img">
            <div v-else>
              <span class="img-title">图片4</span>
              <div class="el-upload__text">点击上传图片</div>
            </div>
          </el-upload>
          <div v-if="imgDataForm.img4" class="delete-panel">
            <el-button v-preventReClick icon="el-icon-delete" class="delete" @click="deleteImg('img4')" />
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <el-button v-preventReClick class="release" type="primary" @click="onOperate('submit')">发 布</el-button>
    </div>
  </div>
</template>

<script>
import gripManageApi from '@/api/gripManageApi'
import { isEmpty } from '@/utils/index'
export default {
  name: 'MemberManage',
  data() {
    return {
      tabActiveName: 'notice',
      imgIdList: {
        id1: '',
        id2: ''
      },
      imgDataForm: {
        fileIdList: [],
        img1: '',
        img2: '',
        img3: '',
        img4: ''
      },
      rules: {
        img1: [{ required: true, message: '图片1不能为空！', trigger: 'blur' }],
        img2: [{ required: true, message: '图片2不能为空！', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getAllCarousel()
  },
  methods: {
    onOperate(type) {
      if (type === 'submit') {
        // this.$refs['imgForm'].validate((valid) => {
        if (this.$refs['imgForm']) {
          this.$refs['imgForm'].clearValidate()
        }
        if (!this.imgDataForm.img1) {
          this.$refs['imgForm'].validateField('img1')
        }
        if (!this.imgDataForm.img2) {
          this.$refs['imgForm'].validateField('img2')
        } else {
          if (this.imgIdList !== null) {
            const arr = []
            const idList = ['id1', 'id2', 'id3', 'id4']
            idList.forEach(e => {
              if (!isEmpty(this.imgIdList[e])) {
                arr.push(this.imgIdList[e])
              }
            })
            this.imgDataForm.fileIdList = arr
            // this.imgDataForm.fileIdList = Object.values(this.imgIdList)
          }
          const parmas = {
            fileIdList: this.imgDataForm.fileIdList
          }
          gripManageApi.saveImg(parmas).then(res => {
            if (res.code === 'ACK') {
              this.$message({
                type: 'success',
                message: res.message
              })
              this.imgIdList = []
              this.$router.push({
                name: 'home'
              })
            } else if (res.code === 'VALIDATION') {
              console.log('VALIDATION')
            }
          })
        }
        // })
      }
    },
    uploadFile1(params) {
      this.uploadFile(params).then(res => {
        if (!res.code) {
          this.imgIdList.id1 = res
          this.getBase64(params.file).then(file => {
            this.imgDataForm.img1 = file
          })
        } else if (res.code === 'NACK') {
          this.imgDataForm.img1 = ''
        }
      })
    },
    uploadFile2(params) {
      this.uploadFile(params).then(res => {
        if (!res.code) {
          this.imgIdList.id2 = res
          this.getBase64(params.file).then(file => {
            this.imgDataForm.img2 = file
          })
        } else if (res.code === 'NACK') {
          this.imgDataForm.img2 = ''
        }
      })
    },
    uploadFile3(params) {
      this.uploadFile(params).then(res => {
        if (!res.code) {
          this.imgIdList.id3 = res
          this.getBase64(params.file).then(file => {
            this.imgDataForm.img3 = file
          })
        } else if (res.code === 'NACK') {
          this.imgDataForm.img3 = ''
        }
      })
    },
    uploadFile4(params) {
      this.uploadFile(params).then(res => {
        if (!res.code) {
          this.imgIdList.id4 = res
          this.getBase64(params.file).then(file => {
            this.imgDataForm.img4 = file
          })
        } else if (res.code === 'NACK') {
          this.imgDataForm.img4 = ''
        }
      })
    },
    async uploadFile(params) {
      const file = params.file
      const form = new FormData()
      form.append('file', file)
      const res = await gripManageApi.noticeUploadFile(form)
      return res.data.id
    },
    deleteImgAPI(id) {
      Object.keys(this.imgIdList).some((key) => {
        if (this.imgIdList[key] === id) {
          delete this.imgIdList[key]
        }
      })
      // const params = {
      //   id: id
      // }
      // gripManageApi.noticeDeleteFile(params).then(res => {
      //   if(res.code === 'ACK') {
      //     this.$message.success('删除成功')
      //     Object.keys(this.imgIdList).some((key) => {
      //       if(this.imgIdList[key] === id) {
      //         delete this.imgIdList[key]
      //       }
      //     })
      //   } else {
      //     this.$message.success('删除失败，请重试！')
      //   }
      // })
    },
    deleteImg(img) {
      switch (img) {
        case 'img1':
          const id1 = this.imgIdList.id1
          this.imgDataForm.img1 = ''
          this.deleteImgAPI(id1)
          break
        case 'img2':
          const id2 = this.imgIdList.id2
          this.imgDataForm.img2 = ''
          this.deleteImgAPI(id2)
          break
        case 'img3':
          const id3 = this.imgIdList.id3
          this.imgDataForm.img3 = ''
          this.deleteImgAPI(id3)
          break
        default:
          const id4 = this.imgIdList.id4
          this.imgDataForm.img4 = ''
          this.deleteImgAPI(id4)
          break
      }
    },
    // 查询所有轮播图
    getAllCarousel() {
      gripManageApi.getAllCarousel().then(res => {
        if (res.code === 'ACK') {
          const data = res.data
          res.data.some((e, i) => {
            i = i + 1
            this.imgIdList['id' + i] = e.imageFileId
            this.imgDataForm['img' + i] = 'data:image/png;base64,' + e.imageFileLinkUrl // 展示base64的图片需要前缀
          })
        }
      })
    },
    beforeImgUpload(file) {
      const isImg = file.type === 'image/jpeg' || 'image/jpg' || 'image/png'
      const isLt5M = file.size / 1024 / 1024 <= 100
      if (!isImg) {
        this.$message.error('支持上传.jpeg、.jpg、.png格式的图片!')
        return isImg
      }
      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过100M!')
        return isLt5M
      }
      // let imgWidth = ''
      // let imgHight = ''
      // const _this = this
      // const isSizePromise = new Promise(function(resolve, reject) {
      //   const width = 1920
      //   const height = 417
      //   const _URL = window.URL || window.webkitURL
      //   const img = new Image()
      //   img.src = _URL.createObjectURL(file)
      //   img.onload = function() {
      //     imgWidth = img.width
      //     imgHight = img.height
      //     const valid = img.width === width && img.height === height
      //     if (!valid) {
      //       _this.$message({
      //         type: 'error',
      //         message: '上传的图片宽需要为1920px，高需要为417px，当前上传图片的宽高分别为：' + imgWidth + 'px和' + imgHight + 'px',
      //         btn: false,
      //         duration: 5000
      //       })
      //     }
      //     valid ? resolve() : reject()
      //   }
      // })
      // return isSizePromise
    },
    getBase64(file) {
      return new Promise(function(resolve, reject) {
        const reader = new FileReader()
        let imgResult = ''
        reader.readAsDataURL(file)
        reader.onload = function() {
          imgResult = reader.result
        }
        reader.onerror = function(error) {
          reject(error)
        }
        reader.onloadend = function() {
          resolve(imgResult)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$panelWidth: 1220px;
.marquee-panel {
  width:$panelWidth;
  margin: 8px 0;
  height:92%;
  padding-bottom: 40px;
  overflow: auto;
  background:rgb(255,255,255);
  border:1px solid rgb(223,223,223);
  box-shadow:0px 3px 6px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  .top {
    // width:694px;
    height:30px;
    background:rgba(246,247,251,1);
    border:1px solid rgba(209,213,222,1);
    margin-top: 40px;
    font-size:14px;
    font-family:Microsoft YaHei;
    color:#303030FF;
    padding-left: 8px;
  }
  .body {
      .upload-demo {
        width:694px;
        height:152px;
        // margin-bottom: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background:#f6f7fb;
        border:1px solid rgba(209,213,222,1);
        ::v-deep .el-upload {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
        }
        .el-upload__text {
            font-size:20px;
            font-family:Microsoft YaHei;
            font-weight:400;
            line-height:22px;
            margin-top: 15px;
            color:#2C76D1FF;
            width: 100%;
            // height: 100%;
        }
        .img {
            width: 100%;
            height: 100%;
        }
      }
      .img-title {
        font-size:20px;
        font-family:Microsoft YaHei;
        font-weight:400;
        color:#303030;
      }
      .img-title-validate:after{
        content: "*";
        color: #ff4949;
        font-size: 20px;
        margin-left: 4px;
      }
  }
}
.el-form-item {
  margin-bottom: 20px;
  /deep/.el-form-item__content {
    display: flex;
  }
  &:nth-child(1) {
    margin-top: 28px;
  }
  .delete-panel {
    display: flex;
    flex-direction: column-reverse;
  }
  .delete {
    border: none;
    margin-left: 10px;
  }
}
.footer {
  margin-top: 10px;
  .preview {
    width:74px;
    height:38px;
    background:rgba(241,245,251,1);
    border:1px solid rgba(44,118,209,1);
  }
  .release {
    width:74px;
    height:38px;
    background:rgba(44,118,209,1);
  }
}
</style>
