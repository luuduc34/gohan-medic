<template>
  <div class="login-register-page">
    <div class="left">
      <LoginForm />
    </div>
    <div class="right">
      <RegisterForm />
    </div>
  </div>
</template>
  
  <script>
  import LoginForm from "@/components/Auth/LoginForm.vue";
  import RegisterForm from "@/components/Auth/RegisterForm.vue";
  
  export default {
    name: "AuthPage",
    components: {
      LoginForm,
      RegisterForm,
    },
  };
  </script>

<style scoped>
.login-register-page {
  display: flex;
  gap: 2rem;
}
.left, .right {
  flex: 1;
}
</style>