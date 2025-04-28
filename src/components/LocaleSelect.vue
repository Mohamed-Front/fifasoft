<script setup>
import { ref, computed } from "vue";
import i18n from "../plugins/i18n";
import { useAppLangStore } from "../stores/AppLangStore";
import Button from 'primevue/button';

const appLang = useAppLangStore();

const languages = ref([
  { name: 'English', code: 'en', dir: 'ltr' },
  { name: 'العربية', code: 'ar', dir: 'rtl' }
]);

const currentLanguage = computed(() => {
  return languages.value.find(lang => lang.code === appLang.appLang) || languages.value[0];
});

const changeLocale = () => {
  const currentIndex = languages.value.findIndex(lang => lang.code === currentLanguage.value.code);
  const nextIndex = (currentIndex + 1) % languages.value.length;
  const newLang = languages.value[nextIndex];

  document.body.dir = newLang.dir;
  i18n.global.locale.value = newLang.code;
  appLang.setAppLang(newLang.code);
  appLang.setAppRtl(newLang.dir === 'rtl');
};
</script>

<template>
  <Button @click="changeLocale" class="language-button" :pt="{
    root: { class: 'p-button-text' }
  }">
    <div class="language-option">
      <span class="language-icon">
        <i class="pi pi-language"></i>
      </span>
      <span class="hidden">{{ currentLanguage.code.toUpperCase() }}</span>
    </div>
  </Button>
</template>

<style scoped>
.language-button {
  background: transparent !important;
  border: none;
  color: #1976d2 !important;
}

.language-icon i {
  padding: 10px;

}
.language-icon i:hover {
  background-color: #1976d21e;
}

/* RTL specific styles */
[dir="rtl"] .language-button {
  font-family: 'Tahoma', 'Arial', sans-serif;
}
</style>
