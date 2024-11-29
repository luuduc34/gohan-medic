<template>
  <div class="login-register-page">
    <div class="form-container">
      <LoginForm />
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f1f1f1;
}

.form-container {
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 900px;
}
</style>
