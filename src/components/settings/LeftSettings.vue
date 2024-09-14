<template>
  <n-tabs type="segment" animated class="select-none">
    <n-tab-pane name="chat" tab="对话">
      <ChatSettings />
    </n-tab-pane>
    <n-tab-pane name="assistant" tab="助理">
      <AssistantSettings />
    </n-tab-pane>
    <n-tab-pane name="tool" tab="工具">
      <ToolSettings />
    </n-tab-pane>
    <n-tab-pane name="library" tab="文档">
      <LibrarySettings />
    </n-tab-pane>
    <n-tab-pane name="memory" tab="记忆">
      <MemorySettings />
    </n-tab-pane>
    <n-tab-pane name="account" tab="账户">
      <AccountSettings />
    </n-tab-pane>
  </n-tabs>
</template>
