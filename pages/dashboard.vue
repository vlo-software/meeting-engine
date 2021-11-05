<template>
  <div class="content">
    <SchoolLogo size="100" />
    <h1>Witaj z powrotem</h1>
    <h2>Aktualne zebrania</h2>
    <Meeting
      v-for="meeting in meetings"
      :key="meeting.start"
      :start="meeting.start"
      :end="meeting.end"
    />
    <button v-on:click="addMeeting()">Dodaj zebranie</button>
  </div>
</template>

<script lang="ts">
import { ref, Ref } from "vue";
import Meeting from "~~/components/Meeting.vue";

interface MeetingInfo {
  start: number;
  end: number;
}

export default {
  components: { Meeting },
  name: "App",
  setup() {
    const meetings: Ref<MeetingInfo[]> = ref([]);

    const addMeeting = () => {
      meetings.value.push({
        start: new Date().getTime(),
        end: new Date().getTime(),
      });
    };
    return {
      meetings,
      addMeeting,
    };
  },
};
</script>

<style lang="less" scoped>
@import "@/assets/colors.less";

h1 {
  font-weight: 800;
  font-size: 36px;
  color: @text;
}

h2 {
  font-weight: 700;
  font-size: 20px;
  color: @secondary;
}

.content {
  display: block;
  padding: 36px 0;
  height: calc(100vh - 36px * 2);
  text-align: center;
  overflow-y: auto;
  overflow-x: hidden;
}

button {
  border: 0;
  padding: 0 10px;
  display: inline-block;
  width: calc(100% - 60px);
  max-width: 400px;
  background: @important;
  margin: 10px 20px;
  border-radius: 10px;
  height: 50px;
  color: @text;
  font-size: 20px;
  font-weight: 900;
  line-height: 50px;
  transition: transform 250ms;
  &:hover {
    cursor: pointer;
  }
  &:active {
    transform: scale(0.96);
  }
}
</style>
