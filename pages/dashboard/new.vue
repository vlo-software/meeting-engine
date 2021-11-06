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
            {{ teacher.name }}
            <input type="checkbox" v-model="teacher.active" />
          </div>
        </div>
      </div>
    </Card>
    <button @click="addMeeting()">Dodaj</button>
  </div>
</template>

<script lang="ts">
type Teacher = {
  name: string;
  active: boolean;
};

export default {
  head: {
    title: "Dodaj zebranie",
  },
  setup() {
    const teachers = ref<Teacher[]>(
      Array(20)
        .fill(0)
        .map((_, idx) => ({
          active: true,
          name: `Naucznik ${idx}`,
        }))
    );
    const date = ref(new Date().toISOString().substring(0, 10));
    const start = ref(new Date().toISOString().substring(11, 16));
    const end = ref(new Date().toISOString().substring(11, 16));

    const addMeeting = () => {
      const [startHours, startMinutes] = start.value
        .split(":")
        .map((e) => parseInt(e));
      const [endHours, endMinutes] = end.value
        .split(":")
        .map((e) => parseInt(e));
      const startsAt = new Date(date.value);
      const endsAt = new Date(date.value);

      startsAt.setHours(startHours, startMinutes);
      endsAt.setHours(endHours, endMinutes);

      console.log(startsAt);
      console.log(endsAt);
    };

    return {
      teachers,
      start,
      end,
      date,
      addMeeting,
    };
  },
};
</script>

<style lang="less" scoped>
@import "@/assets/index.less";

h1 {
  font-weight: 800;
  font-size: 36px;
  color: @text;
}

input[type="checkbox"] {
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  margin: 3px;
  width: 24px;
  height: 24px;
  border: 0;
  background: #c4c4c4;
  border-radius: 100%;
  &:checked {
    background: darken(@tertiary, 30%);
    background-image: url("data:image/svg+xml;base64,PCEtLSBHZW5lcmF0ZWQgYnkgSWNvTW9vbi5pbyAtLT4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjQ0OCIgaGVpZ2h0PSI0NDgiIHZpZXdCb3g9IjAgMCA0NDggNDQ4Ij4KPHRpdGxlPjwvdGl0bGU+CjxnIGlkPSJpY29tb29uLWlnbm9yZSI+CjwvZz4KPHBhdGggZD0iTTQxNy43NSAxNDEuNWMwIDYuMjUtMi41IDEyLjUtNyAxN2wtMjE1IDIxNWMtNC41IDQuNS0xMC43NSA3LTE3IDdzLTEyLjUtMi41LTE3LTdsLTEyNC41LTEyNC41Yy00LjUtNC41LTctMTAuNzUtNy0xN3MyLjUtMTIuNSA3LTE3bDM0LTM0YzQuNS00LjUgMTAuNzUtNyAxNy03czEyLjUgMi41IDE3IDdsNzMuNSA3My43NSAxNjQtMTY0LjI1YzQuNS00LjUgMTAuNzUtNyAxNy03czEyLjUgMi41IDE3IDdsMzQgMzRjNC41IDQuNSA3IDEwLjc1IDcgMTd6Ij48L3BhdGg+Cjwvc3ZnPgo=");
    background-repeat: no-repeat;
    background-position: 4px 4px;
    background-size: 16px 16px;
    filter: invert(1) hue-rotate(180deg);
  }
}

input[type="date"],
input[type="time"] {
  user-select: none;
  border: solid 2px #e8e8e8;
  background: #e8e8e8;
  border-radius: 10px;
  padding: 10px;
  height: 30px;
  font-family: "Poppins", sans-serif;
  font-weight: 700;
  color: @text;
  outline-color: @text;
  // Fix on iOS devices
  -webkit-appearance: textfield;
  -moz-appearance: textfield;
}

input[type="date"] {
  width: calc(100% - 20px);
}

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
}

.card-content {
  margin: 0 20px 1.6em 20px;
  text-align: left;
}
</style>
