<template>
  <Card>
    <NuxtLink :to="`/dashboard/meeting/${id}`" class="card-content">
      <i class="bi bi-calendar4-event"></i>
      <h1>{{ date }}</h1>
      <i class="bi bi-chevron-right"></i>
    </NuxtLink>
  </Card>
</template>

<script lang="ts">
const months = [
  "Sty",
  "Lut",
  "Mar",
  "Kwi",
  "Maj",
  "Cze",
  "Lip",
  "Sie",
  "Wrz",
  "Paź",
  "Lis",
  "Gru",
];

export default {
  props: {
    id: { type: String, required: true },
    startsAt: { type: Number, required: true },
  },
  setup(props) {
    const start = new Date(props.startsAt);
    return {
      date: `${
        months[start.getMonth()]
      } ${start.getDate()}, ${start.getFullYear()}`,
    };
  },
};
</script>

<style lang="less" scoped>
@import "@/assets/colors.less";

h1 {
  color: @text;
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  line-height: 100px;
}

.card-content {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: auto 1fr 34px;
  text-align: left;
  line-height: 100px;
  color: @text;
  text-decoration: none;
  .bi-calendar4-event {
    padding-left: 15px;
    padding-right: 15px;
    -webkit-text-stroke: 1px @text;
    font-size: 24px;
  }
  .bi-chevron-right {
    -webkit-text-stroke: 2px @text;
    font-size: 24px;
  }
  &:hover {
    cursor: pointer;
  }
}
</style>
