<script setup>
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
    useCookie("token", response.access_token);
    await navigateTo("/validated");
  }
}
</script>
<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />
  </NuxtLayout>
</template>
