<script setup>
const userObj = useUserObj().value;
if (userObj.isLoggedIn) {
  navigateTo("/validated");
}
const API = useRuntimeConfig().public.API;
const form = reactive({
  username: "",
  password: "",
});
async function login() {
  const response = await $fetch(`${API}/users/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  }).catch((e) => {
    if (e.data) {
      alert(e.data.message);
    } else {
      alert("An error occurred");
    }
  });
  if (response) {
    const userObj = useUserObj();
    userObj.value = { ...response, isLoggedIn: true };
    const token = useCookie("token");
    token.value = response.access_token;
    await navigateTo("/validated");
  }
}
</script>
<template>
  <h1>Signin</h1>
  <form @submit.prevent="login">
    <input v-model="form.username" type="text" placeholder="Username" />
    <input v-model="form.password" type="password" placeholder="Password" />
    <button type="submit">Signin</button>
  </form>
  <NuxtLink to="/register">>Register </NuxtLink>
</template>
