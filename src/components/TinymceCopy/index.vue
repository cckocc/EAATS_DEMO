<template>
  <div :class="{fullscreen:fullscreen}" class="tinymce-container" :style="{width:containerWidth}">
    <textarea :id="tinymceId" class="tinymce-textarea" />
    <div class="editor-custom-btn-container">
      <editorImage color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK" />
    </div>
    <!-- <textarea id="custom-toolbar-button">
  <p style="text-align: center; font-size: 15px;"><img title="TinyMCE Logo" src="//www.tiny.cloud/images/glyph-tinymce@2x.png" alt="TinyMCE Logo" width="110" height="97" />
  </p>
  <h2 style="text-align: center;">Welcome to the TinyMCE editor demo!</h2>
  <p>Select a menu item from the listbox above and it will insert contents into the editor at the caret position.</p>

  <h2>Got questions or need help?</h2>
  <ul>
    <li>Our <a href="https://www.tiny.cloud/docs/">documentation</a> is a great resource for learning how to configure TinyMCE.</li>
    <li>Have a specific question? Try the <a href="https://stackoverflow.com/questions/tagged/tinymce" target="_blank" rel="noopener"><code>tinymce</code> tag at Stack Overflow</a>.</li>
    <li>We also offer enterprise grade support as part of <a href="https://www.tiny.cloud/pricing">TinyMCE premium plans</a>.</li>
  </ul>

  <h2>Found a bug?</h2>
  <p>If you think you have found a bug please create an issue on the <a href="https://github.com/tinymce/tinymce/issues">GitHub repo</a> to report it to the developers.</p>

  <h2>Finally ...</h2>
  <p>Don't forget to check out our other product <a href="http://www.plupload.com" target="_blank">Plupload</a>, your ultimate upload solution featuring HTML5 upload support.</p>
  <p>Thanks for supporting TinyMCE! We hope it helps you and your users create great content.
    <br>All the best from the TinyMCE team.</p>
</textarea> -->
  </div>
</template>

<script>
/**
 * docs:
 * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
 */
import editorImage from './components/EditorImage'
import plugins from './plugins'
import toolbar from './toolbar'
import load from './dynamicLoadScript'
import { uploadLogin } from '@/api/file'

// 本地引入tinymce
// import editor from '@tinymce/tinymce-vue'
import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/silver/theme'
import 'tinymce/plugins/table' // 表格插件

// why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
// const tinymceCDN = 'https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js'
// const tinymceCDN = 'https://cdn.tiny.cloud/1/no-api-key/tinymce/5.4.1-89/tinymce.min.js'
// const tinymceCDN = 'https://cdn.tinymce.com/4/tinymce.min.js'

export default {
  name: 'Tinymce',
  components: { editorImage },
  props: {
    id: {
      type: String,
      default: function() {
        return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    value: {
      type: String,
      default: ''
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    menubar: {
      type: String,
      default: 'file edit insert view format table'
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360
    },
    width: {
      type: [Number, String],
      required: false,
      default: 'auto'
    },
    dataContent: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false,
      languageTypeList: {
        'en': 'en',
        'zh': 'zh_CN',
        'es': 'es_MX',
        'ja': 'ja'
      }
    }
  },
  computed: {
    containerWidth() {
      const width = this.width
      if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
        return `${width}px`
      }
      return width
    }
  },
  watch: {
    value(val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() => {
          window.tinymce.get(this.tinymceId).setContent(val || '')
        })
      }
    },
    dataContent(newVal, oldVal) {
      window.tinymce.get(this.tinymceId).insertContent(newVal, {

      })
    }
  },
  mounted() {
    this.initTinymce()
  },
  activated() {
    if (window.tinymce) {
      this.initTinymce()
    }
  },
  deactivated() {
    this.destroyTinymce()
  },
  destroyed() {
    this.destroyTinymce()
  },
  methods: {
    init() {
      // dynamic load tinymce from cdn
      load(tinymceCDN, (err) => {
        if (err) {
          this.$message.error(err.message)
          return
        }
        this.initTinymce()
      })
    },
    initTinymce() {
      const _this = this
      tinymce.init({
        language_url: './tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        skin_url: './tinymce/skins/ui/oxide',
        readonly: this.readOnly,
        selector: `#${this.tinymceId}`,
        // forced_root_block: '',
        body_class: 'panel-body ',
        object_resizing: false,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        statusbar: false,
        menubar: false,
        plugins: plugins,
        fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        min_height: 500,
        max_height: 500,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
        height: this.height,
        link_title: false,
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        // editor.ui.registry.addButton
        init_instance_callback: editor => {
          if (_this.value) {
            editor.setContent(_this.value)
          }
          _this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true
            this.$emit('input', editor.getContent())
          })
        },
        setup(editor) {
          editor.ui.registry.addButton('customInsertButton', {
            text: '插入元素',
            icon: 'visualchars',
            onAction: function(_) {
              _this.$emit('insertContent')
            }
          })
        },
        convert_urls: false,
        images_upload_handler: (blobInfo, success, failure) => {
          console.log(blobInfo)
          console.log(blobInfo.blob())
          if (!blobInfo.blob().name) return
          const fileSizeMax = 500 * 1024
          if (blobInfo.blob().size >= fileSizeMax) {
            failure('上传失败，图片大小请控制在 500K 以内')
          } else {
            const loading = this.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            })
            const params = new FormData()
            params.append('file', blobInfo.blob())
            this.getBase64(blobInfo.blob()).then(file => {
              // this.imgDataForm.img4 = file
              success(file)
              loading.close()
            }).catch(() => {
              loading.close()
            })
            // uploadLogin(params).then(res => {
            //   console.log(res)
            //   loading.close()
            //   if (res.code === 'ACK') {
            //     success(`${window.location.origin}/cass/mgt/system/file/download/tourist?fileId=${res.data.id}`) // 上传成功，在成功函数里填入图片路径
            //   } else {
            //     failure('上传失败')
            //   }
            // }).catch(() => {
            //   loading.close()
            // })
            // const params = new FormData()
            // params.append('file', blobInfo.blob())
            // const config = {
            //   headers: {
            //     'Content-Type': 'multipart/form-data'
            //   }
            // }
            // this.$axios.post(`${api.baseUrl}/api-upload/uploadimg`, params, config).then(res => {
            //   if (res.data.code == 200) {
            //     success(res.data.msg) // 上传成功，在成功函数里填入图片路径
            //   } else {
            //     failure('上传失败')
            //   }
            // }).catch(() => {
            //   failure('上传出错，服务器开小差了呢')
            // })
          }
        }
      })
    },
    destroyTinymce() {
      const tinymce = window.tinymce.get(this.tinymceId)
      if (this.fullscreen) {
        tinymce.execCommand('mceFullScreen')
      }

      if (tinymce) {
        tinymce.destroy()
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent()
    },
    imageSuccessCBK(arr) {
      const _this = this
      arr.forEach(v => {
        window.tinymce.get(_this.tinymceId).insertContent(`<img class="wscnph" src="${v.url}" >`)
      })
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
.tinymce-container {
  position: relative;
  line-height: normal;
}

.tinymce-container {
  ::v-deep {
    .mce-fullscreen {
      z-index: 10000;
    }
  }
}

.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}

.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}

.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}

.editor-upload-btn {
  display: inline-block;
}
</style>

<style>
/* 解决富文本工具栏 字体大小、颜色、表格显示不出 */
.tox-tinymce-aux {
  z-index: 9999!important;
}
</style>
