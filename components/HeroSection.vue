<template>
  <section class="hero-section bg-cover bg-center text-center py-16" :style="{ backgroundImage: `url('/iamges.jpg')` }">
    <div class="overlay position-absolute top-0 start-0 w-100 h-100"></div>
    <div class="container mx-auto px-4">
      <h1>Dr. Ramita Maharjan</h1>
      <h2 class="mb-8">MD Ayurveda, PGD Panchakarma, PG Yoga (Gold Medalist)</h2>
      <div class=" contact-info text-gray-600 mb-8">
        <p class="flex items-center justify-center mb-2">
          <LucideIcon icon="mdi:phone-message-outline" color="green" class="me-2" />
          <span class="icon-text text-xl">+91-8279374364 | +91-8449421678</span>
        </p>
        <p class="flex  items-center justify-center">
          <LucideIcon icon="mdi:email-edit-outline" color="green" class="me-2" />
          <span class="text-xl">directorrwi@gmail.com</span>
        </p>
      </div>
      <p class="text-lg text-gray-700 mb-8 leading-relaxed">
        Director of Rishicare Wellness and Research Institute, pioneering the integration of
        ancient wisdom with modern wellness through Ayurveda, Yoga, and holistic healing.
      </p>
      
      <div class="button-wrapper">
        <button class="btn btn-smooth-success text-white py-3 px-8 rounded-full flex items-center justify-center text-lg font-semibold" @click="$scrollTo('#book-consultation')">
          Book Consultation
          <LucideIcon icon="mdi:arrow-right" color="white" class="btn-icon ms-2"/>
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import LucideIcon from '@/components/LucideIcon.vue';

</script>

<style scoped lang="scss">
.hero-section {
  background-image: url('/hero-section.jpeg');
  background-size: cover;
  background-position: center;
  min-height: 95vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.overlay {
  background-color: rgba(var(--background-light-rgb), 0.6);
  z-index: 0;
}
.container {
  max-width: 900px;
  width: 90%;
  margin: 0 auto;
  z-index:1;
}

.btn-primary {
  transition: background-color 0.3s ease;
  margin-top:2rem;
}



p,a{
  font-size:1.15em;
}

.button-wrapper {
  display: flex;
  justify-content: center;
}

.button-wrapper a {
  max-width: 250px;
  width: 100%;
}
</style>