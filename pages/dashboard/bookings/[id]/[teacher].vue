<template>
  <div class="content">
    <NuxtLink to="/dashboard">
      <SchoolLogo size="100" />
    </NuxtLink>
    <h1>{{ teacher?.teacherName }}</h1>
    <Card v-for="hour in hours" :key="hour.displayName">
      <div
        :set="
          (booking =
            teacher &&
            teacher.bookings.find((booking) => booking.hourId === hour._id))
        "
      >
        <div :class="booking ? 'card-content' : 'card-content booking-free'">
          <h3>{{ booking?.userName || "Wolny termin" }}</h3>
          <h3 class="hour">{{ hour.displayName }}</h3>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { IHour, IMeeting, ITeacher } from "~~/database/models/meeting";

const route = useRoute();

const hours = ref<IHour[]>();
const teacher = ref<ITeacher>();

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
  const meeting: IMeeting = (await res.json()).meeting;
  hours.value = meeting.hours;
  teacher.value = meeting.teachers.filter(
    (teacher: ITeacher) =>
      (teacher._id as any as string) === route.params.teacher
  )[0];

  console.log(teacher);
});
</script>

<style lang="less" scoped>
@import "@/assets/index.less";

.card-content {
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: auto auto;
  text-align: left;
  height: 70px;
  line-height: 70px;
  color: @text;
  text-decoration: none;
  h3 {
    font-size: 18px;
    margin: 0 10px;
  }
  h3.hour {
    text-align: right;
  }
}

.booking-free {
  color: #c1c1c1;
}
</style>
