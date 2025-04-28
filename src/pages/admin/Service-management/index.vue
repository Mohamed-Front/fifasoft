<script setup>
import { ref, onMounted ,watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();

// State variables
const loading = ref(true);
const services = ref([]);
const deleteDialog = ref(false);
const deleteId = ref(null);
const dt = ref(null);
const filters = ref({});
const searchQuery = ref('');

// Pagination variables
const currentPage = ref(1);
const totalRecords = ref(0);
const rowsPerPage = ref(10);
const totalPages = ref(0);


// Fetch data
const fetchData = () => {
  loading.value = true;

  axios.get('/api/EServices/All', {
    params: {
      pageNumber: currentPage.value,
      pageSize: rowsPerPage.value,
      search: searchQuery.value || undefined
    }
  })
  .then((response) => {
    services.value = response.data.data.list;
    totalRecords.value = response.data.data.total;
    totalPages.value = response.data.data.pagesCount;
    loading.value = false;
  })
  .catch((error) => {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load services',
      life: 3000
    });
    loading.value = false;
    console.error('Error fetching data:', error);
  });
};

// Watch for changes in search query
watch(searchQuery, () => {
  currentPage.value = 1;
  fetchData();
});

// Watch for pagination changes
watch([currentPage, rowsPerPage], () => {
  fetchData();
});

// Delete service
const confirmDelete = (id) => {
  deleteId.value = id;
  deleteDialog.value = true;
};

const deleteService = () => {
  axios.delete(`/api/EServices/${deleteId.value}`)
    .then(() => {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Service deleted successfully',
        life: 3000
      });
      fetchData();
      deleteDialog.value = false;
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete service',
        life: 3000
      });
    });
};

// Navigate to create new service
const createNewService = () => {
  router.push({ name: 'Service-create' });
};

// Navigate to edit service
const editService = (id) => {
  router.push({ name: 'Service-edit', params: { id } });
};

// Get status severity
const getStatusSeverity = (isActive) => {
  return isActive ? 'success' : 'danger';
};

// Lifecycle hooks
onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-4 shadow-2 border-round">
        <Toolbar class="mb-4">
          <template #start>
            <h2 class="text-2xl font-bold">ادارة الخدمات </h2>
          </template>

          <template #end>
            <!-- <Button
              label="إضافة خدمة جديدة"
              icon="pi pi-plus"
              class="p-button-success mr-2"
              @click="createNewService"
            /> -->
          </template>
        </Toolbar>

        <Toast />

        <div class="card shadow-1 surface-0">
          <DataTable
            ref="dt"
            :value="services"
            :loading="loading"
            data-key="id"
            :paginator="true"
            :rows="rowsPerPage"
            :filters="filters"
            :totalRecords="totalRecords"
            paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rows-per-page-options="[5,10,20,30]"
            current-page-report-template="عرض {first} إلى {last} من {totalRecords} خدمة"
            responsive-layout="scroll"
            stripedRows
            showGridlines
            class="p-datatable-sm"
          >
            <template #header>
              <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-3">
                <div class="flex gap-2">
                  <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText v-model="searchQuery" placeholder="ابحث..." class="w-full" />
                  </span>
                  <Button icon="pi pi-refresh" class="p-button-text" @click="fetchData" v-tooltip.top="'Refresh data'" />
                </div>
              </div>
            </template>

            <Column field="code" header="الكود" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.code }}
              </template>
            </Column>

            <Column field="name" header="اسم الخدمة" :sortable="true">
              <template #body="slotProps">
                <span class="font-medium">{{ slotProps.data.name }}</span>
              </template>
            </Column>

            <Column field="categoryName" header="الفئة" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.categoryName }}
              </template>
            </Column>

            <Column field="isActive" header="الحالة" :sortable="true">
              <template #body="slotProps">
                <Tag
                  :value="slotProps.data.isActive ? 'نشط' : 'غير نشط'"
                  :severity="getStatusSeverity(slotProps.data.isActive)"
                />
              </template>
            </Column>

            <Column header="الإجراءات" headerStyle="width: 10rem">
              <template #body="slotProps">
                <Button
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-success mr-2"
                  @click="editService(slotProps.data.id)"
                />

              </template>
            </Column>

            <template #empty>
              <div class="text-center py-4">
                <i class="pi pi-exclamation-circle text-2xl mb-2" />
                <p class="text-xl">لا توجد بيانات</p>
              </div>
            </template>

            <template #loading>
              <div class="flex justify-content-center align-items-center py-4">
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
              </div>
            </template>
          </DataTable>
        </div>

        <Dialog
          v-model:visible="deleteDialog"
          :style="{ width: '450px' }"
          header="تأكيد الحذف"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color: var(--red-500)" />
            <span>هل أنت متأكد أنك تريد حذف هذه الخدمة؟</span>
          </div>
          <template #footer>
            <Button label="لا" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false" />
            <Button label="نعم" icon="pi pi-check" class="p-button-text p-button-danger" @click="deleteService" />
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
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  transition: background-color 0.2s;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: #f0f4f8 !important;
}

/* Responsive adjustments */
@media screen and (max-width: 960px) {
  :deep(.p-datatable) {
    overflow-x: auto;
    display: block;
  }
}
</style>
