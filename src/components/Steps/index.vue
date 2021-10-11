<template>
  <div class="steps">
    <div class="steps-main">
      <div v-for="(item,index) in stepsList" :key="index" class="steps-item" @click="toggleSteps(index)">
        <div class="num" :class="{active: index < currentActiveIndex}">{{ index + 1 }}</div>
        <div class="text" :class="{active: index < currentActiveIndex}">{{ item }}</div>
        <div v-show="index < stepsList.length-1" class="dot" :class="{active: index < currentActiveIndex - 1}">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    stepsList: {
      type: Array,
      default: () => []
    },
    activeIndex: {
      type: Number,
      default: 1
    }
  },
  computed: {
    currentActiveIndex: {
      get() {
        return this.activeIndex
      },
      set(val) {
        console.log(val)
      }
    }
  },
  created() {
    // console.log(this.stepsList)
  },
  methods: {
    toggleSteps(index) {
      const currentIndex = ++index
      this.currentActiveIndex = currentIndex
      this.$emit('toggleSteps', currentIndex)
    }
  }
}
</script>

<style lang="scss" scoped>
  .steps {
    // background-color: #FAFBFD;
    // border-bottom: 1px solid #EAEDF2;
    .steps-main {
      display: flex;
      justify-content: center;
      padding: 0 10px;

      .steps-item {
        display: flex;
        align-items: center;
        min-height: 76px;
        cursor: pointer;

        .num {
          flex-shrink: 0;
          height: 33px;
          width: 33px;
          line-height: 33px;
          text-align: center;
          border-radius: 50%;
          color: #FFFFFF;
          font-size: 20px;
          background-color: #D2D2D2;

          &.active {
            background-color: #2C76D1;
          }
        }

        .text {
          font-size: 18px;
          color: #D2D2D2;
          font-weight: bold;
          margin-left: 14px;
          min-width: 36px;

          &.active {
            color: #2C76D1;
          }
        }

        .dot {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          margin: 0 18px;

          span {
            height: 5px;
            width: 5px;
            border-radius: 50%;
            background-color: #D2D2D2;

            &:not(:last-child) {
              margin-right: 10px;
            }
          }

          &.active {
            span {
              background-color: #2C76D1;
            }

          }
        }
      }
    }
  }
</style>
