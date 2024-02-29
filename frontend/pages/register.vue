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
async function register() {
  const response = await $fetch(`${API}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  }).catch((e) => {
    if (e.data) {
      alert(
        e.data.error.issues.reduce((acc, issue) => {
          return acc + issue.message + "\n";
        }, [])
      );
    } else {
      alert("An error occurred");
    }
  });
  if (response) {
    await navigateTo("/login");
  }
}
</script>
<template>
  <h1>Register</h1>
  <form @submit.prevent="register">
    <input v-model="form.username" type="text" placeholder="Username" />
    <input v-model="form.password" type="password" placeholder="Password" />
    <button type="submit">Register</button>
  </form>
  <NuxtLink to="/">>Login </NuxtLink>
</template>
