<template>
  <view>
    <scroll-view
      class="bg-black text-white pt-10 pb-10"
      :scroll-y="true"
      @scroll="onScroll"
      :scroll-top="scrollToTop"
      :style="{
        height: `${scrollViewHeight}px`,
        width: `${screenWidth}px`
      }">
      <view
        class="flex flex-col gap-2 mx-auto"
        id="scroll-view-content"
        :style="{ width: `${screenWidth - 40}px` }">
        <view v-for="line in lines" :key="line.id" class="article-line">
          <text class="text-gray-500 text-xs mr-2 -mt-5">{{ line.id }}</text>
          <text>{{ line.txt }}</text>
        </view>
      </view>
    </scroll-view>
    <reader-control
      :play="play"
      :stop="stop"
      :playing="playing"></reader-control>
  </view>
</template>
<script lang="ts">
import { IScrollDetail, mockData } from '@/helper'
import ReaderControl from '@/components/ReaderControl.vue'

export default {
  components: { ReaderControl },
  setup() {
    const systemInfo = ref(uni.getSystemInfoSync())
    const scrollViewRef = ref(null)
    const scrollTop = ref(0) // 记录当前的滚动位置 scrollTop
    const scrollToTop = ref(0) // 滚动到的位置scrollTo  , 范围是 0 ~ contentHeight - scrollViewHeight
    const lines = mockData()
    const playing = ref(false)
    const screenHeight = systemInfo.value.screenHeight
    const screenWidth = systemInfo.value.screenWidth
    const scrollViewHeight = screenHeight
    const contentHeight = ref(screenHeight)

    const isInterSectionBottom = () => {
      const maxTop = contentHeight.value - scrollViewHeight
      if (scrollToTop.value >= maxTop) return true
      // 或者距离底部 10px 就认为到底了
      return maxTop - scrollTop.value < 10
    }
    const instance = getCurrentInstance()

    onMounted(() => {
      setTimeout(() => {
        const query = uni.createSelectorQuery().in(instance)
        query
          .select('#scroll-view-content')
          .boundingClientRect((data) => {
            // console.log(
            //   'content height:>> ',
            //   (data as { height: number }).height,
            //   'scrollHeight: ',
            //   scrollViewHeight
            // )
            contentHeight.value = (data as { height: number }).height
          })
          .exec()
      }, 0)
    })

    // 移动到顶部, 为了不突兀 延迟1秒
    const moveToTop = () => {
      setTimeout(() => {
        scrollToTop.value = 0
      }, 1000)
    }

    const stop = () => {
      console.log('stop running:>> ')
      playing.value = false
    }

    const _play = (ts: number) => {
      console.log('play...', ts)
      // scroll
      // scrollToTop.value = scrollTop.value + 10 // 不需要读取scrollTop
      scrollToTop.value += 10

      const isBottom = isInterSectionBottom()
      // 暂停或到达底部都退出滚动
      if (isBottom || !playing.value) {
        if (isBottom) {
          moveToTop()
          stop()
        }
        console.log('stop button or bottom...', ts)
        return
      }
      requestAnimationFrame(_play)
    }

    // 开始滚动
    const play = () => {
      console.log('play running:>> ')
      if (playing.value) return
      // 在开始滚动的时候, 需要设置初始值
      scrollToTop.value = scrollTop.value
      playing.value = true
      requestAnimationFrame(_play)
    }

    const onScroll = (e: { detail: IScrollDetail }) => {
      console.log('scroll e :>> ', e.detail)
      scrollTop.value = e.detail.scrollTop
    }

    return {
      play,
      stop,
      scrollViewHeight,
      screenWidth,
      lines,
      playing,
      scrollViewRef,
      contentHeight,
      onScroll,
      scrollToTop
    }
  }
}
</script>
<style lang="scss" scoped>
.article-line {
  @apply h-20 text-[22px] flex justify-start items-center;
}
</style>
