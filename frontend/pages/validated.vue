<script setup>
const userObj = useUserObj().value;
if (!userObj.isLoggedIn) {
  throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
}
function logout() {
  const userObj = useUserObj();
  userObj.value = { isLoggedIn: false };
  const token = useCookie("token");
  token.value = undefined;
  navigateTo("/");
}
</script>
<template>
  <button @click="logout">logout</button>
</template>
