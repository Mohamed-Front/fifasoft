<template>
  <va-accordion v-model="accordionValue" class="sidebar-accordion va-sidebar__menu__inner mainbar" multiple>
    <div class="w-[65%] m-auto mb-6"><img src="../../../assets/logo-dark.webp" alt=""></div>
    <va-collapse v-for="(route, idx) in arr" :key="idx">
      <template #header>
        <va-sidebar-item class="onside" :active="isRouteActive(route)"
          :to="route.children ? undefined : { name: route.name }">
          <va-sidebar-item-content>
            <va-icon :name="route.meta.icon" class="va-sidebar-item__icon text-[#757575]" />
            <va-sidebar-item-title class="text-[#757575] truncate">
              {{ t(route.displayName) }}
            </va-sidebar-item-title>
            <va-icon v-if="route.children" :name="accordionValue[idx] ? 'expand_less' : 'expand_more'" class="text-[var(--sideColor)]"/>
          </va-sidebar-item-content>
        </va-sidebar-item>
      </template>

      <va-sidebar-item v-for="(child, index) in route.children" :key="index" :active="isRouteActive(child)"
        :to="{ name: child.name }">
        <va-sidebar-item-content>
          <div class="va-sidebar-item__icon" />
          <va-sidebar-item-title>
            {{ t(child.displayName) }}
          </va-sidebar-item-title>
        </va-sidebar-item-content>
      </va-sidebar-item>

    </va-collapse>
  </va-accordion>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { INavigationRoute } from '../NavigationRoutes'

const { t } = useI18n()
const route = useRoute()

const arr = ref<INavigationRoute[]>([])
const accordionValue = ref<boolean[]>([])

const props = withDefaults(
  defineProps<{
    items?: INavigationRoute[]
  }>(),
  {
    items: () => [],
  },
)

onMounted(() => {
  // ملاحظة: showRoutes حالياً غير مستخدم بالكود, لو ستستخدمه مستقبلاً أضفه ضمن العمليات.
  const showRoutes = JSON.parse(localStorage.getItem('userPermissions') || '[]')
  arr.value = props.items
})

function isRouteActive(item: INavigationRoute) {
  return item.name === route.name
}

function isItemExpanded(item: INavigationRoute): boolean {
  if (!item.children) {
    return false
  }
  const isCurrentItemActive = isRouteActive(item)
  const isChildActive = !!item.children.find((child) =>
    child.children ? isItemExpanded(child) : isRouteActive(child),
  )
  return isCurrentItemActive || isChildActive
}
</script>

<style scoped>
.onside {
  background-color: var(--mainColor);
  margin: 5px;
  border-radius: 10px;
  height: 48px;
  font-size: .9rem;
  font-weight: bold;
  width: 97%;
}
.onside:hover {
  background-color: #dfdfdf;
}

</style>
