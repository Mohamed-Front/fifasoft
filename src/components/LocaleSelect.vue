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
  <Button
    @click="changeLocale"
    class="language-button mx-4"
    :pt="{
      root: { class: 'p-button-text' }
    }"
  >
    <div class="language-option">
      <span class="language-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
        </svg>
      </span>
      <span>{{ currentLanguage.code.toUpperCase() }}</span>
    </div>
  </Button>
</template>

<style scoped>
.language-button {
  min-width: 70px;
  background: #fbfbfb !important;
  border: 0px solid #7C7B7B;
  border-radius: 50% ;
  color: #1976d2 !important;
  padding: .5rem .4rem;

}

.language-button:hover {

  background: #d2d9de !important;
}



.language-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.language-icon {
  display: flex;
  align-items: center;
}

.language-icon svg {
  width: 1.25rem;
  height: 1.25rem;
}

/* RTL specific styles */
[dir="rtl"] .language-button {
  font-family: 'Tahoma', 'Arial', sans-serif;
}
</style>
