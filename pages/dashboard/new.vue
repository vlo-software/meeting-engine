<template>
  <div class="content">
    <NuxtLink to="/dashboard">
      <SchoolLogo size="100" />
    </NuxtLink>
    <h1>Stwórz zebranie</h1>
    <Card>
      <div class="card-content">
        <h3>Data zebrania</h3>
        <input type="date" v-model="date" />
        <h3>Godzina</h3>
        <div>
          <input type="time" v-model="start" />
          <input type="time" v-model="end" />
        </div>
        <h3>Nauczyciele</h3>
        <div class="teachers">
          <div v-for="teacher in teachers" :key="teacher.name" class="teacher">
            <p>{{ teacher.name }}</p>
            <input type="checkbox" v-model="teacher.active" />
          </div>
        </div>
      </div>
    </Card>
    <button @click="addMeeting()">Dodaj</button>
  </div>
</template>

<script setup lang="ts">
useMeta({ title: "Dodaj zebranie" });

const router = useRouter();

const { data } = await useFetch("http://localhost:3000/api/teachers");

const teachers = ref(
  (data.value as any[]).map(({ id, name }) => ({
    id,
    name,
    active: true,
  }))
);

const date = ref(new Date().toISOString().substring(0, 10));
const start = ref(new Date().toISOString().substring(11, 16));
const end = ref(new Date().toISOString().substring(11, 16));

const addMeeting = async () => {
  const [startHours, startMinutes] = start.value
    .split(":")
    .map((e) => parseInt(e));
  const [endHours, endMinutes] = end.value.split(":").map((e) => parseInt(e));
  const startsAt = new Date(date.value);
  const endsAt = new Date(date.value);

  startsAt.setHours(startHours, startMinutes);
  endsAt.setHours(endHours, endMinutes);

  await fetch("/api/admin/meetings", {
    method: "post",
    headers: {
      authorization:
        "adf eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiaWF0IjoxNjM2MjQzODY2LCJleHAiOjE2MzY0MTY2NjZ9.DDXwuun-RfJOdt22Q5h9skljWL_WeN2vDclxUyefMZg",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      startsAt: startsAt.getTime(),
      endsAt: endsAt.getTime(),
      teacherIds: teachers.value
        .filter((teacher) => teacher.active)
        .map((teacher) => teacher.id),
    }),
  });

  router.push("/dashboard");
};
</script>

<style lang="less" scoped>
@import "@/assets/index.less";

input[type="time"] {
  width: calc(50% - 28px);
  &:first-child {
    margin-right: 4px;
  }
  &:last-child {
    margin-left: 4px;
  }
}

.teachers {
  margin-top: -10px;
  max-height: 190px;
  overflow-x: hidden;
  overflow-y: auto;
}

.teacher {
  display: grid;
  grid-template-columns: 1fr 30px;
  border: solid 2px #e8e8e8;
  background: #e8e8e8;
  border-radius: 10px;
  padding: 10px;
  height: 30px;
  font-family: "Poppins", sans-serif;
  font-weight: 700;
  color: @text;
  line-height: 30px;
  margin: 10px 0;
  &:first-child {
    margin-top: 4px;
  }
  &:last-child {
    margin-bottom: 4px;
  }
  p {
    margin: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 270px;
  }
}

.card-content {
  margin: 0 20px 1.6em 20px;
  text-align: left;
}
</style>
