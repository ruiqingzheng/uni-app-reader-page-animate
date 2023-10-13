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
          <text class="text-gray-500 text-xs mr-2 mt-1">{{ line.id }}</text>
          <text :style="{ fontSize: `${fontsize}px` }">{{ line.txt }}</text>
        </view>
      </view>
    </scroll-view>
    <reader-control
      :play="play"
      :stop="stop"
      :onChangeSpeed="onChangeSpeed"
      :onChangeFontSize="onChangeFontSize"
      :fontsize="fontsize"
      :speedValue="speedValue"
      :playing="playing"></reader-control>
  </view>
</template>
<script lang="ts">
import { IScrollDetail, mockData } from '@/helper'
import ReaderControl from '@/components/ReaderControl.vue'
import { useDebounce } from '@/hooks/useDebounce'

export default {
  components: { ReaderControl },
  setup() {
    const systemInfo = ref(uni.getSystemInfoSync())
    const scrollViewRef = ref(null)
    const scrollTop = ref(0) // 记录当前的滚动位置 scrollTop
    const scrollToTop = ref(0) // 滚动到的位置scrollTo  , 范围是 0 ~ contentHeight - scrollViewHeight
    const minSpeed = 0.5
    const minFontSize = 12
    const speedValue = ref(minSpeed) // 滚动速度, 每次滚动的像素
    const fontsize = ref(minFontSize) // fontsize
    const lines = mockData()
    const playing = ref(false) // [x] 用最少的变量来表示停止还是播放
    const screenHeight = systemInfo.value.screenHeight
    const screenWidth = systemInfo.value.screenWidth
    const scrollViewHeight = screenHeight // [x] 设置滚动框的高度就是屏幕高度
    const contentHeight = ref(screenHeight)
    const getContentHeightDebounceDelay = 1000 // [x] 频繁调整字体导致内容高度变化后的计算卡顿, 需要debounce

    const isInterSectionBottom = () => {
      const maxTop = contentHeight.value - scrollViewHeight
      if (scrollToTop.value >= maxTop) return true
      // 或者距离底部 10px 就认为到底了
      return maxTop - scrollTop.value < 1
    }
    const instance = getCurrentInstance()

    const getContentHeight = useDebounce(
      _getContentHeight,
      getContentHeightDebounceDelay
    )

    function _getContentHeight() {
      console.log('debounce 延时... _getContentHeight!') // 验证debounce是否生效
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
    }

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
      // scroll
      // [x] 不读取实际的 scrollTop 则不支持播放中间用户手动滚动, 必须先停止;
      // [x] 每次根据实际的 scrollTop 再来滚动 , 有更好的体验
      // scrollToTop.value += speedValue.value   // 不支持播放其间手动滚动, 需要先停止

      //! [ 🐞fix ] 播放期间 当手动拖滚动到最顶端时候 , scrollTop 为0 ,speedValue 很小, 于是 scrollToTop 被设置为很小的值
      //! 这个很小的 scrollToTop 设置给 scrollView 后被忽略为0 , 下次又到这个循环中scrollTop 读取又是 0 , 于是出现播放状态,但没有滚动的情况
      //! 解决方法就是 随机加上一个很小的数字, 让uniapp的scrollView不要忽略传递的  scrollToTop, 只需在很小的时候才加随机数就可以了

      // scrollToTop.value = scrollTop.value + speedValue.value + Math.random()
      const _scrollToTop = scrollTop.value + speedValue.value
      scrollToTop.value =
        _scrollToTop < 5 ? _scrollToTop + Math.random() : _scrollToTop
      // console.log('play...', ts, 'scrollToTop:', scrollToTop.value)

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
      // console.log('scroll e scrollTop:>> ', e.detail.scrollTop)
      const _top = e.detail.scrollTop < 0 ? 0 : e.detail.scrollTop
      scrollTop.value = _top
    }

    const onChangeSpeed = (x: number) => {
      speedValue.value = minSpeed + x / 20
    }

    const onChangeFontSize = (y: number) => {
      const newFontSize = minFontSize + y / 10
      console.log('newFontSize :>> ', newFontSize)
      fontsize.value = newFontSize
      // [x] 当改变fontsize 后, 需要重新用新高度来计算是否到底部,因为内容高度发生变化
      getContentHeight()
    }

    onMounted(() => {
      getContentHeight()
    })

    onMounted(() => {
      // [x] 页面加载则自动播放,  但要在 contentHeight 确定后才能开始
      setTimeout(() => play(), getContentHeightDebounceDelay + 200)
    })

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
      scrollToTop,
      onChangeSpeed,
      onChangeFontSize,
      fontsize,
      speedValue
    }
  }
}
</script>
<style lang="scss" scoped>
.article-line {
  @apply py-2 text-[22px] flex justify-start items-start;
}
</style>
