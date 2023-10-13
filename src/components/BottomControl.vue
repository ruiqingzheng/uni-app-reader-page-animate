<template>
  <view :class="classes" :style="styles">
    <slot></slot>
  </view>
</template>

<script lang="ts" setup>
import { CSSProperties } from 'vue'

const props = defineProps<{
  _class?: string
  _style?: string | CSSProperties
}>()

const classes = computed(() => {
  return `bg-red-500 fixed w-full left-0 bottom-0 z-50 flex justify-between items-center h-16  ${props._class} `
})

const styles = computed(() => {
  const defaultStyle = {
    backgroundColor: 'rgba(255,255,255,0.9)'
  }
  return typeof props._style === 'object' &&
    Object.keys(props._style).length > 0
    ? props._style
    : defaultStyle
})
</script>

<style></style>
