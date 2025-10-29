<template>
  <div>
    <!-- Show user data -->
    <div v-if="user">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="content-title">Personal Information</h3>
        <button class="btn btn-smooth-primary btn-sm" @click="showProfileEdit = true">
          <LucideIcon icon="mdi:pencil" class="me-1" />
          Change Profile Information
        </button>
      </div>
    
    <div class="profile-avatar-section text-center mb-4">
      <UserAvatar :src="user?.profile_image ?? undefined" size="lg" />
    </div>

    <div class="profile-info-grid">
      <div class="profile-field">
        <label class="field-label">Name</label>
        <div class="field-value">{{ `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Not provided' }}</div>
      </div>
      
      <div class="profile-field">
        <label class="field-label">Date Of Birth</label>
        <div class="field-value">{{ formatDateOfBirth(user?.date_of_birth ?? null) }}</div>
      </div>
      
      <div class="profile-field">
        <label class="field-label">Gender</label>
        <div class="field-value">
          <span v-if="user?.gender">{{ user.gender }}</span>
          <span v-else class="text-muted">Not specified</span>
        </div>
      </div>
      
      <div class="profile-field">
        <label class="field-label">Phone Number</label>
        <div class="field-value">{{ user?.phone || 'Not provided' }}</div>
      </div>
      
      <div class="profile-field">
        <label class="field-label">Email</label>
        <div class="field-value">{{ user?.email || 'Not provided' }}</div>
      </div>
      
      <div class="profile-field" v-if="user?.address">
        <label class="field-label">Address</label>
        <div class="field-value">{{ formatAddress(user.address) }}</div>
      </div>
    </div>

    <!-- Profile Edit Modal -->
    <div v-if="showProfileEdit" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Profile Information</h5>
            <button type="button" class="btn-close" @click="closeProfileEdit"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateProfile">
              <div class="text-center mb-4">
                <UserAvatar :src="(selectedImagePreview || user?.profile_image) ?? undefined" size="lg" />
                <div class="mt-2">
                  <input type="file" ref="avatarInput" @change="handleImageSelect" accept="image/*" style="display: none;">
                  <button type="button" class="btn btn-smooth-outline" @click="triggerAvatarUpload">
                    <LucideIcon icon="mdi:camera" class="me-1" />
                    {{ selectedImageFile ? 'Change Image' : 'Select Image' }}
                  </button>
                  <button v-if="selectedImageFile" type="button" class="btn btn-outline-secondary btn-sm ms-2" @click="clearImageSelection">
                    <LucideIcon icon="mdi:close" class="me-1" />
                    Remove
                  </button>
                </div>
                <div v-if="selectedImageFile" class="text-muted mt-1 small">
                  Image selected: {{ selectedImageFile.name }}
                </div>
                <div v-if="avatarError" class="alert alert-danger mt-2">{{ avatarError }}</div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">First Name *</label>
                  <input type="text" v-model="profileForm.first_name" class="form-input" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Last Name *</label>
                  <input type="text" v-model="profileForm.last_name" class="form-input" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Phone Number</label>
                  <input type="tel" v-model="profileForm.phone" class="form-input">
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Gender</label>
                  <select v-model="profileForm.gender" class="form-input">
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Date of Birth</label>
                  <input type="date" v-model="profileForm.date_of_birth" class="form-input">
                </div>
                <div class="col-12 mb-3">
                  <h6>Address Information</h6>
                </div>
                <div class="col-12 mb-3">
                  <label class="form-label">Address</label>
                  <input type="text" v-model="profileForm.address.address" class="form-input" placeholder="Street address">
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Area</label>
                  <input type="text" v-model="profileForm.address.area" class="form-input">
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">City</label>
                  <input type="text" v-model="profileForm.address.city" class="form-input">
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">State</label>
                  <input type="text" v-model="profileForm.address.state" class="form-input">
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Pincode</label>
                  <input type="text" v-model="profileForm.address.pincode" class="form-input">
                </div>
              </div>
              
              <div v-if="profileEditError" class="alert alert-danger">{{ profileEditError }}</div>
              <div v-if="profileEditSuccess" class="alert alert-success">{{ profileEditSuccess }}</div>
              
              <div class="modal-footer border-0 px-0">
                <button type="button" class="btn btn-secondary" @click="closeProfileEdit">Cancel</button>
                <button type="submit" class="btn btn-smooth-primary" :disabled="profileEditing">
                  <span v-if="profileEditing">Updating...</span>
                  <span v-else>Update Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </div>
    
    <!-- Loading state for when user data is not yet available -->
    <div v-else class="text-center py-4">
      <div v-if="!loadError" class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p v-if="!loadError" class="mt-2 text-muted">Loading user information...</p>
      <div v-if="loadError" class="alert alert-danger">{{ loadError }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import LucideIcon from '@/components/LucideIcon.vue'
import UserAvatar from '@/components/UserAvatar.vue'

const userStore = useUserStore()
const { user, token, hydrated } = storeToRefs(userStore)
const loadError = ref('')

const API_BASE = useRuntimeConfig().public.apiBase

const isUserLoaded = computed(() => {
  return user.value !== null && user.value !== undefined
})

onMounted(async () => {
  try {
    // Wait for hydration to complete, but set a timeout (e.g. 5 seconds)
    const hydrationTimeout = 5000
    let hydratedResolved = false
    if (!hydrated.value) {
      await Promise.race([
        new Promise(resolve => {
          const unwatch = watch(hydrated, (newVal) => {
            if (newVal) {
              hydratedResolved = true
              unwatch()
              resolve(true)
            }
          })
        }),
        new Promise((_, reject) => setTimeout(() => {
          if (!hydratedResolved) reject(new Error('Hydration timeout'))
        }, hydrationTimeout))
      ])
    }

    // Check authentication status after hydration or timeout
    if (!token.value) {
      loadError.value = 'No authentication token found. Please log in again.'
    } else if (!user.value) {
      loadError.value = 'User data not found. Please log in again.'
    }
    // If we have both token and user, we're good to go - no need to fetch
  } catch (e: any) {
    if (e?.message === 'Hydration timeout') {
      loadError.value = 'Failed to load user data (hydration timeout). Please refresh or log in again.'
    } else {
      loadError.value = 'Failed to initialize user profile.'
      console.error('Failed to initialize user profile:', e)
    }
  }
})

// Profile editing
const showProfileEdit = ref(false)
const profileEditing = ref(false)
const profileEditError = ref('')
const profileEditSuccess = ref('')
const profileForm = ref({
  first_name: '',
  last_name: '',
  phone: '',
  gender: '',
  date_of_birth: '',
  address: {
    address: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  }
})

// Avatar upload
const avatarUploading = ref(false)
const avatarError = ref('')
const avatarSuccess = ref('')
const avatarInput = ref<HTMLInputElement>()

// Image selection for profile update
const selectedImageFile = ref<File | null>(null)
const selectedImagePreview = ref<string | null>(null)

// Utility functions
const formatDateOfBirth = (dateString: string | null) => {
  if (!dateString) return 'Not specified'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatAddress = (address: any) => {
  if (!address) return 'Not provided'
  const parts = [
    address.address,
    address.area,
    address.city,
    address.state,
    address.pincode
  ].filter(Boolean)
  return parts.join(', ')
}

// Avatar functions
const triggerAvatarUpload = () => {
  avatarInput.value?.click()
}

const handleImageSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    avatarError.value = 'Please select a valid image file'
    return
  }
  
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    avatarError.value = 'Image size must be less than 5MB'
    return
  }
  
  selectedImageFile.value = file
  avatarError.value = ''
  
  // Create preview URL
  const reader = new FileReader()
  reader.onload = (e) => {
    selectedImagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const clearImageSelection = () => {
  selectedImageFile.value = null
  selectedImagePreview.value = null
  avatarError.value = '' // Clear any image-related errors
  if (avatarInput.value) {
    avatarInput.value.value = ''
  }
}

// Profile form functions
const initializeProfileForm = () => {
  if (user.value) {
    profileForm.value = {
      first_name: user.value.first_name || '',
      last_name: user.value.last_name || '',
      phone: user.value.phone || '',
      gender: user.value.gender || '',
      date_of_birth: user.value.date_of_birth ? user.value.date_of_birth.split('T')[0] : '',
      address: {
        address: user.value.address?.address || '',
        area: user.value.address?.area || '',
        city: user.value.address?.city || '',
        state: user.value.address?.state || '',
        pincode: user.value.address?.pincode || '',
        country: 'India'
      }
    }
  }
}

const closeProfileEdit = () => {
  showProfileEdit.value = false
  profileEditError.value = ''
  profileEditSuccess.value = ''
  clearImageSelection() // Clear any selected image
  initializeProfileForm() // Reset form
}

const updateProfile = async () => {
  profileEditing.value = true
  profileEditError.value = ''
  profileEditSuccess.value = ''
  avatarError.value = '' // Clear any previous image errors
  
  try {
    if (!userStore.token) {
      throw new Error('No authentication token')
    }
    
    let response
    
    // If image is selected, use FormData for multipart upload
    if (selectedImageFile.value) {
      console.log('[PROFILE] Updating with image:', selectedImageFile.value.name)
      const formData = new FormData()
      
      // Laravel requires _method field for PUT requests with FormData
      formData.append('_method', 'PUT')
      formData.append('profile_image', selectedImageFile.value)
      
      // Ensure required fields are not empty
      const firstName = profileForm.value.first_name?.trim()
      const lastName = profileForm.value.last_name?.trim()
      
      if (!firstName) {
        throw new Error('First name is required')
      }
      if (!lastName) {
        throw new Error('Last name is required')
      }
      
      formData.append('first_name', firstName)
      formData.append('last_name', lastName)
      formData.append('phone', profileForm.value.phone?.trim() || '')
      formData.append('gender', profileForm.value.gender || '')
      formData.append('date_of_birth', profileForm.value.date_of_birth || '')
      
      // Add address fields
      formData.append('address[address]', profileForm.value.address.address?.trim() || '')
      formData.append('address[area]', profileForm.value.address.area?.trim() || '')
      formData.append('address[city]', profileForm.value.address.city?.trim() || '')
      formData.append('address[state]', profileForm.value.address.state?.trim() || '')
      formData.append('address[pincode]', profileForm.value.address.pincode?.trim() || '')
      formData.append('address[country]', profileForm.value.address.country || 'India')
      
      console.log('[PROFILE] FormData entries:')
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value)
      }
      
      // Use POST with _method=PUT for Laravel FormData handling
      response = await $fetch(`${API_BASE}/user/profile`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userStore.token}`,
          Accept: 'application/json'
          // Do not set Content-Type - let browser set it with boundary for FormData
        },
        body: formData
      })
    } else {
      console.log('[PROFILE] Updating without image')
      // No image, use regular JSON update
      const { useAuthApi } = await import('@/composables/useApi')
      const authApi = useAuthApi()
      
      response = await authApi.put('user/profile', userStore.token, {
        first_name: profileForm.value.first_name,
        last_name: profileForm.value.last_name,
        phone: profileForm.value.phone,
        gender: profileForm.value.gender,
        date_of_birth: profileForm.value.date_of_birth,
        address: profileForm.value.address
      })
    }
    
    console.log('[PROFILE] Response:', response)
    
    // Update user store with new data
    if (response?.data) {
      userStore.setUser(response.data)
    } else if (response?.user) {
      userStore.setUser(response.user)
    } else if (response) {
      userStore.setUser(response)
    }
    
    // Clear image selection after successful update
    clearImageSelection()
    
    profileEditSuccess.value = 'Profile updated successfully!'
    
    // Close modal after 2 seconds
    setTimeout(() => {
      closeProfileEdit()
    }, 2000)
  } catch (e: any) {
    console.error('[PROFILE] Update failed:', e)
    profileEditError.value = e.data?.message || e.message || 'Failed to update profile'
  } finally {
    profileEditing.value = false
  }
}

// Watch for showProfileEdit to initialize form
watch(showProfileEdit, (newVal) => {
  if (newVal) {
    initializeProfileForm()
  }
})
</script>

<style scoped>
.content-title {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 600;
}

.profile-avatar-section {
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 2rem;
}

.profile-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.profile-field {
  .field-label {
    font-weight: 600;
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    display: block;
  }
  
  .field-value {
    color: var(--text-primary);
    font-size: 1rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--border-color);
  }
}

.alert-success {
  background-color: var(--success-bg, #d1fae5);
  border-color: var(--color-secondary);
  color: var(--color-secondary);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--color-secondary);
}

.alert-danger {
  background-color: var(--error-bg, #fee2e2);
  border-color: var(--text-error);
  color: var(--text-error);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--text-error);
}

.alert-info {
  background-color: var(--background-light, #e3f2fd);
  border-color: var(--color-primary);
  color: var(--text-primary);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--color-primary);
}

.modal {
  z-index: 2000;
}

.modal-content {
  border-radius: 12px;
  border: none;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.modal-header {
  border-bottom: 1px solid var(--border-color);
  padding: 1.5rem;
}

.modal-title {
  color: var(--text-primary);
  font-weight: 600;
}

.modal-body {
  padding: 1.5rem;
}

.form-label {
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
  background-color: var(--background-white);
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
  }
}



/* Ensure date inputs in the modal keep native appearance and have space for the icon */
.modal-content input[type="date"],
input[type="date"].form-input {
}

/* Center the Select/Change Image buttons under the avatar preview */
.modal-body .text-center > .mt-2 {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
}


.spinner-border {
  width: 2rem;
  height: 2rem;
  border: 0.25em solid var(--color-primary);
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner-border-animation 0.75s linear infinite;
}

@keyframes spinner-border-animation {
  to {
    transform: rotate(360deg);
  }
}

</style>
