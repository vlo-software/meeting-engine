<template>
  <div class="content">
    <NuxtLink to="/dashboard">
      <SchoolLogo size="100" />
    </NuxtLink>
    <h1>Wybierz naucznika</h1>

    <Card v-for="teacher in teachers" :key="teacher.teacherName">
      <NuxtLink
        :to="`/dashboard/bookings/${$route.params.id}/${teacher.id}`"
        class="card-content"
      >
        <h3>{{ teacher.teacherName }}</h3>
        <i class="bi bi-chevron-right"></i>
      </NuxtLink>
    </Card>

    <button class="btn-red">Usuń zebranie</button>
  </div>
</template>

<script lang="ts">
type Teacher = {
  id: string;
  teacherName: string;
};

export default {
  setup() {
    const teachers = ref<Teacher[]>(
      Array(20)
        .fill(0)
        .map((_, idx) => ({
          id: idx.toString(),
          teacherName: `Naucznik ${idx}`,
        }))
    );

    return {
      teachers,
    };
  },
};
</script>

<style lang="less" scoped>
@import "@/assets/index.less";

.card-content {
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: 1fr 24px;
  text-align: left;
  height: 70px;
  line-height: 70px;
  color: @text;
  text-decoration: none;
  h3 {
    font-size: 18px;
    margin: 0 10px;
  }
  .bi-chevron-right {
    color: @text;
    -webkit-text-stroke: 2px @text;
    font-size: 18px;
  }
  &:hover {
    cursor: pointer;
  }
}

.btn-red {
  margin-top: 20px;
  color: white;
  background: #ff6161;
}

.content {
  // TODO: fix later
  padding-left: 14px;
  overflow-y: scroll;
}
</style>
