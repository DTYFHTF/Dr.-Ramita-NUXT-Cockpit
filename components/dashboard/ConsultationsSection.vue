<template>
  <div>
    <div v-if="loading" class="text-center my-5">
      <span class="spinner-border text-primary"></span>
    </div>
    <div v-else-if="error" class="alert alert-danger text-center">{{ error }}</div>
    <div v-else-if="consultations.length === 0" class="empty-state">
      <LucideIcon icon="mdi:calendar-blank" :size="64" class="mb-3 text-muted" />
      <p class="text-muted mb-3">No consultations found.</p>
      <NuxtLink to="/doctors" class="btn btn-smooth-success">
        <LucideIcon icon="mdi:plus-circle" :size="18" class="me-2" />
        Book a Consultation
      </NuxtLink>
    </div>
    <div v-else>
  <div class="table-responsive rounded-4 shadow-sm p-3 dashboard-panel dashboard-table">
        <table class="table align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Doctor</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="consultation in consultations" :key="consultation.id">
              <td class="fw-semibold">#{{ consultation.id }}</td>
              <td>
                <div class="doctor-info">
                  <div class="doctor-name">{{ getDoctorName(consultation) }}</div>
                </div>
              </td>
              <td>
                <div class="datetime-info">
                  <div class="date-text">{{ formatDate(consultation.scheduled_at_utc) }}</div>
                  <div class="time-text">{{ formatTime(consultation) }}</div>
                </div>
              </td>
              <td>
                <span :class="['status-badge', getStatusClass(consultation.status)]">
                  {{ formatStatus(consultation.status) }}
                </span>
              </td>
              <td>
                <span :class="['payment-badge', getPaymentClass(consultation.status)]">
                  {{ getPaymentStatus(consultation.status) }}
                </span>
              </td>
              <td>
                <button 
                  @click="viewDetails(consultation)" 
                  class="btn btn-sm btn-smooth-outline p-2"
                  :title="`View consultation #${consultation.id} details`"
                >
                  <LucideIcon icon="mdi:eye" :size="16" class="me-1" />
                  Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Details Modal -->
    <BaseModal 
      v-if="selectedConsultation" 
      :show="showDetailsModal" 
      @close="closeDetailsModal"
      title="Consultation Details"
    >
      <div class="consultation-details">
        <div class="detail-row">
          <span class="detail-label">Consultation ID:</span>
          <span class="detail-value">#{{ selectedConsultation.id }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Doctor:</span>
          <span class="detail-value">{{ getDoctorName(selectedConsultation) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Date & Time:</span>
          <span class="detail-value">
            {{ formatDate(selectedConsultation.scheduled_at_utc) }} at {{ formatTime(selectedConsultation) }}
          </span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Patient Name:</span>
          <span class="detail-value">{{ selectedConsultation.patient_name }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email:</span>
          <span class="detail-value">{{ selectedConsultation.patient_email }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Phone:</span>
          <span class="detail-value">{{ selectedConsultation.patient_phone }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Status:</span>
          <span :class="['status-badge', getStatusClass(selectedConsultation.status)]">
            {{ formatStatus(selectedConsultation.status) }}
          </span>
        </div>
        <div v-if="selectedConsultation.notes" class="detail-row">
          <span class="detail-label">Notes:</span>
          <span class="detail-value">{{ selectedConsultation.notes }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Booked on:</span>
          <span class="detail-value">{{ formatDate(selectedConsultation.created_at) }}</span>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { format, parseISO } from 'date-fns'
import LucideIcon from '@/components/LucideIcon.vue'
import BaseModal from '@/components/BaseModal.vue'

interface Consultation {
  id: number
  user_id: number
  doctor_id: number
  date: string
  scheduled_at_utc: string
  patient_name: string
  patient_email: string
  patient_phone: string
  patient_timezone: string
  doctor_timezone: string
  duration?: {
    start: string
    end: string
  }
  notes?: string
  status: string
  created_at: string
  updated_at: string
  doctor?: {
    id: number
    name: string
  }
}

const userStore = useUserStore()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase

const consultations = ref<Consultation[]>([])
const loading = ref(true)
const error = ref('')
const showDetailsModal = ref(false)
const selectedConsultation = ref<Consultation | null>(null)

const fetchConsultations = async () => {
  loading.value = true
  error.value = ''
  try {
    const result = await $fetch<{ data: Consultation[] }>(`${apiBase}/consultations`, {
      headers: { Authorization: `Bearer ${userStore.token}` }
    })
    consultations.value = result.data || []
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || 'Failed to fetch consultations.'
  } finally {
    loading.value = false
  }
}

const getDoctorName = (consultation: Consultation): string => {
  return consultation.doctor?.name || `Doctor #${consultation.doctor_id}`
}

const formatDate = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy')
  } catch {
    return dateString
  }
}

const formatTime = (consultation: Consultation): string => {
  if (consultation.duration?.start) {
    const [hours, minutes] = consultation.duration.start.split(':')
    const hour = parseInt(hours, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }
  try {
    return format(parseISO(consultation.scheduled_at_utc), 'h:mm a')
  } catch {
    return 'N/A'
  }
}

const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'pending': 'Pending',
    'pending_payment': 'Awaiting Payment',
    'confirmed': 'Confirmed',
    'completed': 'Completed',
    'cancelled': 'Cancelled',
    'no_show': 'No Show'
  }
  return statusMap[status] || status
}

const getStatusClass = (status: string): string => {
  const classMap: Record<string, string> = {
    'pending': 'status-pending',
    'pending_payment': 'status-warning',
    'confirmed': 'status-success',
    'completed': 'status-completed',
    'cancelled': 'status-cancelled',
    'no_show': 'status-cancelled'
  }
  return classMap[status] || 'status-pending'
}

const getPaymentStatus = (status: string): string => {
  if (status === 'pending_payment') return 'Pending'
  if (status === 'confirmed' || status === 'completed') return 'Paid'
  if (status === 'cancelled') return 'Refunded/Cancelled'
  return 'N/A'
}

const getPaymentClass = (status: string): string => {
  if (status === 'pending_payment') return 'payment-pending'
  if (status === 'confirmed' || status === 'completed') return 'payment-success'
  return 'payment-default'
}

const viewDetails = (consultation: Consultation) => {
  selectedConsultation.value = consultation
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedConsultation.value = null
}

onMounted(fetchConsultations)
</script>

<style scoped lang="scss">
/* Component-specific adjustments kept minimal; core table/panel styles moved to global `main.scss` */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--background-white);

  :deep(svg) {
    opacity: 0.5;
    color: var(--text-secondary);
  }

  p {
    color: var(--text-secondary);
  }
}


.consultation-details {
  .detail-row {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--border-color);

    &:last-child {
      border-bottom: none;
    }

    .detail-label {
      font-weight: 600;
      color: var(--text-secondary);
      flex-shrink: 0;
      margin-right: 1rem;
    }

    .detail-value {
      color: var(--text-primary);
      text-align: right;
      flex: 1;
    }
  }
}


.btn{
  color: var(--color-primary);
}

</style>
