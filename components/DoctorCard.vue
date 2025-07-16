<template>
  <Card 
    :title="doctor.name"
    :description="doctor.bio || `${doctor.experience_years || 0} years experience in ${doctor.specialization || 'General Practice'}`"
    :image="doctorImage"
    :imageAlt="doctor.name"
    :badge="doctor.is_active ? 'Available' : 'Offline'"
    :link="`/doctors/${doctor.slug}`"
    customClass="doctor-card"
  >
    <template #image>
      <img
        :src="doctorImage"
        :alt="doctor.name"
        class="doctor-photo"
        @error="handleImageError"
        style="width:100%;height:auto;object-fit:cover;border-radius:8px;"
      />
    </template>
    <template #meta>
      <div class="doctor-meta">
        <!-- Consultation Modes -->
        <div v-if="doctor.consultation_modes && doctor.consultation_modes.length" class="consultation-modes">
          <span class="modes-label">Modes:</span>
          <div class="modes-list">
            <span 
              v-for="mode in doctor.consultation_modes" 
              :key="mode"
              class="mode-badge"
              :class="`mode-${mode.replace('_', '-')}`"
            >
              <i :class="getModeIcon(mode)"></i>
              {{ formatMode(mode) }}
            </span>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import type { Doctor } from '@/types/index';

interface Props {
  doctor: Doctor;
}

const props = defineProps<Props>();
const emit = defineEmits(['book-consultation']);

// Computed properties
const { getImageUrl } = useImageUrl();
const doctorImage = computed(() => {
  return getImageUrl(props.doctor.photo, '/default-doctor.svg');
});

// Methods
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = '/default-doctor.svg';
};

const viewDoctorProfile = () => {
  navigateTo(`/doctors/${props.doctor.slug}`);
};

const bookConsultation = () => {
  // Navigate to booking page with doctor ID as query parameter
  navigateTo(`/booking?doctor=${props.doctor.id}`);
};

const formatFee = (fee?: number) => {
  if (!fee) return 'N/A';
  return fee.toLocaleString('en-IN');
};

const formatMode = (mode: string) => {
  switch (mode) {
    case 'in_person': return 'In-Person';
    case 'phone': return 'Phone';
    case 'online': return 'Online';
    default: return mode;
  }
};

const getModeIcon = (mode: string) => {
  switch (mode) {
    case 'in_person': return 'fas fa-user-md';
    case 'phone': return 'fas fa-phone';
    case 'online': return 'fas fa-video';
    default: return 'fas fa-stethoscope';
  }
};
</script>

<style lang="scss" scoped>
.doctor-card {
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(var(--color-primary-rgb, 42,77,58), 0.15);
  }
}


// Minimal styles for DoctorCard and consultation modes
.doctor-card {
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(var(--color-primary-rgb, 42,77,58), 0.15);
  }
}

.doctor-meta {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-size: 0.9rem;
}

.consultation-modes {
  .modes-label {
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
    display: block;
  }
  .modes-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }
  .mode-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    background: var(--background-light);
    color: var(--text-primary);
    padding: 0.2rem 0.5rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
    border: 1px solid var(--border-color);
    i {
      font-size: 0.7rem;
    }
    &.mode-online {
      background: #e0f2fe;
      color: #0277bd;
      border-color: #81d4fa;
    }
    &.mode-phone {
      background: #f3e5f5;
      color: #7b1fa2;
      border-color: #ce93d8;
    }
    &.mode-in-person {
      background: #e8f5e8;
      color: #2e7d32;
      border-color: #a5d6a7;
    }
  }
}
</style>
