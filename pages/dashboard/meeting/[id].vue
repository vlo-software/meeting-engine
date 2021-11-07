<template>
  <div class="content">
    <NuxtLink to="/dashboard">
      <SchoolLogo size="100" />
    </NuxtLink>
    <h1>Wybierz naucznika</h1>

    <Card v-for="teacher in teachers" :key="teacher.teacherName">
      <NuxtLink
        :to="`/dashboard/bookings/${$route.params.id}/${teacher._id}`"
        class="card-content"
      >
        <h3>{{ teacher.teacherName }}</h3>
        <i class="bi bi-chevron-right"></i>
      </NuxtLink>
    </Card>

    <button class="btn-red" @click="remove()">Usuń zebranie</button>
  </div>
</template>

<script setup lang="ts">
import { ITeacher } from "~~/database/models/meeting";

const route = useRoute();
const router = useRouter();

const teachers = ref<ITeacher[]>([]);

const remove = async () => {
  await fetch(`/api/admin/meetings/${route.params.id}`, {
    method: "delete",
    headers: {
      authorization:
        "adf eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiaWF0IjoxNjM2MjQzODY2LCJleHAiOjE2MzY0MTY2NjZ9.DDXwuun-RfJOdt22Q5h9skljWL_WeN2vDclxUyefMZg",
      "content-type": "application/json",
    },
  });
  router.push("/dashboard");
};

onMounted(async () => {
  const res = await fetch(
    `http://localhost:3000/api/admin/meetings/${route.params.id}`,
    {
      headers: {
        authorization:
          "adf eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiaWF0IjoxNjM2MjQzODY2LCJleHAiOjE2MzY0MTY2NjZ9.DDXwuun-RfJOdt22Q5h9skljWL_WeN2vDclxUyefMZg",
      },
    }
  );
  teachers.value = (await res.json()).meeting.teachers;
});
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
