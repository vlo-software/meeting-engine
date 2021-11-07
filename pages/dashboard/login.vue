<template>
  <div class="content">
    <NuxtLink to="/dashboard">
      <SchoolLogo size="100" />
    </NuxtLink>
    <h1>Zaloguj się</h1>
    <Card class="login-card">
      <input type="text" placeholder="Login" />
      <input type="password" placeholder="Hasło" />
      <button @click="login()">Zaloguj się</button>
    </Card>
  </div>
</template>

<style lang="less" scoped>
@import "@/assets/index.less";

.login-card {
  input[type="text"],
  input[type="password"] {
    width: calc(100% - 80px);
    margin: 10px 20px;
    max-width: 400px;
  }
  input[type="text"] {
    margin-top: 30px;
  }
  button {
    margin-bottom: 30px;
  }
}
</style>
