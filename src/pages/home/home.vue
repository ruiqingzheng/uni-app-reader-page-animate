<template>
  <view>
    <scroll-view
      class="bg-black text-white pt-10 pb-10"
      scroll-y="true"
      :style="{
        height: `${screenHeight}px`,
        width: `${screenWidth}px`
      }">
      <view
        class="flex flex-col gap-2 mx-auto"
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
<script setup lang="ts">
import { mockData } from '@/helper'
import ReaderControl from '@/components/ReaderControl.vue'

const systemInfo = ref(uni.getSystemInfoSync())
const lines = mockData()
const playing = ref(false)
const screenHeight = systemInfo.value.screenHeight
const screenWidth = systemInfo.value.screenWidth

const interSectionBottom = false

onMounted(() => {
  // setTimeout(() => {
  //   interSectionBottom = true
  // }, 3000)
})

const stop = () => {
  console.log('stop running:>> ')
  playing.value = false
}

const _play = (ts: number) => {
  console.log('play...', ts)
  // todo : is intersection bottom
  if (interSectionBottom || !playing.value) {
    // playing.value = false
    console.log('stop button or bottom...', ts)
    return
  }
  requestAnimationFrame(_play)
}

const play = () => {
  console.log('play running:>> ')
  if (playing.value) return
  playing.value = true
  requestAnimationFrame(_play)
}
</script>
<style lang="scss" scoped>
.article-line {
  @apply h-20 text-[22px] flex justify-start items-center;
}
</style>
