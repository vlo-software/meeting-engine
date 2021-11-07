<template>
  <div class="content">
    <NuxtLink to="/dashboard">
      <SchoolLogo size="100" />
    </NuxtLink>
    <h1>Witaj z powrotem</h1>
    <h2>Aktualne zebrania</h2>
    <Meeting
      v-for="meeting in meetings"
      :key="meeting._id"
      :id="meeting._id"
      :startsAt="meeting.startsAt"
    />

    <NuxtLink to="/dashboard/new">
      <button>Dodaj zebranie</button>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { IMeeting } from "@/database/models/meeting";

useMeta({
  title: "Dashboard",
});

const meetings = ref<IMeeting[]>([]);

onMounted(async () => {
  const res = await fetch("http://localhost:3000/api/admin/meetings", {
    headers: {
      authorization:
        "adf eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiaWF0IjoxNjM2MjQzODY2LCJleHAiOjE2MzY0MTY2NjZ9.DDXwuun-RfJOdt22Q5h9skljWL_WeN2vDclxUyefMZg",
    },
  });
  meetings.value = await res.json();
});
</script>

<style lang="less" scoped>
@import "@/assets/index.less";

h2 {
  font-weight: 700;
  font-size: 20px;
  color: @secondary;
}

.content {
  // TODO: fix later
  padding-left: 14px;
  overflow-y: scroll;
}
</style>
