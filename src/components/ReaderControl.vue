<template>
  <bottom-control
    _class="grid grid-cols-3 place-content-center  px-0 h-40 opacity-100"
    :style="{ width: `${systemInfo.windowWidth}px` }">
    <view class="col-span-1">
      <button
        hover-class="bg-orange-500 text-gray-100"
        @click="onButtonClick"
        :class="[
          'active:bg-orange-300 rounded  h-8 w-20 text-xs text-white flex justify-center items-center ',
          `${playing ? 'bg-slate-500' : 'bg-orange-400'}`
        ]">
        {{ playing ? '停止' : '播放' }}
      </button>
    </view>

    <view class="col-span-2 flex flex-col px-2">
      <view class="w-full flex flex-col">
        <text class="w-full text-right text-xs">文字大小({{ fontsize }})</text>

        <slider
          value="1"
          @change="sliderChangeText"
          step="5"
          activeColor="#FFCC33"
          backgroundColor="rgb(100 116 139)"
          block-color="rgb(251 146 60)"
          block-size="20" />
      </view>
      <view class="w-full flex flex-col">
        <text class="w-full text-right text-xs">
          速度快慢({{ speedValue }})
        </text>
        <slider
          value="1"
          @change="sliderChangeSpeed"
          step="1"
          activeColor="#FFCC33"
          backgroundColor="rgb(100 116 139)"
          block-color="rgb(251 146 60)"
          block-size="20" />
      </view>
    </view>
  </bottom-control>
</template>

<script setup lang="ts">
import BottomControl from '@/components/BottomControl.vue'

const props = defineProps<{
  play: () => void
  stop: () => void
  playing: boolean
  onChangeSpeed: (x: number) => void
  onChangeFontSize: (x: number) => void
  speedValue: number
  fontsize: number
}>()

const systemInfo = ref(uni.getSystemInfoSync())

const sliderChangeText = (e: { detail: { value: string } }) => {
  const _v = parseInt(e.detail.value) > 0 ? parseInt(e.detail.value) : 1
  props.onChangeFontSize(_v)
  console.log('txtSize value 发生变化：' + e.detail.value)
}

const sliderChangeSpeed = (e: { detail: { value: string } }) => {
  const _v = parseInt(e.detail.value) > 0 ? parseInt(e.detail.value) : 1
  props.onChangeSpeed(_v)
  console.log('speed value 发生变化：' + e.detail.value)
}

const onButtonClick = () => {
  props.playing ? props.stop() : props.play()
}
</script>
