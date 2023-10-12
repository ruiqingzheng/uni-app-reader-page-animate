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
    <reader-control></reader-control>
  </view>
</template>
<script setup lang="ts">
import { mockData } from '@/helper'
import ReaderControl from '@/components/ReaderControl.vue'

const systemInfo = ref(uni.getSystemInfoSync())
const lines = mockData()
const screenHeight = systemInfo.value.screenHeight
const screenWidth = systemInfo.value.screenWidth
</script>
<style lang="scss" scoped>
.article-line {
  @apply h-20 text-[22px] flex justify-start items-center;
}
</style>
