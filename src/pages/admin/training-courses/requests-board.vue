<script setup>
import { useToast } from 'primevue/usetoast';
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const toast = useToast();

// State variables
const loading = ref(true);
const requests = ref([]);
const delete_id = ref('');
const deleteDialog = ref(false);
const dt = ref(null);
const filters = ref({});
const searchQuery = ref('');
const selectedProducts = ref(null);
const exportLoading = ref(false);
const printLoading = ref(false);

// Pagination variables
const currentPage = ref(1);
const totalRecords = ref(0);
const rowsPerPage = ref(10);
const totalPages = ref(0);

// Initialize filters
const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
};

// Fetch data
const fetchData = () => {
  loading.value = true;

  axios.get('/api/Course/RequestsManagement', {
    params: {
      Index: currentPage.value,
      Size: rowsPerPage.value,
      search: searchQuery.value || undefined
    }
  })
  .then((res) => {
    loading.value = false;
    requests.value = res.data.data.list;
    totalRecords.value = res.data.data.total;
    totalPages.value = res.data.data.pagesCount;
  })
  .catch((error) => {
    loading.value = false;
    console.error('Error fetching data:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load requests', life: 3000 });
  });
};

// Watch for changes in search query
watch(searchQuery, () => {
  currentPage.value = 1;
  fetchData();
});

// Export to CSV
const exportCSV = () => {
  exportLoading.value = true;
  dt.value.exportCSV();
  setTimeout(() => {
    exportLoading.value = false;
  }, 1000);
};

// Print table
const printTable = () => {
  printLoading.value = true;
  const printContents = document.querySelector('.p-datatable-wrapper').cloneNode(true);
  const originalContents = document.body.innerHTML;

  // Remove action buttons from print
  const actionButtons = printContents.querySelectorAll('.p-button')
  actionButtons.forEach(button => button.remove())

  // Create print window
  const printWindow = window.open('', '_blank')
  printWindow.document.write(`
    <html>
      <head>
        <title>Course Requests Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #f5f5f5; text-align: left; padding: 8px; border: 1px solid #ddd; }
          td { padding: 8px; border: 1px solid #ddd; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          @page { size: auto; margin: 5mm; }
          @media print {
            body { margin: 0; padding: 0; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        <h1>Course Requests Report</h1>
        ${printContents.innerHTML}
        <div style="text-align: center; margin-top: 20px; font-size: 12px;">
          Generated on ${new Date().toLocaleString()}
        </div>
      </body>
    </html>
  `)

  printWindow.document.close()
  printWindow.focus()
  setTimeout(() => {
    printWindow.print()
    printWindow.close()
    printLoading.value = false
  }, 500)
}

// Lifecycle hooks
onMounted(() => {
  fetchData();
  initFilters();
});

// Delete request
const confirmDelete = (id) => {
  delete_id.value = id;
  deleteDialog.value = true;
};

const deleteRequest = () => {
  axios.delete(`/api/Course/RequestsManagement/${delete_id.value}`)
    .then(() => {
      fetchData();
      deleteDialog.value = false;
      toast.add({ severity: 'success', summary: 'Successful', detail: 'Request Deleted', life: 3000 });
    })
    .catch((error) => {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete request', life: 3000 });
    });
};

// View details
const viewDetails = (id) => {
  router.push({ name: 'request-details', params: { id } });
};

// Get status severity
const getStatusSeverity = (status) => {
  switch (status) {
    case 0: return 'info';     // Under processing
    case 2: return 'danger';   // Rejected
    default: return 'success'; // Completed
  }
};
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-4 shadow-2 border-round">
        <Toolbar class="mb-4">
          <template #start>
            <h2 class="text-2xl font-bold">  ادارة الطلبات</h2>
          </template>

          <template #end>
            <div class="flex gap-2">
              <Button :label="'طباعة'" icon="pi pi-print" class="p-button-help no-print" :loading="printLoading" @click="printTable" />
              <Button :label="'تصدير'" icon="pi pi-download" class="p-button-info no-print" :loading="exportLoading" @click="exportCSV" />
            </div>
          </template>
        </Toolbar>

        <Toast />

        <div class="card shadow-1 surface-0">
          <DataTable
            ref="dt"
            :value="requests"
            :loading="loading"
            data-key="id"
            :paginator="true"
            :rows="rowsPerPage"
            :filters="filters"
            :totalRecords="totalRecords"
            paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rows-per-page-options="[5,10,20,30]"
            current-page-report-template="عرض {first} إلى {last} من {totalRecords} طلب"
            responsive-layout="scroll"
            scrollable
            scroll-height="flex"
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

            <Column selection-mode="multiple" header-style="width: 3rem"></Column>

            <Column field="referenceNumber" header="رقم المرجع" :sortable="true">
              <template #body="slotProps">
                <span class="font-medium">{{ slotProps.data.referenceNumber }}</span>
              </template>
            </Column>

            <Column field="createdDate" header="تاريخ الطلب" :sortable="true">
              <template #body="slotProps">
                {{ new Date(slotProps.data.createdDate).toLocaleDateString() }}
              </template>
            </Column>

            <Column field="fullName" header="اسم مقدم الطلب" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.fullName }}
              </template>
            </Column>

            <Column field="accountTypeName" header="نوع الحساب" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.accountTypeName }}
              </template>
            </Column>

            <Column field="courseName" header="الدورة التدريبية" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.courseName }}
              </template>
            </Column>

            <Column field="requestTypeName" header="نوع الطلب" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.requestTypeName }}
              </template>
            </Column>

            <Column field="requestStatusName" header="حالة الطلب" :sortable="true">
              <template #body="slotProps">
                <Tag :value="slotProps.data.requestStatusName" :severity="getStatusSeverity(slotProps.data.requestStatus)" />
              </template>
            </Column>

            <Column header="الإجراءات">
              <template #body="slotProps">
                <Button
                  icon="pi pi-eye"
                  class="p-button-rounded p-button-info mr-2"
                  @click="viewDetails(slotProps.data.id)"
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

        <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" :header="'تأكيد'" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color: var(--red-500)" />
            <span>هل أنت متأكد أنك تريد حذف هذا الطلب؟</span>
          </div>
          <template #footer>
            <Button :label="'لا'" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false" />
            <Button :label="'نعم'" icon="pi pi-check" class="p-button-text p-button-danger" @click="deleteRequest" />
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

/* Print-specific styles */
@media print {
  .no-print {
    display: none !important;
  }

  :deep(.p-datatable) {
    font-size: 10pt;
    width: 100%;
  }

  :deep(.p-datatable .p-datatable-thead > tr > th),
  :deep(.p-datatable .p-datatable-tbody > tr > td) {
    padding: 4px 6px;
  }
}
</style>
