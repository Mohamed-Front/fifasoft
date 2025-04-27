<script setup>
import { FilterMatchMode } from 'primevue/api'
import { ref, onMounted, onBeforeMount, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import axios from "axios"
import { useRouter } from "vue-router"

const router = useRouter()
const toast = useToast()

// Data and UI states
const loading = ref(true)
const user = ref({
  name: '',
  permissions: []
})
const roles = ref([])
const permissions = ref([])
const deleteDialog = ref(false)
const createDialog = ref(false)
const updateDialog = ref(false)
const selectedRoles = ref(null)
const dt = ref(null)
const filters = ref({})
const submitted = ref(false)
const deleteId = ref(null)
const searchQuery = ref('')

// Filter related variables
const governorates = ref([])
const statuses = ref([
  { id: '0', name: 'Inactive' },
  { id: '1', name: 'Active' }
])
const selectedGovernorate = ref(null)
const selectedStatus = ref(null)
const dateRange = ref(null)

// Pagination variables
const currentPage = ref(1)
const totalRecords = ref(0)
const rowsPerPage = ref(10)
const totalPages = ref(0)

// Initialize filters
const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  }
}

// Build filter payload
const buildFilterPayload = () => {
  const payload = {
    search: searchQuery.value,
    filters: []
  }

  // Add governorate filter if selected
  if (selectedGovernorate.value) {
    payload.filters.push({
      id: 'governorate_id',
      value: selectedGovernorate.value.id
    })
  }

  // Add status filter if selected
  if (selectedStatus.value) {
    payload.filters.push({
      id: 'status',
      value: selectedStatus.value.id
    })
  }

  // Add date range filter if selected
  if (dateRange.value && dateRange.value.length === 2) {
    const [startDate, endDate] = dateRange.value
    payload.filters.push({
      id: 'created_at',
      value: startDate.toISOString().split('T')[0],
      expression: 'GreaterThanOrEqual'
    })
    payload.filters.push({
      id: 'created_at',
      value: endDate.toISOString().split('T')[0],
      expression: 'LessThanOrEqual'
    })
  }

  return payload
}

// Fetch roles data with pagination and filters
const fetchData = () => {
  loading.value = true
  const filterPayload = buildFilterPayload()

  axios.get("/api/roles", {
    params: {
      page: currentPage.value,
      per_page: rowsPerPage.value,
      ...filterPayload
    }
  }).then((res) => {
    roles.value = res.data.data
    totalRecords.value = res.data.meta.total
    totalPages.value = res.data.meta.last_page
    loading.value = false
  }).catch(error => {
    loading.value = false
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load roles',
      life: 3000
    })
  })
}

// Fetch governorates
const fetchGovernorates = () => {
  axios.get("/api/Lookup/CountryList").then((res) => {
    governorates.value = res.data.data
  }).catch(error => {
    console.error("Error fetching governorates:", error)
  })
}

// Fetch permissions
const fetchPermissions = () => {
  axios.get("/api/permissions").then((res) => {
    permissions.value = res.data.data
  }).catch(error => {
    console.error("Error fetching permissions:", error)
  })
}

// Reset all filters
const resetFilters = () => {
  searchQuery.value = ''
  selectedGovernorate.value = null
  selectedStatus.value = null
  dateRange.value = null
  currentPage.value = 1
  fetchData()
}

// Pagination functions
const onPageChange = (event) => {
  currentPage.value = event.page + 1
  rowsPerPage.value = event.rows
  fetchData()
}

// Watchers for filter changes
watch([searchQuery, selectedGovernorate, selectedStatus, dateRange], () => {
  currentPage.value = 1
  fetchData()
}, { deep: true })

// CRUD operations
const openNew = () => {
  user.value = { name: '', permissions: [] }
  submitted.value = false
  createDialog.value = true
}

const hideDialog = () => {
  createDialog.value = false
  updateDialog.value = false
  submitted.value = false
}

const createRole = () => {
  submitted.value = true
  axios.post('/api/roles', user.value)
    .then(() => {
      fetchData()
      createDialog.value = false
      toast.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Role created successfully',
        life: 3000
      })
    })
    .catch(error => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data?.message || 'Failed to create role',
        life: 3000
      })
    })
}

const editRole = (role) => {
  user.value = { ...role }
  updateDialog.value = true
}

const updateRole = () => {
  submitted.value = true
  axios.put(`/api/roles/${user.value.id}`, user.value)
    .then(() => {
      fetchData()
      updateDialog.value = false
      toast.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Role updated successfully',
        life: 3000
      })
    })
    .catch(error => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data?.message || 'Failed to update role',
        life: 3000
      })
    })
}

const confirmDelete = (id) => {
  deleteId.value = id
  deleteDialog.value = true
}

const deleteRole = () => {
  axios.delete(`/api/roles/${deleteId.value}`)
    .then(() => {
      fetchData()
      deleteDialog.value = false
      toast.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Role deleted successfully',
        life: 3000
      })
    })
    .catch(error => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data?.message || 'Failed to delete role',
        life: 3000
      })
    })
}

const exportCSV = () => {
  dt.value.exportCSV()
}

// Initialize component
onBeforeMount(() => {
  initFilters()
})

onMounted(() => {
  fetchData()
  fetchPermissions()
  fetchGovernorates()
})
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-4 shadow-2 border-round">
        <Toolbar class="mb-4">
          <template #start>
            <h2 class="text-2xl font-bold">{{ $t("role.manage_roles") }}</h2>
          </template>

          <template #end>
            <div class="flex gap-2">
              <Button
                v-can="'create roles'"
                :label='$t("role.new_role")'
                icon="pi pi-plus"
                class="p-button-success"
                @click="openNew"
              />
              <Button
                :label='$t("export")'
                icon="pi pi-download"
                class="p-button-help"
                @click="exportCSV"
                :disabled="!roles || roles.length === 0"
              />
            </div>
          </template>
        </Toolbar>

        <!-- Filter Panel -->
        <div class="p-fluid p-4 mb-4 surface-100 border-round">
          <div class="grid">
            <div class="col-12 md:col-3">
              <label for="search">{{ $t("search") }}</label>
              <InputText
                id="search"
                v-model="searchQuery"
                :placeholder='$t("search_placeholder")'
                class="w-full"
              />
            </div>

            <div class="col-12 md:col-3">
              <label for="governorate">{{ $t("governorate") }}</label>
              <Dropdown
                id="governorate"
                v-model="selectedGovernorate"
                :options="governorates"
                optionLabel="name"
                optionValue="id"
                :placeholder='$t("select_governorate")'
                class="w-full"
                :showClear="true"
              />
            </div>

            <div class="col-12 md:col-3">
              <label for="status">{{ $t("status") }}</label>
              <Dropdown
                id="status"
                v-model="selectedStatus"
                :options="statuses"
                optionLabel="name"
                optionValue="id"
                :placeholder='$t("select_status")'
                class="w-full"
                :showClear="true"
              />
            </div>

            <div class="col-12 md:col-3">
              <label for="dateRange">{{ $t("date_range") }}</label>
              <Calendar
                id="dateRange"
                v-model="dateRange"
                selectionMode="range"
                :manualInput="false"
                dateFormat="yy-mm-dd"
                :showIcon="true"
                :showButtonBar="true"
                class="w-full"
                :placeholder='$t("select_date_range")'
              />
            </div>

            <div class="col-12 flex justify-content-end mt-3">
              <Button
                :label='$t("reset_filters")'
                icon="pi pi-filter-slash"
                class="p-button-outlined p-button-secondary"
                @click="resetFilters"
              />
            </div>
          </div>
        </div>

        <Toast />

        <DataTable
          ref="dt"
          v-model:selection="selectedRoles"
          :value="roles"
          :loading="loading"
          data-key="id"
          :paginator="true"
          :rows="rowsPerPage"
          :totalRecords="totalRecords"
          :filters="filters"
          paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rows-per-page-options="[5,10,25,50]"
          current-page-report-template="Showing {first} to {last} of {totalRecords} entries"
          responsive-layout="scroll"
          stripedRows
          showGridlines
          class="p-datatable-sm"
          v-can="'list roles'"
          @page="onPageChange"
        >
          <template #empty>
            <div class="text-center py-4">
              <i class="pi pi-exclamation-circle text-2xl mb-2" />
              <p class="text-xl">No roles found</p>
            </div>
          </template>

          <template #loading>
            <div class="flex justify-content-center align-items-center py-4">
              <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
            </div>
          </template>

          <Column selection-mode="multiple" header-style="width: 3rem"></Column>

          <Column field="id" :header='$t("role.id")' :sortable="true" header-style="width:10%; min-width:5rem;">
            <template #body="slotProps">
              <span class="font-medium">{{ slotProps.data.id }}</span>
            </template>
          </Column>

          <Column field="name" :header='$t("role.name")' :sortable="true" header-style="width:20%; min-width:10rem;">
            <template #body="slotProps">
              <span class="font-medium">{{ slotProps.data.name }}</span>
            </template>
          </Column>

          <Column field="permissions_count" :header='$t("role.permissions")' :sortable="true" header-style="width:15%;">
            <template #body="slotProps">
              <Tag :value="slotProps.data.permissions_count" severity="info" />
            </template>
          </Column>

          <Column field="created_at" :header='$t("created_at")' :sortable="true" header-style="width:15%;">
            <template #body="slotProps">
              {{ new Date(slotProps.data.created_at).toLocaleDateString() }}
            </template>
          </Column>

          <Column header-style="width:15%; min-width:10rem;" :header='$t("actions")'>
            <template #body="slotProps">
              <div class="flex gap-2">
                <Button
                  v-can="'edit roles'"
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-success p-button-sm"
                  @click="editRole(slotProps.data)"
                  v-tooltip.top="'Edit'"
                />
                <Button
                  v-can="'delete roles'"
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-danger p-button-sm"
                  @click="confirmDelete(slotProps.data.id)"
                  v-tooltip.top="'Delete'"
                />
              </div>
            </template>
          </Column>
        </DataTable>

        <!-- Create Role Dialog -->
        <Dialog v-model:visible="createDialog" :style="{ width: '450px' }" :header='$t("role.create_role")' :modal="true">
          <div class="p-fluid">
            <div class="field mb-4">
              <label for="name">{{ $t("role.name") }}</label>
              <InputText
                id="name"
                v-model.trim="user.name"
                required="true"
                autofocus
                :class="{ 'p-invalid': submitted && !user.name }"
                class="w-full"
              />
              <small class="p-error" v-if="submitted && !user.name">Name is required.</small>
            </div>

            <div class="field">
              <label>{{ $t("role.permissions") }}</label>
              <MultiSelect
                v-model="user.permissions"
                :options="permissions"
                optionLabel="name"
                optionValue="id"
                placeholder="Select Permissions"
                display="chip"
                class="w-full"
              />
            </div>
          </div>

          <template #footer>
            <Button
              :label='$t("cancel")'
              icon="pi pi-times"
              class="p-button-text"
              @click="hideDialog"
            />
            <Button
              :label='$t("save")'
              icon="pi pi-check"
              class="p-button-text"
              @click="createRole"
            />
          </template>
        </Dialog>

        <!-- Update Role Dialog -->
        <Dialog v-model:visible="updateDialog" :style="{ width: '450px' }" :header='$t("role.update_role")' :modal="true">
          <div class="p-fluid">
            <div class="field mb-4">
              <label for="name">{{ $t("role.name") }}</label>
              <InputText
                id="name"
                v-model.trim="user.name"
                required="true"
                autofocus
                :class="{ 'p-invalid': submitted && !user.name }"
                class="w-full"
              />
              <small class="p-error" v-if="submitted && !user.name">Name is required.</small>
            </div>

            <div class="field">
              <label>{{ $t("role.permissions") }}</label>
              <MultiSelect
                v-model="user.permissions"
                :options="permissions"
                optionLabel="name"
                optionValue="id"
                placeholder="Select Permissions"
                display="chip"
                class="w-full"
              />
            </div>
          </div>

          <template #footer>
            <Button
              :label='$t("cancel")'
              icon="pi pi-times"
              class="p-button-text"
              @click="hideDialog"
            />
            <Button
              :label='$t("update")'
              icon="pi pi-check"
              class="p-button-text"
              @click="updateRole"
            />
          </template>
        </Dialog>

        <!-- Delete Confirmation Dialog -->
        <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" :header='$t("confirm")' :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color: var(--red-500)" />
            <span>{{ $t("role.delete_confirmation") }}</span>
          </div>
          <template #footer>
            <Button
              :label='$t("no")'
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteDialog = false"
            />
            <Button
              :label='$t("yes")'
              icon="pi pi-check"
              class="p-button-text p-button-danger"
              @click="deleteRole"
            />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles for better table display */
:deep(.p-datatable) {
  font-size: 0.9rem;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #f8f9fa;
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.2rem;
  letter-spacing: 0.5px;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  transition: background-color 0.2s;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: #f0f4f8 !important;
}

/* Filter panel styles */
.filter-panel {
  background-color: #f8f9fa;
  border-radius: 6px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

/* Responsive adjustments */
@media screen and (max-width: 960px) {
  :deep(.p-datatable) {
    overflow-x: auto;
    display: block;
  }

  .filter-panel .p-fluid .grid > div {
    padding-bottom: 1rem;
  }
}

/* Button spacing */
.p-button {
  margin-right: 0.5rem;
}

/* Multiselect styling */
:deep(.p-multiselect) {
  width: 100%;
}

/* Dialog footer buttons */
:deep(.p-dialog-footer .p-button) {
  min-width: 6rem;
}
</style>
