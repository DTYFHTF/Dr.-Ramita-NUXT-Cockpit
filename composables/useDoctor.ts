// Simple doctor utility functions
export const useDoctor = () => {
  // Format doctor display name
  const formatDoctorName = (doctor: any) => {
    return doctor ? `Dr. ${doctor.name}` : 'Doctor'
  }
  
  // Get default doctor image
  const getDefaultDoctorImage = () => {
    return '/default-doctor.svg'
  }
  
  return {
    formatDoctorName,
    getDefaultDoctorImage
  }
}