<template>
  <n-layout>
    <n-layout-header bordered class="layout-header header-height">
      <n-grid cols="2" class="header-height">
        <n-grid-item class="flex items-center justify-start mr-1.5">
          <div>left</div>
        </n-grid-item>

        <n-grid-item class="flex items-center justify-end mr-1.5">
          <div>right</div>
        </n-grid-item>
      </n-grid>
    </n-layout-header>
  </n-layout>
</template>

<script setup lang="ts"></script>

<style lang="css" scoped>
.header-height {
  min-height: var(--header-height);
}
</style>
