<template>
  <div class="content">
    <NuxtLink to="/dashboard">
      <SchoolLogo size="100" />
    </NuxtLink>
    <h1>ID naucznika: {{ $route.params.teacher }}</h1>

    <Card v-for="booking in bookings" :key="booking.user">
      <div :class="booking.user ? 'card-content' : 'card-content booking-free'">
        <h3>{{ booking.user || "Wolny termin" }}</h3>
        <h3 class="hour">{{ booking.hour }}</h3>
      </div>
    </Card>
  </div>
</template>

<script lang="ts">
type Booking = {
  user?: string;
  hour: string;
  free: boolean;
};

export default {
  setup() {
    const bookings = ref<Booking[]>([
      { user: "Pat i mat", hour: "6:00 PM", free: false },
      { user: undefined, hour: "6:10 PM", free: true },
      { user: "Pateusz Max", hour: "6:20 PM", free: false },
    ]);

    return {
      bookings,
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
