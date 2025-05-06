<template>
  <section class="hero-section bg-cover bg-center text-center py-16" :style="{ backgroundImage: `url('/iamges.jpg')` }">
    <div class="overlay position-absolute top-0 start-0 w-100 h-100"></div>
    <div class="container mx-auto px-4">
      <h1 class="head-color text-5xl font-extrabold text-green-900 mb-6">Dr. Ramita Maharjan</h1>
      <h2 class="text-3xl font-semibold text-green-700 mb-8">MD Ayurveda, PGD Panchakarma, PG Yoga (Gold Medalist)</h2>
      <div class=" contact-info text-gray-600 mb-8">
        <p class="flex items-center justify-center mb-2 custom-color">
          <LucideIcon icon="mdi:phone-message-outline" class="me-2" />
          <span class="icon-text text-xl">+91-8279374364 | +91-8449421678</span>
        </p>
        <p class="flex  items-center justify-center">
          <LucideIcon icon="mdi:email-edit-outline" class="me-2 custom-color" />
          <span class="text-xl">directorrwi@gmail.com</span>
        </p>
      </div>
      <p class="text-lg text-gray-700 mb-8 leading-relaxed">
        Director of Rishicare Wellness and Research Institute, pioneering the integration of
        ancient wisdom with modern wellness through Ayurveda, Yoga, and holistic healing.
      </p>
      
      <a href="#" class="btn btn-primary bg-green-700 text-white py-3 px-8 rounded-full hover:bg-green-800 flex items-center justify-center text-lg font-semibold">
        Book Consultation
        <LucideIcon icon="mdi:arrow-right" class=" custom2 me-2"/>
  </a>
    </div>
  </section>
</template>

<script>
import LucideIcon from '@/components/LucideIcon.vue';

</script>

<style scoped>
.hero-section {
  background-image: url('/hero-section.jpeg');
  background-size: cover;
  background-position: center;
  min-height: 95vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  /* color: var(--text-deep-green); */
}
.overlay {
  background-color: rgba(255, 255, 255, 0.5); /* white with 50% opacity */
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
.custom-color ::v-deep(svg) {
  color: var(--text-deep-green);
}
.head-color{
  color:var(--text-deep-green);
  font-weight: 700;
  font-size: 3.5rem;
  font-family: var(--font-primary);
}

p,a{
  font-size:1.15em;
}

.custom2 ::v-deep(svg) {
  color: var(--background-very-light-gray);
}

</style>