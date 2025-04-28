<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const router = useRouter();
const toast = useToast();
const { t } = useI18n();

// Reactive references
const form = ref();
const loading = ref(false);
const isDragging = ref(false);
const paymentWays = ref([]);
const categories = ref([]);

// Form Data
const serviceData = ref({
  nameAr: '',
  nameEn: '',
  shortDescriptionAr: '',
  shortDescriptionEn: '',
  descriptionAr: '',
  descriptionEn: '',
  applySummaryAr: '',
  applySummaryEn: '',
  requiredDocumentsAr: '',
  requiredDocumentsEn: '',
  applyConditionsAr: '',
  applyConditionsEn: '',
  outputsAr: '',
  outputsEn: '',
  durationAr: '',
  durationEn: '',
  targetGroupAr: '',
  targetGroupEn: '',
  categoryId: null,
  contactInfo: '',
  attendanceType: 0,
  isPaid: false,
  isActive: true,
  paymentWays: [],
  iconFile: null,
  videoFile: null,
  userManualFile: null,
});

// Preview URLs
const iconPreview = ref(null);
const videoPreview = ref(null);
const userManualPreview = ref(null);

// Handle drag events
const handleDragOver = (event) => {
  event.preventDefault();
  isDragging.value = true;
};

const handleDragLeave = () => {
  isDragging.value = false;
};

// Handle file upload
const handleFileUpload = (file, type) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    if (type === 'icon') {
      serviceData.value.iconFile = file;
      iconPreview.value = e.target.result;
    } else if (type === 'video') {
      serviceData.value.videoFile = file;
      videoPreview.value = e.target.result;
    } else if (type === 'manual') {
      serviceData.value.userManualFile = file;
      userManualPreview.value = e.target.result;
    }
  };
  reader.readAsDataURL(file);
  isDragging.value = false;
};

const onFileUpload = (event, type) => {
  const file = event.target.files?.[0] || event.dataTransfer?.files?.[0];
  if (file) {
    if (type === 'icon' && file.type.match('image.*')) {
      handleFileUpload(file, 'icon');
    } else if (type === 'video' && file.type.match('video.*')) {
      handleFileUpload(file, 'video');
    } else if (type === 'manual') {
      handleFileUpload(file, 'manual');
    }
  }
};

// Remove file
const removeFile = (type) => {
  if (type === 'icon') {
    serviceData.value.iconFile = null;
    iconPreview.value = null;
  } else if (type === 'video') {
    serviceData.value.videoFile = null;
    videoPreview.value = null;
  } else if (type === 'manual') {
    serviceData.value.userManualFile = null;
    userManualPreview.value = null;
  }
};

// Get service details
const getServiceDetails = () => {
  axios
    .get(`/api/EServices/EServicDetails?id=${router.currentRoute.value.params.id}`)
    .then((res) => {
      const data = res.data.data;
      Object.assign(serviceData.value, {
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        shortDescriptionAr: data.shortDescriptionAr,
        shortDescriptionEn: data.shortDescriptionEn,
        descriptionAr: data.descriptionAr,
        descriptionEn: data.descriptionEn,
        applySummaryAr: data.applySummaryAr,
        applySummaryEn: data.applySummaryEn,
        requiredDocumentsAr: data.requiredDocumentsAr,
        requiredDocumentsEn: data.requiredDocumentsEn,
        applyConditionsAr: data.applyConditionsAr,
        applyConditionsEn: data.applyConditionsEn,
        outputsAr: data.outputsAr,
        outputsEn: data.outputsEn,
        durationAr: data.durationAr,
        durationEn: data.durationEn,
        targetGroupAr: data.targetGroupAr,
        targetGroupEn: data.targetGroupEn,
        categoryId: data.categoryId,
        contactInfo: data.contactInfo,
        attendanceType: data.attendanceType,
        isPaid: data.isPaid,
        isActive: data.isActive,
        paymentWays: data.paymentWays.map((p) => p.id),
      });

      // Set preview URLs
      if (data.icon) iconPreview.value = data.icon;
      if (data.video) videoPreview.value = data.video;
      if (data.userManualDocument) userManualPreview.value = data.userManualDocument;
    })
    .catch((error) => {
      console.error('Error fetching service details:', error);
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: error.response?.data?.message || 'Failed to load service details',
        life: 3000,
      });
    });
};

// Submit form
const submitForm = async () => {
  loading.value = true;
  const formData = new FormData();

  // Append all text fields
  Object.keys(serviceData.value).forEach((key) => {
    formData.append(key, serviceData.value[key]);
  });

  // Append payment ways
  serviceData.value.paymentWays.forEach((way) => {
    formData.append('paymentWays[]', way);
  });

  // Append files if they exist
  if (serviceData.value.iconFile) {
    formData.append('icon', serviceData.value.iconFile);
  }
  if (serviceData.value.videoFile) {
    formData.append('video', serviceData.value.videoFile);
  }
  if (serviceData.value.userManualFile) {
    formData.append('userManualDocument', serviceData.value.userManualFile);
  }

  axios
    .put(`/api/EServices/Update?id=${router.currentRoute.value.params.id}`, formData)
    .then((response) => {
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: 'Service updated successfully',
        life: 3000,
      });
      router.push({ name: 'e-services' });
    })
    .catch((error) => {
      console.error('Error:', error);
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: error.response?.data?.message || 'Failed to update service',
        life: 3000,
      });
      loading.value = false;
    });
};

onMounted(() => {
  getServiceDetails();
});
</script>
<template>
  <div v-can="'edit e-services'" class="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">{{$t("e_service.edit_service")}}</h1>

    <form @submit.prevent="submitForm" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Arabic Name -->
        <div class="space-y-2">
          <label for="nameAr" class="block text-sm font-medium text-gray-700">
            {{$t("e_service.name_ar")}} <span class="text-red-500">*</span>
          </label>
          <InputText
            id="nameAr"
            v-model="serviceData.nameAr"
            :placeholder='$t("e_service.enter_name_ar")'
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        <!-- English Name -->
        <div class="space-y-2">
          <label for="nameEn" class="block text-sm font-medium text-gray-700">
            {{$t("e_service.name_en")}} <span class="text-red-500">*</span>
          </label>
          <InputText
            id="nameEn"
            v-model="serviceData.nameEn"
            :placeholder='$t("e_service.enter_name_en")'
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        <!-- Arabic Short Description -->
        <div class="space-y-2">
          <label for="shortDescriptionAr" class="block text-sm font-medium text-gray-700">
            {{$t("e_service.short_description_ar")}}
          </label>
          <Textarea
            id="shortDescriptionAr"
            v-model="serviceData.shortDescriptionAr"
            :placeholder='$t("e_service.enter_short_description_ar")'
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        <!-- English Short Description -->
        <div class="space-y-2">
          <label for="shortDescriptionEn" class="block text-sm font-medium text-gray-700">
            {{$t("e_service.short_description_en")}}
          </label>
          <Textarea
            id="shortDescriptionEn"
            v-model="serviceData.shortDescriptionEn"
            :placeholder='$t("e_service.enter_short_description_en")'
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        <!-- Arabic Description -->
        <div class="md:col-span-2 space-y-2">
          <label for="descriptionAr" class="block text-sm font-medium text-gray-700">
            {{$t("e_service.description_ar")}}
          </label>
          <Editor v-model="serviceData.descriptionAr" editorStyle="height: 200px">
            <template v-slot:toolbar>
              <span class="ql-formats">
                <button class="ql-bold"></button>
                <button class="ql-italic"></button>
                <button class="ql-underline"></button>
                <button class="ql-strike"></button>
                <button class="ql-list" value="ordered"></button>
                <button class="ql-list" value="bullet"></button>
                <button class="ql-link"></button>
              </span>
            </template>
          </Editor>
        </div>

        <!-- English Description -->
        <div class="md:col-span-2 space-y-2">
          <label for="descriptionEn" class="block text-sm font-medium text-gray-700">
            {{$t("e_service.description_en")}}
          </label>
          <Editor v-model="serviceData.descriptionEn" editorStyle="height: 200px">
            <template v-slot:toolbar>
              <span class="ql-formats">
                <button class="ql-bold"></button>
                <button class="ql-italic"></button>
                <button class="ql-underline"></button>
                <button class="ql-strike"></button>
                <button class="ql-list" value="ordered"></button>
                <button class="ql-list" value="bullet"></button>
                <button class="ql-link"></button>
              </span>
            </template>
          </Editor>
        </div>

        <!-- Arabic Apply Summary -->
        <div class="md:col-span-2 space-y-2">
          <label for="applySummaryAr" class="block text-sm font-medium text-gray-700">
            {{$t("e_service.apply_summary_ar")}}
          </label>
          <Editor v-model="serviceData.applySummaryAr" editorStyle="height: 200px">
            <template v-slot:toolbar>
              <span class="ql-formats">
                <button class="ql-bold"></button>
                <button class="ql-italic"></button>
                <button class="ql-underline"></button>
                <button class="ql-strike"></button>
                <button class="ql-list" value="ordered"></button>
                <button class="ql-list" value="bullet"></button>
                <button class="ql-link"></button>
              </span>
            </template>
          </Editor>
        </div>

        <!-- English Apply Summary -->
        <div class="md:col-span-2 space-y-2">
          <label for="applySummaryEn" class="block text-sm font-medium text-gray-700">
            {{$t("e_service.apply_summary_en")}}
          </label>
          <Editor v-model="serviceData.applySummaryEn" editorStyle="height: 200px">
            <template v-slot:toolbar>
              <span class="ql-formats">
                <button class="ql-bold"></button>
                <button class="ql-italic"></button>
                <button class="ql-underline"></button>
                <button class="ql-strike"></button>
                <button class="ql-list" value="ordered"></button>
                <button class="ql-list" value="bullet"></button>
                <button class="ql-link"></button>
              </span>
            </template>
          </Editor>
        </div>

        <!-- Arabic Required Documents -->
        <div class="md:col-span-2 space-y-2">
          <label for="requiredDocumentsAr" class="block text-sm font-medium text-gray-700">
            {{$t("e_service.required_documents_ar")}}
          </label>
          <Editor v-model="serviceData.requiredDocumentsAr" editorStyle="height: 200px">
            <template v-slot:toolbar>
              <span class="ql-formats">
                <button class="ql-bold"></button>
                <button class="ql-italic"></button>
                <button class="ql-underline"></button>
                <button class="ql-strike"></button>
                <button class="ql-list" value="ordered"></button>
                <button class="ql-list" value="bullet"></button>
                <button class="ql-link"></button>
              </span>
            </template>
          </Editor>
        </div>

        <!-- English Required Documents -->
        <div class="md:col-span-2 space-y-2">
          <label for="requiredDocumentsEn" class="block text-sm font-medium text-gray-700">
            {{$t("e_service.required_documents_en")}}
          </label>
          <Editor v-model="serviceData.requiredDocumentsEn" editorStyle="height: 200px">
            <template v-slot:toolbar>
              <span class="ql-formats">
                <button class="ql-bold"></button>
                <button class="ql-italic"></button>
                <button class="ql-underline"></button>
                <button class="ql-strike"></button>
                <button class="ql-list" value="ordered"></button>
                <button class="ql-list" value="bullet"></button>
                <button class="ql-link"></button>
              </span>
            </template>
          </Editor>
        </div>

        <!-- Arabic Apply Conditions -->
        <div class="md:col-span-2 space-y-2">
          <label for="applyConditionsAr" class="block text-sm font-medium text-gray-700">
            {{$t("e_service.apply_conditions_ar")}}
          </label>
          <Editor v-model="serviceData.applyConditionsAr" editorStyle="height: 200px">
            <template v-slot:toolbar>
              <span class="ql-formats">
                <button class="ql-bold"></button>
                <button class="ql-italic"></button>
                <button class="ql-underline"></button>
                <button class="ql-strike"></button>
                <button class="ql-list" value="ordered"></button>
                <button class="ql-list" value="bullet"></button>
                <button class="ql-link"></button>
              </span>
            </template>
          </Editor>
        </div>

        <!-- English Apply Conditions -->
        <div class="md:col-span-2 space-y-2">
          <label for="applyConditionsEn" class="block text-sm font-medium text-gray-700">
            {{$t("e_service.apply_conditions_en")}}
          </label>
          <Editor v-model="serviceData.applyConditionsEn" editorStyle="height: 200px">
            <template v-slot:toolbar>
              <span class="ql-formats">
                <button class="ql-bold"></button>
                <button class="ql-italic"></button>
                <button class="ql-underline"></button>
                <button class="ql-strike"></button>
                <button class="ql-list" value="ordered"></button>
                <button class="ql-list" value="bullet"></button>
                <button class="ql-link"></button>
              </span>
            </template>
          </Editor>
        </div>

        <!-- Arabic Outputs -->
        <div class="md:col-span-2 space-y-2">
          <label for="outputsAr" class="block text-sm font-medium text-gray-700">
            {{$t("e_service.outputs_ar")}}
          </label>
          <Editor v-model="serviceData.outputsAr" editorStyle="height: 200px">
            <template v-slot:toolbar>
              <span class="ql-formats">
                <button class="ql-bold"></button>
                <button class="ql-italic"></button>
                <button class="ql-underline"></button>
                <button class="ql-strike"></button>
                <button class="ql-list" value="ordered"></button>
                <button class="ql-list" value="bullet"></button>
                <button class="ql-link"></button>
              </span>
            </template>
          </Editor>
        </div>

        <!-- English Outputs -->
        <div class="md:col-span-2 space-y-2">
          <label for="outputsEn" class="block text-sm font-medium text-gray-700">
            {{$t("e_service.outputs_en")}}
          </label>
          <Editor v-model="serviceData.outputsEn" editorStyle="height: 200px">
            <template v-slot:toolbar>
              <span class="ql-formats">
                <button class="ql-bold"></button>
                <button class="ql-italic"></button>
                <button class="ql-underline"></button>
                <button class="ql-strike"></button>
                <button class="ql-list" value="ordered"></button>
                <button class="ql-list" value="bullet"></button>
                <button class="ql-link"></button>
              </span>
            </template>
          </Editor>
        </div>

        <!-- Arabic Duration -->
        <div class="space-y-2">
          <label for="durationAr" class="block text-sm font-medium text-gray-700">
            {{$t("e_service.duration_ar")}}
          </label>
          <InputText
            id="durationAr"
            v-model="serviceData.durationAr"
            :placeholder='$t("e_service.enter_duration_ar")'
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        <!-- English Duration -->
        <div class="space-y-2">
          <label for="durationEn" class="block text-sm font-medium text-gray-700">
            {{$t("e_service.duration_en")}}
          </label>
          <InputText
            id="durationEn"
            v-model="serviceData.durationEn"
            :placeholder='$t("e_service.enter_duration_en")'
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        <!-- Arabic Target Group -->
        <div class="space-y-2">
          <label for="targetGroupAr" class="block text-sm font-medium text-gray-700">
            {{$t("e_service.target_group_ar")}}
          </label>
          <InputText
            id="targetGroupAr"
            v-model="serviceData.targetGroupAr"
            :placeholder='$t("e_service.enter_target_group_ar")'
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        <!-- English Target Group -->
        <div class="space-y-2">
          <label for="targetGroupEn" class="block text-sm font-medium text-gray-700">
            {{$t("e_service.target_group_en")}}
          </label>
          <InputText
            id="targetGroupEn"
            v-model="serviceData.targetGroupEn"
            :placeholder='$t("e_service.enter_target_group_en")'
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>



        <!-- Contact Info -->
        <div class="space-y-2">
          <label for="contactInfo" class="block text-sm font-medium text-gray-700">
            {{$t("e_service.contact_info")}}
          </label>
          <InputText
            id="contactInfo"
            v-model="serviceData.contactInfo"
            :placeholder='$t("e_service.enter_contact_info")'
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        <!-- Attendance Type -->
        <div class="space-y-2">
          <label for="attendanceType" class="block text-sm font-medium text-gray-700">
            {{$t("e_service.attendance_type")}}
          </label>
          <Dropdown
            id="attendanceType"
            v-model="serviceData.attendanceType"
            :options="[
              { label: 'Physical', value: 0 },
              { label: 'Electronic', value: 1 },
              { label: 'Both', value: 2 }
            ]"
            optionLabel="label"
            optionValue="value"
            :placeholder='$t("e_service.select_attendance_type")'
            class="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>



        <!-- Is Paid -->
        <div class="flex items-center space-x-2">
          <Checkbox v-model="serviceData.isPaid" inputId="isPaid" :binary="true" />
          <label for="isPaid" class="text-sm font-medium text-gray-700">{{$t("e_service.is_paid")}}</label>
        </div>

        <!-- Is Active -->
        <div class="flex items-center space-x-2">
          <Checkbox v-model="serviceData.isActive" inputId="isActive" :binary="true" />
          <label for="isActive" class="text-sm font-medium text-gray-700">{{$t("e_service.is_active")}}</label>
        </div>

        <!-- Icon Upload -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">{{$t("e_service.icon")}}</label>
          <div class="flex justify-center">
            <label
              @dragover.prevent="handleDragOver"
              @dragleave="handleDragLeave"
              @drop.prevent="(e) => onFileUpload(e, 'icon')"
              :class="{'border-blue-500 bg-blue-50': isDragging, 'border-gray-300': !isDragging}"
              class="cursor-pointer w-full rounded-xl border-2 border-dashed transition-colors duration-300"
            >
              <input type="file" @change="(e) => onFileUpload(e, 'icon')" accept="image/*" class="hidden">

              <div v-if="iconPreview" class="p-4">
                <div class="relative group">
                  <img
                    :src="iconPreview"
                    alt="Icon Preview"
                    class="w-full h-40 object-contain rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                  >
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 rounded-lg">
                    <button
                      type="button"
                      @click.stop="removeFile('icon')"
                      class="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                    >
                      <i class="pi pi-trash text-sm"></i>
                    </button>
                  </div>
                </div>
                <p class="mt-2 text-center text-sm text-gray-500">{{$t("e_service.click_or_drag_to_change")}}</p>
              </div>

              <div v-else class="p-8 flex flex-col items-center justify-center">
                <div class="bg-blue-100 p-4 rounded-full mb-4">
                  <i class="pi pi-image text-blue-500 text-2xl"></i>
                </div>
                <p class="text-sm text-center text-gray-600 mb-1">
                  <span class="text-blue-500 font-medium">{{$t("e_service.click_to_upload")}}</span> {{$t("e_service.or_drag_and_drop")}}
                </p>
                <p class="text-xs text-gray-400">SVG, PNG, JPG (max. 1MB)</p>
              </div>
            </label>
          </div>
        </div>

        <!-- Video Upload -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">{{$t("e_service.video")}}</label>
          <div class="flex justify-center">
            <label
              @dragover.prevent="handleDragOver"
              @dragleave="handleDragLeave"
              @drop.prevent="(e) => onFileUpload(e, 'video')"
              :class="{'border-blue-500 bg-blue-50': isDragging, 'border-gray-300': !isDragging}"
              class="cursor-pointer w-full rounded-xl border-2 border-dashed transition-colors duration-300"
            >
              <input type="file" @change="(e) => onFileUpload(e, 'video')" accept="video/*" class="hidden">

              <div v-if="videoPreview" class="p-4">
                <div class="relative group">
                  <video
                    :src="videoPreview"
                    controls
                    class="w-full h-40 object-contain rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                  ></video>
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 rounded-lg">
                    <button
                      type="button"
                      @click.stop="removeFile('video')"
                      class="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                    >
                      <i class="pi pi-trash text-sm"></i>
                    </button>
                  </div>
                </div>
                <p class="mt-2 text-center text-sm text-gray-500">{{$t("e_service.click_or_drag_to_change")}}</p>
              </div>

              <div v-else class="p-8 flex flex-col items-center justify-center">
                <div class="bg-blue-100 p-4 rounded-full mb-4">
                  <i class="pi pi-video text-blue-500 text-2xl"></i>
                </div>
                <p class="text-sm text-center text-gray-600 mb-1">
                  <span class="text-blue-500 font-medium">{{$t("e_service.click_to_upload")}}</span> {{$t("e_service.or_drag_and_drop")}}
                </p>
                <p class="text-xs text-gray-400">MP4, MOV (max. 5MB)</p>
              </div>
            </label>
          </div>
        </div>

        <!-- User Manual Upload -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">{{$t("e_service.user_manual")}}</label>
          <div class="flex justify-center">
            <label
              @dragover.prevent="handleDragOver"
              @dragleave="handleDragLeave"
              @drop.prevent="(e) => onFileUpload(e, 'manual')"
              :class="{'border-blue-500 bg-blue-50': isDragging, 'border-gray-300': !isDragging}"
              class="cursor-pointer w-full rounded-xl border-2 border-dashed transition-colors duration-300"
            >
              <input type="file" @change="(e) => onFileUpload(e, 'manual')" class="hidden">

              <div v-if="userManualPreview" class="p-4">
                <div class="relative group">
                  <div class="w-full h-40 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
                    <i class="pi pi-file-pdf text-5xl text-red-500 mb-2"></i>
                    <p class="text-sm text-gray-600">{{$t("e_service.document_uploaded")}}</p>
                  </div>
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 rounded-lg">
                    <button
                      type="button"
                      @click.stop="removeFile('manual')"
                      class="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                    >
                      <i class="pi pi-trash text-sm"></i>
                    </button>
                  </div>
                </div>
                <p class="mt-2 text-center text-sm text-gray-500">{{$t("e_service.click_or_drag_to_change")}}</p>
              </div>

              <div v-else class="p-8 flex flex-col items-center justify-center">
                <div class="bg-blue-100 p-4 rounded-full mb-4">
                  <i class="pi pi-file text-blue-500 text-2xl"></i>
                </div>
                <p class="text-sm text-center text-gray-600 mb-1">
                  <span class="text-blue-500 font-medium">{{$t("e_service.click_to_upload")}}</span> {{$t("e_service.or_drag_and_drop")}}
                </p>
                <p class="text-xs text-gray-400">PDF, DOC, DOCX (max. 5MB)</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="pt-4 flex justify-center">
        <Button
          type="submit"
          :label="$t('e_service.update_service')"
          icon="pi pi-save"
          :loading="loading"
          class="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
          :disabled="loading"
        >
          <span v-if="!loading">{{$t("e_service.update_service")}}</span>
          <i v-else class="pi pi-spinner pi-spin"></i>
        </Button>
      </div>
    </form>
  </div>
  <Toast/>
</template>

<style scoped>
/* Smooth transitions */
.transition-all {
  transition-property: all;
}
.transition-colors {
  transition-property: background-color, border-color, color;
}
.duration-300 {
  transition-duration: 300ms;
}

/* Custom scrollbar for dropdowns */
:deep(.p-dropdown-panel .p-dropdown-items-wrapper) {
  scrollbar-width: thin;
  scrollbar-color: #3b82f6 #f1f1f1;
}
:deep(.p-dropdown-panel .p-dropdown-items-wrapper::-webkit-scrollbar) {
  width: 6px;
}
:deep(.p-dropdown-panel .p-dropdown-items-wrapper::-webkit-scrollbar-track) {
  background: #f1f1f1;
  border-radius: 3px;
}
:deep(.p-dropdown-panel .p-dropdown-items-wrapper::-webkit-scrollbar-thumb) {
  background-color: #3b82f6;
  border-radius: 3px;
}
</style>
