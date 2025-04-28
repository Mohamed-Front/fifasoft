<template>
  <nav class="bg-[var(--mainColor)] h-[66px] flex justify-between items-center p-6">
    <div class="flex justify-start items-center gap-4">
      <i class="pi pi-align-justify it before:font-bold menu"></i>
      <button @click="goBack" class="text-[var(--sideColor)] hover:bg-[var(--hoverColor)] p-2 rounded transition-all">
        <i class="pi pi-arrow-left"></i>
      </button>
      <h1 class="text-[var(--sideColor)] text-[1.2rem] font-bold">{{ t('pages.Home') }}</h1>
    </div>
    <div class="flex justify-evenly items-center gap-2">
      <div>
        <LocaleSelect id="local-switcher" class="lang"></LocaleSelect>
      </div>
      <div @click="toggleDarkMode">
        <i
          class="pi text-[var(--sideColor)] meni"
          :class="darkMode ? 'pi-sun' : 'pi-moon'"
        ></i>
      </div>
      <div @click="logout"><i class="pi pi-sign-out text-[var(--sideColor)] meni"></i></div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import LocaleSelect from '../LocaleSelect.vue';
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/Auth'
const authStore = useAuthStore()

const { t } = useI18n()
const router = useRouter()
const darkMode = ref(false);

// Check for saved user preference or system preference
onMounted(() => {
  const savedMode = localStorage.getItem('darkMode');
  if (savedMode !== null) {
    darkMode.value = savedMode === 'true';
  } else {
    darkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  applyDarkMode();
});

// Toggle dark mode
const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
  localStorage.setItem('darkMode', darkMode.value);
};

// Apply dark mode classes to document
const applyDarkMode = () => {
  if (darkMode.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Watch for changes and apply
watch(darkMode, () => {
  applyDarkMode();
});

const logout = () => {
  authStore.resetAuthStore()
  router.push({ name: 'login' })
  axios
    .post('/api/logout')
    .then((res) => {
      console.log(res.data)
      authStore.resetAuthStore()
      router.push({ name: 'login' })
    })
    .catch(() => {})
}

const goBack = () => {
  router.go(-1)
};
</script>

<style>
.pi {
  font-size: clamp(1rem, 2.5vh, 3rem) !important;
}

.lang {
  padding: 0 !important;
}
i {
  padding: 10px;
  border-radius: 50%;
  transition: all .5s;
}
.menu:hover {
  background-color: var(--hoverColor);
}
.meni:hover {
  background-color: #1976d21e;
}

/* Dark mode styles */
.dark {
  --mainColor: #1a1a1a;
  --sideColor: #f0f0f0;
  --hoverColor: #333333;
}

.dark body {
  background-color: #121212;
  color: #f0f0f0;
}
</style>
