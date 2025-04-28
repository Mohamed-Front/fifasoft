<template>
  <nav class="bg-[var(--mainColor)] h-[66px] flex justify-between items-center p-6">
    <div class="flex justify-start items-center gap-4">
      <i class="pi pi-align-justify it before:font-bold menu"></i>
      <h1 class="text-[var(--sideColor)] text-[1.2rem] font-bold">{{ t('pages.Home') }}</h1>
    </div>
    <div class="flex justify-evenly items-center gap-2">
      <div>
        <LocaleSelect id="local-switcher" class="lang"></LocaleSelect>
      </div>
      <div><i class="pi pi-moon text-[var(--sideColor)] meni"></i></div>
      <div><i class="pi pi-sign-out text-[var(--sideColor)] meni"></i></div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import LocaleSelect from '../LocaleSelect.vue';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

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
</style>
