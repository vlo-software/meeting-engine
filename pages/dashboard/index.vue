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

<script lang="ts">
import { ref } from "vue";
import { IMeeting } from "@/database/models/meeting";

export default {
  head: {
    title: "Dashboard",
  },
  setup() {
    const meetings = ref<IMeeting[]>([
      {
        _id: null as any,
        startsAt: new Date().getTime(),
        endsAt: new Date().getTime(),
        teachers: [],
        hours: [],
      },
      {
        _id: null as any,
        startsAt: new Date().getTime(),
        endsAt: new Date().getTime(),
        teachers: [],
        hours: [],
      },
      {
        _id: null as any,
        startsAt: new Date().getTime(),
        endsAt: new Date().getTime(),
        teachers: [],
        hours: [],
      },
    ]);

    return { meetings };
  },
};
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
