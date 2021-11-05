<template>
  <div class="card">
    <div class="card-inner">
      <slot />
    </div>
  </div>
</template>


<style lang="less" scoped>
.card {
  display: block;
}
.card-inner {
  padding: 0 10px;
  display: inline-block;
  width: calc(100% - 80px);
  max-width: 380px;
  background: white;
  margin: 10px 20px;
  border-radius: 10px;
}
</style>
