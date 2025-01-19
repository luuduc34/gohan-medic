<template>
  <div id="app">
    <Header />
    <router-view />
    <AppFooter />
  </div>
</template>

<script>
import Header from "@/components/Header/Header.vue";
import AppFooter from "./components/Footer/AppFooter.vue";

export default {
  components: { Header, AppFooter },
};
</script>
