<template>
  <div class="meeting">
    <div class="content">
      <h1>{{date}}</h1>
    </div>
  </div>
</template>

<script lang="ts">
const months = ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"];

export default {
  props: {
    start: { type: Number, required: true },
    end: { type: Number, required: true }
  },
  setup(props) {
    const start = new Date(props.start);
    return {
      date: `${months[start.getMonth()]} ${start.getDate()}, ${start.getFullYear()}`
    };
  }
}
</script>

<style lang="less" scoped>
@import "@/assets/colors.less";

.meeting {
  display: block;
}

.content {
  padding: 0 10px;
  display: inline-block;
  width: calc(100% - 60px);
  height: 100px;
  max-width: 380px;
  background: #fff;
  margin: 10px 20px;
  border-radius: 10px;
}

h1 {
  color: @text;
  margin: 0;
  font-size: 36px;
  font-weight: 700;
  line-height: 100px;
}
</style>
